import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { restoreInventory } from '@/lib/utils/inventory'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// POST /api/payment/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  try {
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order payment status
        await prisma.order.updateMany({
          where: {
            paymentId: paymentIntent.id
          },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED'
          }
        })
        
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order payment status
        await prisma.order.updateMany({
          where: {
            paymentId: paymentIntent.id
          },
          data: {
            paymentStatus: 'FAILED'
          }
        })
        
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Find order and restore inventory
        const order = await prisma.order.findFirst({
          where: {
            paymentId: charge.payment_intent as string
          },
          include: {
            items: true
          }
        })

        if (order) {
          // Restore inventory
          await restoreInventory(
            order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }))
          )

          // Update order status
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'REFUNDED',
              status: 'REFUNDED'
            }
          })
        }
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

