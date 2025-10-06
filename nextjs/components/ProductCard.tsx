"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import { Product } from '@/lib/data'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import toast from 'react-hot-toast'
import { Badge } from './ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product)
    toast.success('Added to cart!', {
      style: {
        background: '#FFFFFF',
        color: '#22C55E',
        border: '1px solid #22C55E',
      },
    })
  }

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString('en-PK')}`
  }

  const getAvailabilityBadge = (availability?: string) => {
    switch (availability) {
      case 'In Stock':
        return <Badge variant="success">In Stock</Badge>
      case 'Limited Stock':
        return <Badge variant="warning">Limited Stock</Badge>
      case 'Preorder':
        return <Badge variant="secondary">Preorder</Badge>
      default:
        return <Badge variant="neutral">Out of Stock</Badge>
    }
  }

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              const svg = encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>\
<rect width='100%' height='100%' fill='#F3F4F6'/>\
<rect x='50' y='50' width='300' height='300' fill='none' stroke='#22C55E' stroke-width='2'/>\
<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6B7280' font-size='16'>Product Image</text>\
</svg>`
              )
              target.src = `data:image/svg+xml;charset=utf-8,${svg}`
            }}
          />
          
          {/* Availability badge */}
          {product.availability && (
            <div className="absolute top-2 right-2">
              {getAvailabilityBadge(product.availability)}
            </div>
          )}
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute left-2 bottom-2 flex gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant={tag === 'sale' ? 'warning' : 'default'}>
                  {tag.toUpperCase()}
                </Badge>
              ))}
            </div>
          )}

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/5">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Eye className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-900 hover:text-primary line-clamp-2 mb-2 transition-colors">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-xl text-primary">
              {formatPrice(product.price)}
            </span>
            {Math.random() > 0.7 && (
              <span className="text-sm text-gray-400 line-through">
                Rs {(product.price * 1.2).toLocaleString('en-PK')}
              </span>
            )}
          </div>
          
          {/* Category and brand info */}
          <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
            <span>{product.category}</span>
            {product.subcategory && (
              <>
                <span className="text-gray-300">•</span>
                <span>{product.subcategory}</span>
              </>
            )}
            <span className="text-gray-300">•</span>
            <span>{product.brand}</span>
          </div>
        </Link>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Rating stars */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(Math.random() * 2) + 4
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({Math.floor(Math.random() * 50) + 10})
            </span>
          </div>
          <div className="text-xs text-primary font-medium">
            Free Shipping
          </div>
        </div>
      </div>
    </div>
  )
}
