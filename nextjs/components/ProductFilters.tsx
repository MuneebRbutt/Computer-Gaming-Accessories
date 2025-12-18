"use client"

import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Product, CATEGORIES, BRANDS } from '@/lib/data'
import { useFilterStore } from '@/lib/store'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { cn, debounce } from '@/lib/utils'

interface ProductFiltersProps {
  products: Product[]
  className?: string
}

export default function ProductFilters({ products, className }: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])

  const {
    search,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    sortBy,
    view,
    setSearch,
    setCategory,
    setSubcategory,
    setBrand,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    setView,
    resetFilters
  } = useFilterStore()

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    [setSearch]
  )

  const subcategories = useMemo(() => {
    if (!category) return []
    return Array.from(
      new Set(
        products
          .filter(p => p.category === category)
          .map(p => p.subcategory)
          .filter(Boolean)
      )
    ).sort()
  }, [products, category])

  const priceStats = useMemo(() => {
    const prices = products.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    }
  }, [products])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search) count++
    if (category) count++
    if (subcategory) count++
    if (brand) count++
    if (minPrice > 0) count++
    if (maxPrice > 0) count++
    return count
  }, [search, category, subcategory, brand, minPrice, maxPrice])

  const quickFilters = [
    { label: 'Gaming PCs', action: () => setCategory('Gaming PCs'), icon: Zap },
    { label: 'Top Rated', action: () => setSortBy('rating-desc'), icon: Star },
    { label: 'Trending', action: () => setSortBy('popularity-desc'), icon: TrendingUp },
  ]

  return (
    <div className={cn(
      'bg-gaming-card border border-white/5 rounded-2xl overflow-hidden',
      'shadow-glass hover:shadow-neon hover:border-gaming-primary/30',
      'transition-all duration-300',
      className
    )}>
      {/* Quick Filters Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gaming-primary" />
            <h3 className="text-lg font-display font-bold text-white">
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="default" size="sm" className="bg-gaming-primary text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
              <Button
                variant={view === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className={cn(
                  "!p-2 text-white hover:text-white transition-all",
                  view === 'grid' ? "bg-gaming-primary shadow-neon" : "hover:bg-white/10"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className={cn(
                  "!p-2 text-white hover:text-white transition-all",
                  view === 'list' ? "bg-gaming-primary shadow-neon" : "hover:bg-white/10"
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Expand Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="!p-2 text-gray-400 hover:text-white hover:bg-white/10"
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <SlidersHorizontal className={cn(
                'w-4 h-4 transition-transform duration-300',
                isExpanded && 'rotate-180'
              )} />
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, index) => {
            const Icon = filter.icon
            return (
              <motion.button
                key={filter.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={filter.action}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gaming-surface border border-white/10 text-xs text-gray-300 font-medium hover:bg-gaming-primary hover:text-white hover:border-gaming-primary hover:shadow-neon transition-all duration-300 group"
              >
                <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                {filter.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Main Search */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search gear..."
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-11 bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary focus:ring-gaming-primary"
            aria-label="Search products"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 !p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6 bg-white/[0.01]">
              {/* Category & Brand Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Category
                    {category && (
                      <Badge variant="outline" size="sm" className="border-gaming-primary text-gaming-primary">
                        {category}
                      </Badge>
                    )}
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      setSubcategory('') // Reset subcategory when category changes
                    }}
                    className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary"
                  >
                    <option value="" className="text-gray-900">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name} className="text-gray-900">{cat.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Subcategory
                    {subcategory && (
                      <Badge variant="outline" size="sm" className="border-gaming-primary text-gaming-primary">
                        {subcategory}
                      </Badge>
                    )}
                  </label>
                  <Select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={!category}
                    className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary disabled:opacity-50"
                  >
                    <option value="" className="text-gray-900">All Subcategories</option>
                    {subcategories.map(sub => (
                      <option key={sub} value={sub} className="text-gray-900">{sub}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Brand
                    {brand && (
                      <Badge variant="outline" size="sm" className="border-gaming-primary text-gaming-primary">
                        {brand}
                      </Badge>
                    )}
                  </label>
                  <Select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary"
                  >
                    <option value="" className="text-gray-900">All Brands</option>
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.name} className="text-gray-900">{b.name}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Price Range (Rs)
                  </label>
                  <div className="text-xs text-gaming-text-muted font-mono">
                    Min: {priceStats.min.toLocaleString()} •
                    Max: {priceStats.max.toLocaleString()} •
                    Avg: {priceStats.avg.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gaming-text-muted">Minimum Price</label>
                    <Input
                      type="number"
                      min="0"
                      max={priceStats.max}
                      placeholder={`Min (${priceStats.min.toLocaleString()})`}
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                      className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gaming-text-muted">Maximum Price</label>
                    <Input
                      type="number"
                      min="0"
                      max={priceStats.max}
                      placeholder={`Max (${priceStats.max.toLocaleString()})`}
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                      className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Sort By</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gaming-surface border-white/10 text-white focus:border-gaming-primary"
                >
                  <option value="default" className="text-gray-900">Default Order</option>
                  <option value="price-asc" className="text-gray-900">Price: Low to High</option>
                  <option value="price-desc" className="text-gray-900">Price: High to Low</option>
                  <option value="name-asc" className="text-gray-900">Name: A → Z</option>
                  <option value="name-desc" className="text-gray-900">Name: Z → A</option>
                  <option value="rating-desc" className="text-gray-900">Highest Rated</option>
                  <option value="popularity-desc" className="text-gray-900">Most Popular</option>
                  <option value="newest" className="text-gray-900">Newest First</option>
                </Select>
              </div>

              {/* Reset Button */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-white/10"
                >
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 group"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                    Reset All Filters ({activeFiltersCount})
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
