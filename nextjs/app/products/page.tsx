'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Grid3x3, LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, Star } from 'lucide-react'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, Product } from '@/lib/data'

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Loading skeleton component
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
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
  const [viewMode, setViewMode] = useState<'grid' | 'large-grid'>('large-grid')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 90])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const itemsPerPage = 12

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?status=ACTIVE', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (response.ok) {
          const dbProducts = await response.json()
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

  // Get unique categories from products
  const categories = [
    { name: 'Gaming Laptops', icon: '💻', count: allProducts.filter(p => p.category === 'Gaming Laptops').length },
    { name: 'Mice', icon: '🖱️', count: allProducts.filter(p => p.category === 'Mice').length },
    { name: 'Keyboards', icon: '⌨️', count: allProducts.filter(p => p.category === 'Keyboards').length },
    { name: 'Headphones', icon: '🎧', count: allProducts.filter(p => p.category === 'Headphones').length }
  ]

  // Get unique brands from actual products
  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand)))
  const brands = uniqueBrands.map(brand => ({
    name: brand,
    count: allProducts.filter(p => p.brand === brand).length
  }))

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const priceInDollars = product.price / 1000 // Convert to rough dollar equivalent
    const matchesPrice = priceInDollars >= priceRange[0] && priceInDollars <= priceRange[1]
    return matchesCategory && matchesBrand && matchesPrice
  })

  // Sort products
  let sortedProducts = [...filteredProducts]
  if (sortBy === 'price-asc') sortedProducts.sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') sortedProducts.sort((a, b) => b.price - a.price)

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const showingCount = Math.min(currentPage * itemsPerPage, sortedProducts.length)
  const progressPercent = sortedProducts.length === 0 ? 0 : Math.min(100, (showingCount / sortedProducts.length) * 100)
  const showLoadMore = currentPage < totalPages

  // Tags for bottom section
  const tags = [
    'Console (12)', 'Gaming (12)', 'Headphone (9)', 'Headsets (8)',
    'Mechanical (4)', 'Ps4 (9)', 'Ps5 (9)', 'Wire (9)'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <ProductsLoading />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-background text-white">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[300px] bg-gaming-background overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gaming-primary/20 blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gaming-secondary/20 blur-[100px] transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white z-10">
          <h1 className="text-5xl font-display font-bold mb-4 glow-text">SHOP</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gaming-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gaming-primary">Shop</span>
          </div>
        </div>
      </div>

      {/* Category Circles */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 mx-8">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-gaming-surface border border-white/5 flex items-center justify-center mb-4 group-hover:shadow-neon group-hover:border-gaming-primary/50 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/10 to-gaming-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-5xl relative z-10 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
                </div>
                <h3 className="font-display font-semibold text-white group-hover:text-gaming-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.count} Products</p>
              </div>
            ))}
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Products Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gaming-card rounded-3xl border border-white/5 shadow-glass p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gaming-primary font-bold">Filter</p>
                  <h2 className="text-xl font-display font-semibold text-white">Filter By</h2>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gaming-primary to-gaming-secondary text-white flex items-center justify-center shadow-neon">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="bg-gaming-card rounded-3xl border border-white/5 p-6 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-white text-lg">Categories</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {Array.from(new Set(allProducts.map(p => p.category))).map((cat) => (
                    <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer rounded-xl px-3 py-2 transition-colors hover:bg-white/5 group">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-gaming-surface text-gaming-primary focus:ring-gaming-primary"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat])
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat))
                          }
                        }}
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">{cat}</span>
                      <span className="text-gray-500 ml-auto">({allProducts.filter(p => p.category === cat).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-gaming-card rounded-3xl border border-white/5 p-6 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-white text-lg">Price</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-gaming-primary bg-gaming-surface h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-gaming-surface px-3 py-2 rounded-xl border border-white/10">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-16 bg-transparent text-white focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="flex items-center gap-2 bg-gaming-surface px-3 py-2 rounded-xl border border-white/10">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-16 bg-transparent text-white focus:outline-none"
                        placeholder="90"
                      />
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">
                    Range: ${priceRange[0].toFixed(0)} - ${priceRange[1].toFixed(0)}
                  </div>
                  <button className="w-full bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 text-white py-2 rounded-full text-sm font-semibold transition shadow-neon border-0">
                    Apply Filter
                  </button>
                </div>
              </div>

              {/* Brands Filter */}
              <div className="bg-gaming-card rounded-3xl border border-white/5 p-6 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-white text-lg">Brands</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <label key={brand.name} className="flex items-center gap-3 text-sm cursor-pointer rounded-xl px-3 py-2 transition-colors hover:bg-white/5 group">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-gaming-surface text-gaming-primary focus:ring-gaming-primary"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand.name])
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand.name))
                          }
                        }}
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">{brand.name}</span>
                      <span className="text-gray-500 ml-auto">({brand.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings Filter */}
              <div className="bg-gaming-card rounded-3xl border border-white/5 p-6 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-white text-lg">Ratings</h3>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 text-sm cursor-pointer rounded-xl px-3 py-2 transition-colors hover:bg-white/5">
                      <input type="checkbox" className="rounded border-white/20 bg-gaming-surface text-gaming-primary focus:ring-gaming-primary" />
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-gray-500 ml-auto">(0)</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3 bg-gaming-surface rounded-full px-2 py-1 shadow-inner border border-white/5">
                <button
                  onClick={() => setViewMode('large-grid')}
                  className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${viewMode === 'large-grid' ? 'bg-gradient-to-br from-gaming-primary to-gaming-secondary text-white shadow-neon' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  aria-pressed={viewMode === 'large-grid'}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${viewMode === 'grid' ? 'bg-gradient-to-br from-gaming-primary to-gaming-secondary text-white shadow-neon' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  aria-pressed={viewMode === 'grid'}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full text-gray-600 cursor-not-allowed">
                  <List className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm md:text-base text-gray-300 font-medium font-sans">
                Showing <span className="text-gaming-primary">{showingCount}</span> of <span className="text-white">{sortedProducts.length}</span> results
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-full bg-gaming-surface text-white shadow-sm text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gaming-primary/50"
              >
                <option value="default" className="bg-gaming-card">Default sorting</option>
                <option value="price-asc" className="bg-gaming-card">Price: Low to High</option>
                <option value="price-desc" className="bg-gaming-card">Price: High to Low</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 mb-10 ${viewMode === 'large-grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="pb-10">
              <div className="max-w-xl mx-auto text-center space-y-4">
                <p className="text-sm text-gray-400">
                  Showing <span className="font-semibold text-gaming-primary">{showingCount}</span> of <span className="font-semibold text-white">{sortedProducts.length}</span> products
                </p>
                <div className="h-2 rounded-full bg-gaming-surface overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gaming-primary to-gaming-secondary transition-all duration-500 shadow-neon"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={!showLoadMore}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gaming-surface hover:bg-gaming-primary hover:text-white text-gray-300 border border-white/10 px-8 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon"
                >
                  Load More Items
                </button>
              </div>
            </div>

            {/* Tags Section */}
            <div className="py-12 border-t border-white/10">
              <h3 className="text-2xl font-bold mb-6 font-display text-white">ALL TAGS :</h3>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button key={tag} className="px-6 py-2 bg-gaming-surface border border-white/5 hover:border-gaming-primary/50 hover:text-white rounded-full text-sm text-gray-400 transition-all hover:shadow-neon">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
