import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, CartService, OrderService } from '@/lib/database'
import { checkInventory, deductInventory } from '@/lib/utils/inventory'
import { sendOrderConfirmationEmail } from '@/lib/utils/email'
import { z } from 'zod'

const checkoutSchema = z.object({
  shippingAddressId: z.string(),
  billingAddressId: z.string(),
  paymentMethod: z.string(),
  shippingMethod: z.string().optional(),
  notes: z.string().optional(),
  discountAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  shippingAmount: z.number().default(0)
})

// POST /api/checkout - Process checkout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get cart items
    const cartItems = await CartService.getCart(user.id)
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate request body
    const body = await request.json()
    const checkoutData = checkoutSchema.parse(body)

    // Check inventory
    const inventoryCheck = await checkInventory(
      cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    )

    if (!inventoryCheck.isValid) {
      return NextResponse.json(
        { error: 'Inventory check failed', details: inventoryCheck.errors },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )
    
    const totalAmount = subtotal + 
      (checkoutData.taxAmount || 0) + 
      (checkoutData.shippingAmount || 0) - 
      (checkoutData.discountAmount || 0)

    // Create order
    const order = await OrderService.createOrder({
      userId: user.id,
      shippingAddressId: checkoutData.shippingAddressId,
      billingAddressId: checkoutData.billingAddressId,
      subtotal,
      taxAmount: checkoutData.taxAmount || 0,
      shippingAmount: checkoutData.shippingAmount || 0,
      discountAmount: checkoutData.discountAmount || 0,
      totalAmount,
      paymentMethod: checkoutData.paymentMethod,
      shippingMethod: checkoutData.shippingMethod,
      notes: checkoutData.notes,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'PENDING',
      items: {
        create: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    })

    // Deduct inventory
    await deductInventory(
      cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    )

    // Clear cart
    await CartService.clearCart(user.id)

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(
        user.email,
        order.orderNumber,
        order.totalAmount,
        cartItems.map(item => ({
          title: item.product.title,
          quantity: item.quantity,
          price: item.price * item.quantity
        }))
      )
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Checkout error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

