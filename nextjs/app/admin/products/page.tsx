'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Product {
  id: string
  title: string
  price: number
  category: { name: string }
  brand?: { name: string }
  status: string
  quantity: number
  featured: boolean
  createdAt: string
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, statusFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
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

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to update product status:', error)
    }
  }

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured })
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to update product featured status:', error)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Products Management</h1>
        <a href="/admin/products/new">
          <Button className="bg-gaming-primary hover:bg-gaming-primary/80">
            ➕ Add New Product
          </Button>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gaming-darker border border-gaming-accent/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
          <option value="DISCONTINUED">Discontinued</option>
        </select>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gaming-darker rounded-xl border border-gaming-accent/20 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-primary"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gaming-dark border-b border-gaming-accent/20">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Product</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Category</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Brand</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Price</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Stock</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Status</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Featured</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gaming-accent/10 hover:bg-gaming-dark/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{product.title}</p>
                          <p className="text-sm text-gaming-muted">ID: {product.id.slice(-8)}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gaming-muted">{product.category.name}</td>
                      <td className="p-4 text-gaming-muted">{product.brand?.name || 'N/A'}</td>
                      <td className="p-4 font-semibold text-gaming-primary">
                        Rs {product.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${product.quantity > 10 ? 'bg-green-600/20 text-green-400' :
                            product.quantity > 0 ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'}
                        `}>
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleProductStatus(product.id, product.status)}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium cursor-pointer
                            ${product.status === 'ACTIVE' ? 'bg-green-600/20 text-green-400' :
                              product.status === 'INACTIVE' ? 'bg-red-600/20 text-red-400' :
                              'bg-yellow-600/20 text-yellow-400'}
                          `}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleFeatured(product.id, product.featured)}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium cursor-pointer
                            ${product.featured ? 'bg-gaming-primary/20 text-gaming-primary' : 'bg-gaming-accent/20 text-gaming-muted'}
                          `}
                        >
                          {product.featured ? '⭐ Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/admin/products/${product.id}/edit`, '_blank')}
                            className="p-2 text-gaming-muted hover:text-gaming-primary transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => window.open(`/products/${product.id}`, '_blank')}
                            className="p-2 text-gaming-muted hover:text-gaming-accent transition-colors"
                            title="View"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gaming-muted hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gaming-accent/20">
                <div className="flex items-center justify-between">
                  <p className="text-gaming-muted text-sm">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gaming-dark rounded disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gaming-accent/20"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gaming-dark rounded disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gaming-accent/20"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}