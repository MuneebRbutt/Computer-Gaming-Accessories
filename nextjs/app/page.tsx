import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import PCBuilder from '@/components/PCBuilder'
import ProductGrid from '@/components/ProductGrid'
import ProductFilters from '@/components/ProductFilters'
import CategoryGrid from '@/components/CategoryGrid'
import { PRODUCTS } from '@/lib/data'

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main>
        <Hero />
        <CategoryGrid />
        
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Shop Products</h2>
          </div>
          
          <ProductFilters products={PRODUCTS} />
          <ProductGrid products={PRODUCTS} />
        </section>

        <PCBuilder />
        
        <FeaturedProducts />
      </main>
    </div>
  )
}
