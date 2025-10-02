'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/Button'
import { motion } from 'framer-motion'
import Banner from '../images/banner.png'

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0">
        <Image
          src={Banner}
          alt="Gaming setup"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-surface"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold leading-tight"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Gaming & Computer Accessories at the Best Prices in Pakistan
          </motion.h1>
          <p className="mt-4 text-gray-300">
            Build your dream setup with top-tier gaming PCs, powerful laptops, and premium accessories.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#products">
              <Button size="lg" className="shadow-soft">
                Shop Now
              </Button>
            </Link>
            <Link href="#pc-builder">
              <Button variant="outline" size="lg">
                Explore Gaming PCs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
