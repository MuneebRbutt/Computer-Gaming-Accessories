"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PRODUCTS, Product } from '@/lib/data'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Flame,
  Zap,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
}

export default function FeaturedProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS)

  useEffect(() => {
    // Fetch products from database with no caching
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?status=ACTIVE', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (response.ok) {
          const dbProducts = await response.json()
          setAllProducts([...dbProducts, ...PRODUCTS])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    
    fetchProducts()
  }, [])

  // Get featured products with high ratings
  const featuredProducts = allProducts
    .filter(product => product.featured || product.rating && product.rating >= 4.5)
    .slice(0, 8)

  const topRatedProducts = allProducts
    .filter(product => product.rating && product.rating >= 4.7)
    .slice(0, 4)

  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-primary" />
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Hot Deals</span>
            <Flame className="w-6 h-6 text-primary" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Top-Selling Products
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the most popular gaming gear trusted by thousands of gamers across Pakistan
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: TrendingUp, label: 'Trending Now', value: '50+', color: 'text-primary' },
            { icon: Star, label: 'Top Rated', value: '4.8★', color: 'text-amber-500' },
            { icon: Award, label: 'Best Sellers', value: '1000+', color: 'text-green-600' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
            >
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <div>
                <div className={cn("font-bold text-lg", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              variants={item}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Top Rated Section */}
        <motion.div 
          className="bg-gray-50 rounded-3xl border border-gray-200 p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
                  Top Rated
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Customer Favorites
              </h3>
              <p className="text-gray-600">
                Products with the highest customer satisfaction ratings
              </p>
            </div>
            
            <Link 
              href="/products?sort=rating"
              className={cn(
                "hidden md:flex items-center gap-2 px-6 py-3 rounded-xl",
                "border border-amber-200 text-amber-600 hover:bg-amber-50",
                "transition-all duration-300 font-medium",
                "hover:border-amber-300 group"
              )}
            >
              <Star className="w-4 h-4" />
              View All Rated
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl",
                "bg-primary hover:bg-primary/90 text-white",
                "transition-all duration-300 font-semibold",
                "shadow-md hover:shadow-lg group"
              )}
            >
              <Zap className="w-5 h-5" />
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/deals"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl",
                "border border-gray-300 text-gray-700 hover:bg-gray-50",
                "transition-all duration-300 font-semibold",
                "hover:border-gray-400 group"
              )}
            >
              <Flame className="w-5 h-5" />
              Special Deals
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
