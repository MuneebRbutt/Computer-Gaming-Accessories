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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="group relative block rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Category name */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Product count */}
                  <p className="text-sm text-gray-500 mb-3">
                    {category.productCount}+ Products
                  </p>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary/70 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-12">
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all font-medium"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
