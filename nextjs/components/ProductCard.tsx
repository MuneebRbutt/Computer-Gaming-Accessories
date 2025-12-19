"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, Heart, GitCompare, Zap } from 'lucide-react'
import { Product } from '@/lib/data'
import { FALLBACK_IMAGE_DATA_URI } from '@/lib/utils'
import { useCartSync } from '@/lib/hooks/useCartSync'
import { CartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartSync()

  const formatCurrency = (value: number) => `Rs ${value.toLocaleString('en-IN')}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success('Added to cart!', {
      style: {
        background: '#10B981',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success('Added to wishlist!', {
      icon: '❤️',
      style: {
        background: '#182132',
        color: '#fff',
      }
    })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success('Added to compare!', {
      icon: '🔄',
      style: {
        background: '#182132',
        color: '#fff',
      }
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast('Quick view coming soon!', {
      style: {
        background: '#182132',
        color: '#fff',
      }
    })
  }

  const resolvedImage = product.image || FALLBACK_IMAGE_DATA_URI

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block h-full overflow-hidden rounded-2xl bg-gaming-card border border-white/5 transition-all duration-300 hover:border-gaming-primary/50 hover:shadow-neon hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/5 to-white/0 p-8">
        <div className="absolute inset-0 bg-gaming-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Image
          src={resolvedImage}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          unoptimized
          onError={(event) => {
            const target = event.target as HTMLImageElement
            target.src = FALLBACK_IMAGE_DATA_URI
          }}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.discount && (
            <div className="rounded-md bg-gaming-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.availability === 'In Stock' && (
            <div className="rounded-md bg-gaming-success/20 border border-gaming-success/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gaming-success backdrop-blur-md">
              In Stock
            </div>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleWishlist}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-gaming-secondary hover:text-white transition-colors"
            title="Add to Wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={handleCompare}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-gaming-primary hover:text-white transition-colors"
            title="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
          <button
            onClick={handleQuickView}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-md hover:bg-gaming-accent hover:text-white transition-colors"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-gaming-warning fill-gaming-warning" />
            <span className="text-xs text-gaming-text-muted font-medium">{product.rating || 4.5}</span>
          </div>
          <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-gaming-primary transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-gaming-text-muted line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-gaming-accent font-display">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gaming-primary hover:bg-gaming-primary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
