'use client'

import { useMemo } from 'react'
import { Product } from '@/lib/data'
import { useFilterStore } from '@/lib/store'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { search, category, subcategory, brand, minPrice, maxPrice, sortBy, view } = useFilterStore()

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !search || 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = !category || product.category === category
      const matchesSubcategory = !subcategory || product.subcategory === subcategory
      const matchesBrand = !brand || product.brand === brand
      const matchesMinPrice = !minPrice || product.price >= minPrice
      const matchesMaxPrice = !maxPrice || product.price <= maxPrice

      return matchesSearch && matchesCategory && matchesSubcategory && 
             matchesBrand && matchesMinPrice && matchesMaxPrice
    })

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        // Keep original order
        break
    }

    return filtered
  }, [products, search, category, subcategory, brand, minPrice, maxPrice, sortBy])

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm mt-6">
        No products match your filters.
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="space-y-4">
        {filteredAndSortedProducts.map((product) => (
          <div key={product.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-800 rounded-md bg-card">
            <div className="md:col-span-1">
              <ProductCard product={product} />
            </div>
            <div className="md:col-span-2 text-sm text-gray-300">
              <div className="font-semibold mb-1">Specs</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(product.specs || {}).slice(0,6).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-gray-500 w-28">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredAndSortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
