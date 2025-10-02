"use client"

import { CATEGORIES } from '@/lib/data'
import { motion } from 'framer-motion'

export default function CategoryGrid() {
  const items = CATEGORIES.map((c) => ({
    key: c,
    title: c,
    // simple emoji placeholders; can be replaced with icons/images later
    icon: c.includes('PC') ? '🖥️' : c.includes('Laptop') ? '💻' : c.includes('Graphic') ? '🎮' : c.includes('Processor') ? '🧠' : '✨'
  }))

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, idx) => (
          <motion.a
            key={item.key}
            href="#shop"
            className="group relative rounded-lg border border-gray-800 bg-card p-4 text-center overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03, duration: 0.4 }}
            whileHover={{ scale: 1.03, rotate: -0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_-10%,rgba(14,165,233,0.18),transparent_35%)]" />
            <div className="relative">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium">{item.title}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}



