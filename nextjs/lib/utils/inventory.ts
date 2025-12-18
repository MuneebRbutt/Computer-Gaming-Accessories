import { prisma } from '../prisma'

/**
 * Update product inventory when order is created
 */
export async function deductInventory(orderItems: Array<{ productId: string; quantity: number }>) {
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: {
          decrement: item.quantity
        }
      }
    })
  }
}

/**
 * Restore inventory when order is cancelled
 */
export async function restoreInventory(orderItems: Array<{ productId: string; quantity: number }>) {
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: {
          increment: item.quantity
        }
      }
    })
  }
}

/**
 * Check if products have sufficient inventory
 */
export async function checkInventory(items: Array<{ productId: string; quantity: number }>) {
  const productIds = items.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      trackQuantity: true
    }
  })

  const errors: string[] = []
  
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)
    if (!product) {
      errors.push(`Product ${item.productId} not found`)
      continue
    }
    
    if (product.trackQuantity && product.quantity < item.quantity) {
      errors.push(`Insufficient stock for ${product.title}. Available: ${product.quantity}, Requested: ${item.quantity}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

