import Header from '@/components/Header'
import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { PRODUCTS } from '@/lib/data'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Shop</h1>
        </div>
        <ProductFilters products={PRODUCTS} />
        <ProductGrid products={PRODUCTS} />
      </main>
    </div>
  )
}


