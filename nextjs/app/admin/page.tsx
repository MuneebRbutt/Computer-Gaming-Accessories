'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
  lowStockProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-gaming-primary text-white rounded-lg font-medium hover:bg-gaming-primary/80 transition-colors"
        >
          🔄 Refresh
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon="🎮"
          color="bg-gaming-primary"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="bg-gaming-secondary"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon="📦"
          color="bg-gaming-accent"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs ${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon="💰"
          color="bg-green-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            📦 Recent Orders
          </h2>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order, index) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">#{order.orderNumber}</p>
                  <p className="text-sm text-gaming-muted">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gaming-primary">Rs {order.totalAmount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'DELIVERED' ? 'bg-green-600/20 text-green-400' :
                    order.status === 'PROCESSING' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gaming-accent/20 text-gaming-accent'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) || <p className="text-gaming-muted">No recent orders</p>}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            🏆 Top Selling Products
          </h2>
          <div className="space-y-3">
            {stats?.topProducts?.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 bg-gaming-dark/50 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-lg font-bold text-gaming-primary">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white truncate">{product.title}</p>
                  <p className="text-sm text-gaming-muted">
                    {product._count?.orderItems || 0} sales
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gaming-accent">Rs {product.price.toLocaleString()}</p>
                </div>
              </div>
            )) || <p className="text-gaming-muted">No sales data</p>}
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-600/10 border border-red-600/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            ⚠️ Low Stock Alert
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="bg-gaming-darker p-4 rounded-lg border border-red-600/20">
                <p className="font-medium text-white">{product.title}</p>
                <p className="text-sm text-gaming-muted">SKU: {product.sku}</p>
                <p className="text-red-400 font-bold">
                  Only {product.quantity} left in stock
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton href="/admin/products/new" icon="➕" label="Add Product" />
          <QuickActionButton href="/admin/orders" icon="📦" label="View Orders" />
          <QuickActionButton href="/admin/users" icon="👥" label="Manage Users" />
          <QuickActionButton href="/admin/analytics" icon="📊" label="View Reports" />
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: string | number
  icon: string
  color: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gaming-muted text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  )
}

function QuickActionButton({ 
  href, 
  icon, 
  label 
}: { 
  href: string
  icon: string
  label: string 
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center p-4 bg-gaming-dark/50 rounded-lg border border-gaming-accent/20 hover:border-gaming-primary/50 transition-all duration-200"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gaming-muted group-hover:text-white">{label}</span>
    </motion.a>
  )
}