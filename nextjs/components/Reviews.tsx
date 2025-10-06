"use client"

import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  StarHalf, 
  Shield, 
  ThumbsUp, 
  ThumbsDown,
  Flag,
  Gamepad2,
  Monitor,
  Cpu,
  Award,
  Calendar,
  Filter,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Zap
} from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Select } from './ui/Select'
import { cn, formatDate } from '@/lib/utils'

export interface Review {
  id: string
  rating: number
  text: string
  time: number
  verified?: boolean
  helpful?: number
  notHelpful?: number
  userName?: string
  userLevel?: 'Beginner' | 'Enthusiast' | 'Expert' | 'Pro Gamer'
  buildType?: 'Gaming' | 'Workstation' | 'Budget' | 'High-End' | 'Streaming'
  gamesFps?: Record<string, number> // Game name -> FPS achieved
  pros?: string[]
  cons?: string[]
  wouldRecommend?: boolean
  monthsOwned?: number
  previousBuild?: string
}

interface ReviewsProps {
  sku: string
  productName?: string
  category?: string
}

function StarRating({ rating, size = 'sm', showHalf = true }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  showHalf?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = showHalf && rating >= star - 0.5 && rating < star
        
        return (
          <div key={star} className="relative">
            {half ? (
              <StarHalf className={cn('text-yellow-400 fill-yellow-400', sizeClasses[size])} />
            ) : (
              <Star className={cn(
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600',
                sizeClasses[size]
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function UserLevelBadge({ level }: { level: Review['userLevel'] }) {
  const levelConfig = {
    'Beginner': { color: 'text-green-400', bg: 'bg-green-500/20', icon: Monitor },
    'Enthusiast': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Cpu },
    'Expert': { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Zap },
    'Pro Gamer': { color: 'text-accent', bg: 'bg-accent/20', icon: Award }
  }
  
  if (!level) return null
  
  const config = levelConfig[level]
  const Icon = config.icon
  
  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.bg, config.color)}>
      <Icon className="w-3 h-3" />
      {level}
    </div>
  )
}

export default function Reviews({ sku, productName, category }: ReviewsProps) {
  const KEY = `ait-reviews-${sku}`
  
  const load = (): Review[] => {
    try { 
      const data = localStorage.getItem(KEY)
      return data ? JSON.parse(data) : []
    } catch { 
      return [] 
    }
  }
  
  const save = (list: Review[]) => localStorage.setItem(KEY, JSON.stringify(list))

  const [reviews, setReviews] = useState<Review[]>(load())
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [pros, setPros] = useState<string[]>([''])
  const [cons, setCons] = useState<string[]>([''])
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [sort, setSort] = useState<'new' | 'helpful' | 'high' | 'low'>('new')
  const [filter, setFilter] = useState<'all' | 'verified' | 'recommended'>('all')
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...reviews]
    
    // Apply filters
    if (filter === 'verified') {
      filtered = filtered.filter(r => r.verified)
    } else if (filter === 'recommended') {
      filtered = filtered.filter(r => r.wouldRecommend)
    }
    
    // Apply sorting
    if (sort === 'new') filtered.sort((a, b) => b.time - a.time)
    if (sort === 'high') filtered.sort((a, b) => b.rating - a.rating)
    if (sort === 'low') filtered.sort((a, b) => a.rating - b.rating)
    if (sort === 'helpful') filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0))
    
    return filtered
  }, [reviews, sort, filter])

  const stats = useMemo(() => {
    if (reviews.length === 0) return null
    
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
    }))
    
    const verifiedCount = reviews.filter(r => r.verified).length
    const recommendedCount = reviews.filter(r => r.wouldRecommend).length
    
    return {
      average: avg,
      total: reviews.length,
      distribution,
      verifiedPercentage: (verifiedCount / reviews.length) * 100,
      recommendedPercentage: recommendedCount > 0 ? (recommendedCount / reviews.length) * 100 : 0
    }
  }, [reviews])

  const handleVoteHelpful = useCallback((reviewId: string, helpful: boolean) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpful: helpful ? (r.helpful || 0) + 1 : r.helpful,
          notHelpful: !helpful ? (r.notHelpful || 0) + 1 : r.notHelpful
        }
      }
      return r
    }))
    
    setHelpfulVotes(prev => ({ ...prev, [reviewId]: helpful }))
  }, [])

  const submitReview = useCallback(() => {
    if (!text.trim()) return
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      rating,
      text: text.trim(),
      time: Date.now(),
      verified: Math.random() > 0.3, // 70% chance of verified
      userName: `User${Math.floor(Math.random() * 9999)}`,
      userLevel: ['Beginner', 'Enthusiast', 'Expert', 'Pro Gamer'][Math.floor(Math.random() * 4)] as Review['userLevel'],
      buildType: ['Gaming', 'Workstation', 'Budget', 'High-End', 'Streaming'][Math.floor(Math.random() * 5)] as Review['buildType'],
      pros: pros.filter(p => p.trim()),
      cons: cons.filter(c => c.trim()),
      wouldRecommend,
      monthsOwned: Math.floor(Math.random() * 24) + 1,
      helpful: 0,
      notHelpful: 0
    }
    
    // Add gaming performance data for GPUs
    if (category === 'Graphics Cards' && Math.random() > 0.5) {
      newReview.gamesFps = {
        'Cyberpunk 2077': Math.floor(Math.random() * 60) + 40,
        'Call of Duty': Math.floor(Math.random() * 80) + 60,
        'Fortnite': Math.floor(Math.random() * 100) + 80,
        'Valorant': Math.floor(Math.random() * 200) + 150
      }
    }
    
    const updatedReviews = [newReview, ...reviews]
    setReviews(updatedReviews)
    save(updatedReviews)
    
    // Reset form
    setText('')
    setRating(5)
    setPros([''])
    setCons([''])
    setWouldRecommend(true)
    setShowWriteReview(false)
  }, [text, rating, pros, cons, wouldRecommend, reviews, category])

  return (
    <div className="bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-text-primary">Customer Reviews</h3>
            {productName && (
              <Badge variant="outline" size="sm">{productName}</Badge>
            )}
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowWriteReview(!showWriteReview)}
          >
            Write Review
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {stats.average.toFixed(1)}
              </div>
              <StarRating rating={stats.average} size="md" />
              <div className="text-sm text-text-muted mt-1">
                {stats.total} reviews
              </div>
            </div>
            
            <div className="space-y-2">
              {stats.distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-text-muted">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-bg-dark/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: star * 0.1 }}
                      className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <span className="w-8 text-text-muted text-xs">{count}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {stats.verifiedPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-text-muted flex items-center justify-center gap-1">
                <Shield className="w-4 h-4" />
                Verified Purchases
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {stats.recommendedPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-text-muted flex items-center justify-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                Would Recommend
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Write Review Form */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-primary/10"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <Star className={cn(
                        'w-6 h-6 transition-colors duration-200',
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-yellow-200'
                      )} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this product..."
                  className="w-full bg-bg-dark/50 border border-primary/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-green-400">Pros</label>
                  {pros.map((pro, index) => (
                    <input
                      key={index}
                      value={pro}
                      onChange={(e) => {
                        const newPros = [...pros]
                        newPros[index] = e.target.value
                        if (index === pros.length - 1 && e.target.value) {
                          newPros.push('')
                        }
                        setPros(newPros.filter((p, i) => p || i === newPros.length - 1))
                      }}
                      placeholder="What did you like?"
                      className="w-full mb-2 bg-bg-dark/50 border border-green-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/50"
                    />
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-red-400">Cons</label>
                  {cons.map((con, index) => (
                    <input
                      key={index}
                      value={con}
                      onChange={(e) => {
                        const newCons = [...cons]
                        newCons[index] = e.target.value
                        if (index === cons.length - 1 && e.target.value) {
                          newCons.push('')
                        }
                        setCons(newCons.filter((c, i) => c || i === newCons.length - 1))
                      }}
                      placeholder="Any issues or improvements?"
                      className="w-full mb-2 bg-bg-dark/50 border border-red-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500/50"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                    className="rounded border-primary/20 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm">I would recommend this product</span>
                </label>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWriteReview(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={submitReview}
                    disabled={!text.trim()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Sorting */}
      <div className="p-4 border-b border-primary/10 bg-bg-dark/20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-bg-dark/50 border-primary/20"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Only</option>
              <option value="recommended">Recommended</option>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-text-muted" />
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-bg-dark/50 border-primary/20"
            >
              <option value="new">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="high">Highest Rating</option>
              <option value="low">Lowest Rating</option>
            </Select>
          </div>
          
          <div className="text-sm text-text-muted">
            Showing {sortedAndFiltered.length} of {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6">
        {sortedAndFiltered.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Reviews Yet</h3>
            <p className="text-text-muted mb-4">Be the first to review this product!</p>
            <Button variant="primary" onClick={() => setShowWriteReview(true)}>
              Write First Review
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedAndFiltered.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-dark/30 border border-primary/10 rounded-xl p-4 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                      {review.userName?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">{review.userName}</span>
                        <UserLevelBadge level={review.userLevel} />
                        {review.verified && (
                          <Badge variant="success" size="sm">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-text-muted">
                          {formatDate(new Date(review.time))}
                        </span>
                        {review.monthsOwned && (
                          <span className="text-xs text-text-muted">
                            • Owned for {review.monthsOwned} months
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {review.wouldRecommend && (
                    <Badge variant="success" size="sm">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Recommends
                    </Badge>
                  )}
                </div>

                <p className="text-text-primary mb-4 leading-relaxed">{review.text}</p>

                {/* Pros and Cons */}
                {(review.pros?.length || review.cons?.length) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                              <span className="text-green-400 mt-1">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
                          <Flag className="w-4 h-4" />
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                              <span className="text-red-400 mt-1">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Gaming Performance */}
                {review.gamesFps && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                      <Gamepad2 className="w-4 h-4" />
                      Gaming Performance
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(review.gamesFps).map(([game, fps]) => (
                        <div key={game} className="text-center">
                          <div className="text-lg font-bold text-accent">{fps}</div>
                          <div className="text-xs text-text-muted">{game}</div>
                          <div className="text-xs text-text-muted">FPS</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVoteHelpful(review.id, true)}
                      disabled={helpfulVotes[review.id] !== undefined}
                      className={cn(
                        'flex items-center gap-1 text-sm transition-colors duration-200',
                        helpfulVotes[review.id] === true
                          ? 'text-green-400'
                          : 'text-text-muted hover:text-green-400'
                      )}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful || 0})
                    </button>
                    
                    <button
                      onClick={() => handleVoteHelpful(review.id, false)}
                      disabled={helpfulVotes[review.id] !== undefined}
                      className={cn(
                        'flex items-center gap-1 text-sm transition-colors duration-200',
                        helpfulVotes[review.id] === false
                          ? 'text-red-400'
                          : 'text-text-muted hover:text-red-400'
                      )}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Not Helpful ({review.notHelpful || 0})
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {review.buildType && (
                      <Badge variant="outline" size="sm">
                        {review.buildType} Build
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


