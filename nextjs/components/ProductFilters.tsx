'use client'

import { useMemo } from 'react'
import { Product, CATEGORIES, BRANDS } from '@/lib/data'
import { useFilterStore } from '@/lib/store'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'

interface ProductFiltersProps {
  products: Product[]
}

export default function ProductFilters({ products }: ProductFiltersProps) {
  const {
    search,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    sortBy,
    setSearch,
    setCategory,
    setSubcategory,
    setBrand,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    resetFilters
  } = useFilterStore()

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

  return (
    <div className="bg-card border border-gray-800 rounded-lg p-4 md:p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="grid gap-2">
          <label className="text-xs text-gray-400">Search</label>
          <Input
            type="text"
            placeholder="Search by name or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="grid gap-2">
          <label className="text-xs text-gray-400">Category</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        {/* Subcategory */}
        <div className="grid gap-2">
          <label className="text-xs text-gray-400">Subcategory</label>
          <Select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category}
          >
            <option value="">All</option>
            {subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </Select>
        </div>

        {/* Brand */}
        <div className="grid gap-2">
          <label className="text-xs text-gray-400">Brand</label>
          <Select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">All</option>
            {BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-2">
            <label className="text-xs text-gray-400">Min Price (Rs)</label>
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-gray-400">Max Price (Rs)</label>
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="grid gap-2 md:col-span-3 md:col-start-2">
          <label className="text-xs text-gray-400">Sort By</label>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </Select>
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
