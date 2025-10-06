'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Order {
  id: string
  orderNumber: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  items: {
    product: { title: string }
    quantity: number
    price: number
  }[]
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()
      
      setOrders(data.orders || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-600/20 text-green-400'
      case 'SHIPPED':
        return 'bg-blue-600/20 text-blue-400'
      case 'PROCESSING':
        return 'bg-yellow-600/20 text-yellow-400'
      case 'CANCELLED':
        return 'bg-red-600/20 text-red-400'
      default:
        return 'bg-gaming-accent/20 text-gaming-accent'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Orders Management</h1>
        <Button
          onClick={fetchOrders}
          className="bg-gaming-primary hover:bg-gaming-primary/80"
        >
          🔄 Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by order number or customer name..."
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
          <option value="ALL">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
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
                    <th className="text-left p-4 font-semibold text-gaming-muted">Order #</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Customer</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Total</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Status</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Payment</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Date</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gaming-accent/10 hover:bg-gaming-dark/50"
                    >
                      <td className="p-4">
                        <p className="font-medium text-white">#{order.orderNumber}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-sm text-gaming-muted">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gaming-primary">
                        Rs {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} bg-transparent border-none cursor-pointer`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.paymentStatus === 'PAID' 
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-gaming-muted text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          className="text-sm border-gaming-accent/20 hover:border-gaming-primary"
                        >
                          View Details
                        </Button>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gaming-darker rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gaming-accent/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gaming-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Customer Information</h3>
                <div className="bg-gaming-dark rounded-lg p-4 space-y-1">
                  <p className="text-white">
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p className="text-gaming-muted text-sm">{selectedOrder.user.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Order Items</h3>
                <div className="bg-gaming-dark rounded-lg divide-y divide-gaming-accent/10">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.product.title}</p>
                        <p className="text-gaming-muted text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-gaming-primary font-semibold">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gaming-primary/10 rounded-lg p-4 border border-gaming-primary/20">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-gaming-primary">
                    Rs {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
