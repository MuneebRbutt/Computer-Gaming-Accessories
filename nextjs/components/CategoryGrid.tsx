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
  ArrowRight,
  Gamepad2
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
    <section className="relative overflow-hidden bg-gaming-background py-20 border-t border-white/5">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-20 h-64 w-64 rounded-full bg-gaming-primary/5 blur-[100px]" />
        <div className="absolute right-[10%] bottom-20 h-64 w-64 rounded-full bg-gaming-secondary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gaming-accent text-sm font-bold tracking-widest uppercase">
              <Gamepad2 className="w-4 h-4" />
              <span className="animate-pulse">Armory</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
              BROWSE BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary to-gaming-secondary">CATEGORY</span>
            </h2>
          </div>

          <Link
            href="/categories"
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Monitor

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gaming-card border border-white/5 p-6 hover:border-gaming-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gaming-surface border border-white/10 flex items-center justify-center text-gaming-text-secondary group-hover:scale-110 group-hover:bg-gaming-primary group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm md:text-base group-hover:text-gaming-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gaming-text-muted">
                      {category.productCount}+ Items
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
