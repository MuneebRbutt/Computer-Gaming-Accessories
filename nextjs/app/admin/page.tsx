'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="text-purple-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-purple-300 mt-2">Welcome to your admin dashboard!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$25,430"
          icon="💰"
          color="from-green-500 to-emerald-500"
          bgColor="from-green-500/20 to-emerald-500/20"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          icon="📦"
          color="from-blue-500 to-cyan-500"
          bgColor="from-blue-500/20 to-cyan-500/20"
        />
        <StatCard
          title="Total Products"
          value="89"
          icon="🎮"
          color="from-purple-500 to-pink-500"
          bgColor="from-purple-500/20 to-pink-500/20"
        />
        <StatCard
          title="Total Users"
          value="456"
          icon="👥"
          color="from-orange-500 to-red-500"
          bgColor="from-orange-500/20 to-red-500/20"
        />
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎉 Admin Panel Successfully Loaded!</h2>
          <p className="text-purple-300 text-lg mb-6">
            Your gaming store admin panel is now working perfectly. You can manage your products, 
            orders, users, and more from this beautiful interface.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-700/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">🎮 Products</h3>
              <p className="text-purple-300 text-sm">Manage your gaming products and inventory</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">📦 Orders</h3>
              <p className="text-purple-300 text-sm">Track and manage customer orders</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">👥 Users</h3>
              <p className="text-purple-300 text-sm">Manage customer accounts and permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton href="/admin/products/new" icon="➕" label="Add Product" />
          <QuickActionButton href="/admin/orders" icon="📦" label="View Orders" />
          <QuickActionButton href="/admin/users" icon="👥" label="Manage Users" />
          <QuickActionButton href="/admin/analytics" icon="📊" label="View Reports" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color,
  bgColor
}: { 
  title: string
  value: string | number
  icon: string
  color: string
  bgColor: string
}) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-300 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`bg-gradient-to-r ${color} p-4 rounded-xl shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
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
    <a
      href={href}
      className="flex flex-col items-center justify-center p-6 bg-slate-700/30 rounded-xl border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-700/50 transition-all duration-300 group"
    >
      <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <span className="text-sm font-medium text-purple-300 group-hover:text-white transition-colors duration-300">{label}</span>
    </a>
  )
}