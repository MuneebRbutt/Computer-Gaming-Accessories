'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  emailVerified: boolean
  createdAt: string
  _count?: {
    orders: number
    reviews: number
  }
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'ALL' && { role: roleFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      setUsers(data.users || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-600/20 text-red-400'
      case 'ADMIN':
        return 'bg-gaming-primary/20 text-gaming-primary'
      default:
        return 'bg-gaming-accent/20 text-gaming-accent'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <Button
          onClick={fetchUsers}
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-gaming-darker border border-gaming-accent/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary"
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="ADMIN">Admins</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </div>

      {/* Users Table */}
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
                    <th className="text-left p-4 font-semibold text-gaming-muted">User</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Email</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Phone</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Role</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Orders</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Reviews</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Joined</th>
                    <th className="text-left p-4 font-semibold text-gaming-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gaming-accent/10 hover:bg-gaming-dark/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gaming-primary/20 flex items-center justify-center text-gaming-primary font-bold">
                            {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.emailVerified && (
                              <span className="text-xs text-green-400">✓ Verified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gaming-muted">{user.email}</td>
                      <td className="p-4 text-gaming-muted">{user.phone || 'N/A'}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)} bg-transparent border-none cursor-pointer`}
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4 text-gaming-accent font-medium">
                        {user._count?.orders || 0}
                      </td>
                      <td className="p-4 text-gaming-accent font-medium">
                        {user._count?.reviews || 0}
                      </td>
                      <td className="p-4 text-gaming-muted text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-gaming-muted hover:text-red-400 transition-colors"
                          title="Delete User"
                        >
                          🗑️
                        </button>
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
