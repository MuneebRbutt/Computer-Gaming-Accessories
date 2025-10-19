"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, Heart, GitCompare } from 'lucide-react'
import { Product } from '@/lib/data'
import { FALLBACK_IMAGE_DATA_URI } from '@/lib/utils'
import { useCartStore } from '@/hooks/useCartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const formatCurrency = (value: number) => `Rs ${value.toLocaleString('en-IN')}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success('Added to cart!', {
      style: {
        background: '#22C55E',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#22C55E',
      },
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success('Added to wishlist!', {
      icon: '❤️',
    })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success('Added to compare!', {
      icon: '🔄',
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast('Quick view coming soon!')
  }

  const resolvedImage = product.image || FALLBACK_IMAGE_DATA_URI

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block h-full overflow-hidden rounded-[32px] border border-rose-100 bg-white p-6 shadow-[0_30px_80px_rgba(244,114,182,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_120px_rgba(244,63,94,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
    >
      <div className="relative flex flex-col">
        <div className="relative flex items-center justify-center rounded-[28px] bg-gradient-to-b from-rose-50 via-white to-white px-10 pt-12 pb-10">
          <Image
            src={resolvedImage}
            alt={product.title}
            width={280}
            height={280}
            className="h-60 w-full max-w-[260px] object-contain transition-transform duration-500 group-hover:scale-105"
            unoptimized
            onError={(event) => {
              const target = event.target as HTMLImageElement
              target.src = FALLBACK_IMAGE_DATA_URI
            }}
          />

          {product.discount && (
            <div className="absolute left-6 top-6 rounded-full bg-rose-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-rose-200">
              -{product.discount}%
            </div>
          )}

          <div className="absolute right-6 top-6 flex flex-col gap-3 text-gray-500">
            <button
              onClick={handleWishlist}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-gray-700 shadow-lg shadow-rose-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
              title="Add to Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={handleCompare}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-gray-700 shadow-lg shadow-rose-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
              title="Compare"
            >
              <GitCompare className="h-5 w-5" />
            </button>
            <button
              onClick={handleQuickView}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/95 text-gray-700 shadow-lg shadow-rose-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white"
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="grid h-11 w-11 place-items-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-600"
              title="Add to Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

  <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-rose-500">
            {product.title}
          </h3>

          <div className="flex items-center justify-center gap-1 text-rose-500">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < Math.floor(product.rating || 4) ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-baseline justify-center gap-3 text-gray-900">
            <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm font-semibold text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
