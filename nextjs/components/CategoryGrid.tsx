"use client"

import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import { 
  Laptop, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones, 
  HardDrive,
  Cpu,
  Fan,
  ArrowRight
} from 'lucide-react'

const categoryIcons = {
  'gaming-laptops': Laptop,
  'desktop-pcs': Monitor,
  'keyboards': Keyboard,
  'mice': Mouse,
  'headphones-headsets': Headphones,
  'gaming-monitors': Monitor,
  'storage': HardDrive,
  'cooling': Fan,
  'processors': Cpu
}

export default function CategoryGrid() {
  const featuredCategories = CATEGORIES.filter(cat => cat.featured)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#090909] via-[#0f0f21] to-[#04040a] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-10 h-48 w-48 rounded-full bg-[#22d3ee]/15 blur-3xl" />
        <div className="absolute right-[8%] top-1/3 h-56 w-56 rounded-full bg-[#ec4899]/15 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#8b5cf6]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore our curated selection of gaming gear and computer hardware. 
            From high-performance laptops to precision peripherals.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuredCategories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Monitor
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_25px_80px_rgba(236,72,153,0.18)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#22d3ee]/20 blur-3xl" />
                  <div className="absolute -bottom-24 right-1/2 h-44 w-44 translate-x-1/2 rounded-full bg-[#ec4899]/20 blur-3xl" />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/15">
                    <IconComponent className="h-6 w-6 text-cyan-200 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  
                  {/* Category name */}
                  <h3 className="mb-2 font-semibold text-white transition-colors duration-300 group-hover:text-cyan-100">
                    {category.name}
                  </h3>
                  
                  {/* Product count */}
                  <p className="mb-3 text-sm text-white/50">
                    {category.productCount}+ Products
                  </p>
                  
                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-xs text-white/40">
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-cyan-200/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-8">
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-medium text-white transition-all duration-300 hover:border-transparent hover:bg-white/15"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
