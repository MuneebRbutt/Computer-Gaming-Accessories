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
    <section className="relative py-12 md:py-20 bg-gaming-background overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gaming-primary/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gaming-secondary/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gaming-primary/10 border border-gaming-primary/20 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-gaming-primary animate-pulse" />
            <span className="text-gaming-primary text-xs font-bold uppercase tracking-widest">Hot Deals Detected</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            TOP SELLING <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary to-gaming-secondary">GEAR</span>
          </h2>

          <p className="text-gaming-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            Discover the most popular gaming gear trusted by thousands of gamers across Pakistan.
            Performance met style.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: TrendingUp, label: 'Trending Now', value: '50+', color: 'text-gaming-primary', bg: 'bg-gaming-primary/10' },
            { icon: Star, label: 'Top Rated', value: '4.8★', color: 'text-gaming-warning', bg: 'bg-gaming-warning/10' },
            { icon: Award, label: 'Best Sellers', value: '1000+', color: 'text-gaming-success', bg: 'bg-gaming-success/10' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group flex items-center justify-center gap-4 p-6 rounded-2xl bg-gaming-card border border-white/5 shadow-glass hover:border-white/10 transition-all duration-300"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="text-left">
                <div className={cn("font-display font-bold text-2xl mb-1", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
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
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Top Rated Section */}
        <motion.div
          className="relative rounded-3xl border border-white/10 bg-gaming-surface/50 backdrop-blur-sm p-8 md:p-12 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gaming-warning/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-gaming-warning fill-gaming-warning animate-pulse" />
                <span className="text-gaming-warning text-sm font-bold uppercase tracking-widest">
                  Elite Tier
                </span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2">
                Customer Favorites
              </h3>
              <p className="text-gaming-text-secondary">
                Highest rated peripherals chosen by the community
              </p>
            </div>

            <Link
              href="/products?sort=rating"
              className={cn(
                "hidden md:flex items-center gap-2 px-6 py-3 rounded-xl",
                "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                "transition-all duration-300 font-medium",
                "group backdrop-blur-sm"
              )}
            >
              <Star className="w-4 h-4 text-gaming-warning" />
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
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl",
                "bg-gaming-primary hover:bg-gaming-primary/90 text-white",
                "transition-all duration-300 font-bold tracking-wide",
                "shadow-neon hover:shadow-neon-hover group"
              )}
            >
              <Zap className="w-5 h-5 group-hover:fill-current" />
              VIEW ALL PRODUCTS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/deals"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl",
                "border border-white/10 bg-white/5 text-white hover:bg-white/10",
                "transition-all duration-300 font-bold tracking-wide",
                "backdrop-blur-sm group"
              )}
            >
              <Flame className="w-5 h-5 text-gaming-secondary" />
              SPECIAL DEALS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
