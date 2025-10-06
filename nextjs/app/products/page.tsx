'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { PRODUCTS, Product } from '@/lib/data'

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Loading skeleton component
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from database with no caching
        const response = await fetch('/api/products?status=ACTIVE', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          const dbProducts = await response.json()
          // Combine database products with static products
          setAllProducts([...dbProducts, ...PRODUCTS])
        }
      } catch (error) {
        console.error('Failed to fetch database products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  const queryRaw = (searchParams?.query || '') as string
  const query = queryRaw.trim().toLowerCase()
  const filtered = query
    ? allProducts.filter(p =>
        [p.title, p.category, p.subcategory, p.brand]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(query))
      )
    : allProducts
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <ProductsLoading />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
        <ProductFilters products={filtered} />
        <ProductGrid products={filtered} />
      </main>
    </div>
  )
}
