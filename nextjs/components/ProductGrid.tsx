'use client'

import { useMemo, useState } from 'react'
import { Product } from '@/lib/data'
import { useFilterStore } from '@/lib/store'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  className?: string
  itemsPerPage?: number
}

export default function ProductGrid({ 
  products, 
  className = '',
  itemsPerPage = 20
}: ProductGridProps) {
  const { search, category, subcategory, brand, minPrice, maxPrice, sortBy } = useFilterStore()
  const [currentPage, setCurrentPage] = useState(1)

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

      return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand && matchesMinPrice && matchesMaxPrice
    })

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
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
    }
    return filtered
  }, [products, search, category, subcategory, brand, minPrice, maxPrice, sortBy])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-gray-200">
        <p className="text-lg text-gray-600 mb-4">No products found</p>
        <p className="text-sm text-gray-500">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-4 text-sm text-gray-600">
        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg border ${currentPage === pageNum ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
