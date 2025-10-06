'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface AnalyticsData {
  revenue: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
  orders: {
    total: number
    pending: number
    processing: number
    completed: number
  }
  products: {
    total: number
    lowStock: number
    outOfStock: number
  }
  customers: {
    total: number
    newThisMonth: number
  }
  topProducts: Array<{
    id: string
    title: string
    sales: number
    revenue: number
  }>
  recentSales: Array<{
    date: string
    amount: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gaming-darker border border-gaming-accent/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`Rs ${data?.revenue.total.toLocaleString() || 0}`}
          icon="💰"
          color="bg-green-600"
        />
        <StatCard
          title="Today's Revenue"
          value={`Rs ${data?.revenue.today.toLocaleString() || 0}`}
          icon="📈"
          color="bg-gaming-primary"
        />
        <StatCard
          title="This Week"
          value={`Rs ${data?.revenue.thisWeek.toLocaleString() || 0}`}
          icon="📊"
          color="bg-gaming-secondary"
        />
        <StatCard
          title="This Month"
          value={`Rs ${data?.revenue.thisMonth.toLocaleString() || 0}`}
          icon="💵"
          color="bg-gaming-accent"
        />
      </div>

      {/* Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">Order Statistics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Total Orders</span>
              <span className="text-white font-bold">{data?.orders.total || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Pending</span>
              <span className="text-yellow-400 font-bold">{data?.orders.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Processing</span>
              <span className="text-blue-400 font-bold">{data?.orders.processing || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Completed</span>
              <span className="text-green-400 font-bold">{data?.orders.completed || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">Product Statistics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Total Products</span>
              <span className="text-white font-bold">{data?.products.total || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Low Stock</span>
              <span className="text-yellow-400 font-bold">{data?.products.lowStock || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">Out of Stock</span>
              <span className="text-red-400 font-bold">{data?.products.outOfStock || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <span className="text-gaming-muted">New Customers</span>
              <span className="text-gaming-primary font-bold">{data?.customers.newThisMonth || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
      >
        <h2 className="text-xl font-bold text-white mb-4">Top Selling Products</h2>
        <div className="space-y-3">
          {data?.topProducts?.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gaming-dark/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gaming-primary">#{index + 1}</span>
                <div>
                  <p className="font-medium text-white">{product.title}</p>
                  <p className="text-sm text-gaming-muted">{product.sales} sales</p>
                </div>
              </div>
              <p className="font-bold text-gaming-accent">
                Rs {product.revenue.toLocaleString()}
              </p>
            </div>
          )) || <p className="text-gaming-muted text-center p-4">No sales data available</p>}
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
