import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/database'
import prisma from '@/lib/prisma'
import { PRODUCTS } from '@/lib/data'

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    // Mock mode: return static analytics without DB/auth
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      const now = new Date()
      const recentSales = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now)
        d.setDate(now.getDate() - i)
        const base = 20000 + (i * 1500)
        return { date: d.toISOString(), amount: base }
      }).reverse()

      const topProducts = PRODUCTS.slice(0, 5).map((p, i) => {
        const sales = Math.max(10, 45 - i * 7)
        return {
          id: p.id,
          title: p.title,
          sales,
          revenue: sales * (p.price || 0)
        }
      })

      return NextResponse.json({
        revenue: {
          total: 350000,
          today: 15000,
          thisWeek: 90000,
          thisMonth: 250000
        },
        orders: {
          total: 123,
          pending: 7,
          processing: 12,
          completed: 104
        },
        products: {
          total: PRODUCTS.length,
          lowStock: 5,
          outOfStock: 2
        },
        customers: {
          total: 2500,
          newThisMonth: 120
        },
        topProducts,
        recentSales
      })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7days'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case '7days':
        startDate.setDate(now.getDate() - 7)
        break
      case '30days':
        startDate.setDate(now.getDate() - 30)
        break
      case '90days':
        startDate.setDate(now.getDate() - 90)
        break
    }

    // Get revenue statistics
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      select: {
        totalAmount: true,
        createdAt: true,
        status: true
      }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayRevenue = orders
      .filter(o => o.createdAt >= todayStart)
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const weekStart = new Date()
    weekStart.setDate(now.getDate() - 7)
    const weekRevenue = orders
      .filter(o => o.createdAt >= weekStart)
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const monthStart = new Date()
    monthStart.setDate(now.getDate() - 30)
    const monthRevenue = orders
      .filter(o => o.createdAt >= monthStart)
      .reduce((sum, order) => sum + order.totalAmount, 0)

    // Get order statistics
    const [totalOrders, pendingOrders, processingOrders, completedOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } })
    ])

    // Get product statistics
    const [totalProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { quantity: { lte: 10, gt: 0 } } }),
      prisma.product.count({ where: { quantity: 0 } })
    ])

    // Get customer statistics
    const monthAgo = new Date()
    monthAgo.setMonth(now.getMonth() - 1)
    const [totalCustomers, newCustomers] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: monthAgo } } })
    ])

    // Get top products
    const topProducts = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      }
    })

    const topProductsWithRevenue = topProducts.map(product => ({
      id: product.id,
      title: product.title,
      sales: product._count.orderItems,
      revenue: product.price * product._count.orderItems
    }))

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        thisWeek: weekRevenue,
        thisMonth: monthRevenue
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomers
      },
      topProducts: topProductsWithRevenue,
      recentSales: orders.slice(0, 7).map(order => ({
        date: order.createdAt.toISOString(),
        amount: order.totalAmount
      }))
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
