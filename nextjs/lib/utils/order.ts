import { prisma } from '../prisma'

/**
 * Generate a unique order number
 * Format: ORD-YYYY-MMDD-XXXXX
 * Example: ORD-2024-1201-00001
 */
export async function generateOrderNumber(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePrefix = `${year}-${month}${day}`
  
  // Find the highest order number for today
  const todayOrders = await prisma.order.findMany({
    where: {
      orderNumber: {
        startsWith: `ORD-${datePrefix}-`
      }
    },
    orderBy: {
      orderNumber: 'desc'
    },
    take: 1
  })

  let sequence = 1
  if (todayOrders.length > 0) {
    const lastOrderNumber = todayOrders[0].orderNumber
    const lastSequence = parseInt(lastOrderNumber.split('-').pop() || '0')
    sequence = lastSequence + 1
  }

  const sequenceStr = String(sequence).padStart(5, '0')
  return `ORD-${datePrefix}-${sequenceStr}`
}

