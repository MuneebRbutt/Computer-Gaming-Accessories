'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  product: {
    id: string
    title: string
  }
  user: {
    firstName: string
    lastName: string
    email: string
  }
  verified: boolean
  helpful: number
  createdAt: string
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchReviews()
  }, [currentPage, filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(filter !== 'ALL' && { verified: filter === 'VERIFIED' ? 'true' : 'false' })
      })

      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()
      
      setReviews(data.reviews || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVerification = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus })
      })

      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to update review:', error)
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Reviews Management</h1>
        <Button
          onClick={fetchReviews}
          className="bg-gaming-primary hover:bg-gaming-primary/80"
        >
          🔄 Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-gaming-darker border border-gaming-accent/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-primary"
        >
          <option value="ALL">All Reviews</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="UNVERIFIED">Unverified Only</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-primary"></div>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{renderStars(review.rating)}</span>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{review.title}</h3>
                  <p className="text-gaming-muted text-sm mb-2">
                    by {review.user.firstName} {review.user.lastName} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gaming-muted text-sm mb-3">
                    Product: <span className="text-gaming-accent">{review.product.title}</span>
                  </p>
                  <p className="text-white">{review.comment}</p>
                  
                  <div className="mt-3 text-sm text-gaming-muted">
                    👍 {review.helpful} people found this helpful
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => toggleVerification(review.id, review.verified)}
                    variant="outline"
                    className={`text-sm ${
                      review.verified 
                        ? 'border-green-400/20 text-green-400 hover:border-green-400' 
                        : 'border-yellow-400/20 text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    {review.verified ? '✓ Verified' : 'Verify'}
                  </Button>
                  <Button
                    onClick={() => deleteReview(review.id)}
                    variant="outline"
                    className="text-sm border-red-400/20 text-red-400 hover:border-red-400"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gaming-darker rounded-xl p-4 border border-gaming-accent/20">
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
      )}
    </div>
  )
}
