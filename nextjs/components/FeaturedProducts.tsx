import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/data'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

export default function FeaturedProducts() {
  const featuredProducts = PRODUCTS.slice(0, 8)

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <Reveal>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Top-Selling Products</h2>
          <Link href="/products" className="text-brand hover:underline">
            View All
          </Link>
        </div>
      </Reveal>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product, idx) => (
          <Reveal key={product.id} delay={idx * 0.05}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
