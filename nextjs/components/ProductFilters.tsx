'use client'

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
  const debouncedSearch = useCallback(
    debounce((value: string) => setSearch(value), 300),
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
      'bg-white border border-gray-200 rounded-xl overflow-hidden',
      'shadow-sm hover:shadow-md',
      'transition-all duration-300',
      className
    )}>
      {/* Quick Filters Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="default" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={view === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className="!p-2"
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="!p-2"
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
              className="!p-2"
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {filter.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Main Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search gaming gear, brands, specs..."
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Search products"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 !p-1 hover:bg-red-500/20"
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
            <div className="p-4 space-y-6">
              {/* Category & Brand Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    Category
                    {category && (
                      <Badge variant="outline" size="sm">
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
                    className="bg-gray-50 border-gray-200 focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    Subcategory
                    {subcategory && (
                      <Badge variant="outline" size="sm">
                        {subcategory}
                      </Badge>
                    )}
                  </label>
                  <Select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={!category}
                    className="bg-bg-dark/50 border-primary/20 focus:border-primary/50 disabled:opacity-50"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                    Brand
                    {brand && (
                      <Badge variant="outline" size="sm">
                        {brand}
                      </Badge>
                    )}
                  </label>
                  <Select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="bg-bg-dark/50 border-primary/20 focus:border-primary/50"
                  >
                    <option value="">All Brands</option>
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">
                    Price Range (Rs)
                  </label>
                  <div className="text-xs text-text-muted">
                    Min: Rs {priceStats.min.toLocaleString()} • 
                    Max: Rs {priceStats.max.toLocaleString()} • 
                    Avg: Rs {priceStats.avg.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">Minimum Price</label>
                    <Input
                      type="number"
                      min="0"
                      max={priceStats.max}
                      placeholder={`Min (${priceStats.min.toLocaleString()})`}
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                      className="bg-bg-dark/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">Maximum Price</label>
                    <Input
                      type="number"
                      min="0"
                      max={priceStats.max}
                      placeholder={`Max (${priceStats.max.toLocaleString()})`}
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                      className="bg-bg-dark/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Sort By</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-bg-dark/50 border-primary/20 focus:border-primary/50"
                >
                  <option value="default">Default Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A → Z</option>
                  <option value="name-desc">Name: Z → A</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="popularity-desc">Most Popular</option>
                  <option value="newest">Newest First</option>
                </Select>
              </div>

              {/* Reset Button */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-primary/10"
                >
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full group hover:border-red-500/50 hover:text-red-400"
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
