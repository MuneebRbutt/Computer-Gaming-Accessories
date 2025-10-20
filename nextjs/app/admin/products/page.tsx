'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED'
  category: { name: string }
  brand: { name: string }
  images: string[]
  quantity: number
  sku: string
  createdAt: string
  _count: { reviews: number }
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [currentPage, searchTerm, statusFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()
      
      setProducts(data.products || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'from-green-500 to-emerald-500', bgColor: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400', icon: CheckCircle },
      INACTIVE: { color: 'from-gray-500 to-slate-500', bgColor: 'from-gray-500/20 to-slate-500/20', text: 'text-gray-400', icon: Clock },
      DRAFT: { color: 'from-yellow-500 to-orange-500', bgColor: 'from-yellow-500/20 to-orange-500/20', text: 'text-yellow-400', icon: AlertTriangle },
      DISCONTINUED: { color: 'from-red-500 to-pink-500', bgColor: 'from-red-500/20 to-pink-500/20', text: 'text-red-400', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.bgColor} ${config.text}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    )
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="text-purple-300 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-purple-300 mt-2">Manage your product catalog and inventory</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="from-purple-500 to-pink-500"
          bgColor="from-purple-500/20 to-pink-500/20"
          change="+5.2%"
          changeType="positive"
        />
        <StatCard
          title="Active Products"
          value={products.filter(p => p.status === 'ACTIVE').length}
          icon={CheckCircle}
          color="from-green-500 to-emerald-500"
          bgColor="from-green-500/20 to-emerald-500/20"
          change="+2.1%"
          changeType="positive"
        />
        <StatCard
          title="Low Stock"
          value={products.filter(p => p.quantity < 10).length}
          icon={AlertTriangle}
          color="from-red-500 to-pink-500"
          bgColor="from-red-500/20 to-pink-500/20"
          change="-1.3%"
          changeType="negative"
        />
        <StatCard
          title="Avg Rating"
          value="4.2"
          icon={Star}
          color="from-yellow-500 to-orange-500"
          bgColor="from-yellow-500/20 to-orange-500/20"
          change="+0.3"
          changeType="positive"
        />
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>
          
          {/* Additional Filters Button */}
          <button className="flex items-center space-x-2 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-slate-600/50 transition-all duration-200">
            <Filter className="w-5 h-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-purple-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {getStatusBadge(product.status)}
              </div>
              
              {/* Actions Menu */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex space-x-1">
                  <button className="p-2 bg-slate-800/80 rounded-lg hover:bg-slate-700/80 transition-colors">
                    <Eye className="w-4 h-4 text-purple-400" />
                  </button>
                  <button className="p-2 bg-slate-800/80 rounded-lg hover:bg-slate-700/80 transition-colors">
                    <Edit className="w-4 h-4 text-blue-400" />
                  </button>
                  <button className="p-2 bg-slate-800/80 rounded-lg hover:bg-slate-700/80 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <div className="mb-3">
                <h3 className="font-semibold text-white text-lg mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {product.title}
                </h3>
                <p className="text-purple-300 text-sm">
                  {product.brand?.name} • {product.category?.name}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-white">
                  ${product.price.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300">
                  SKU: {product.sku}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-purple-300">
                  <Package className="w-4 h-4" />
                  <span>{product.quantity} in stock</span>
                </div>
                <div className="flex items-center space-x-1 text-purple-300">
                  <Star className="w-4 h-4" />
                  <span>{product._count?.reviews || 0} reviews</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all duration-200"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-800/50 border border-purple-500/30 text-purple-300 hover:bg-slate-700/50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  bgColor,
  change,
  changeType
}: { 
  title: string
  value: string | number
  icon: any
  color: string
  bgColor: string
  change?: string
  changeType?: 'positive' | 'negative'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${bgColor} backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-300 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm font-semibold mt-2 ${
              changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className={`bg-gradient-to-r ${color} p-4 rounded-xl shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  )
}