"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Product } from '@/lib/data'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import toast from 'react-hot-toast'
import { Badge } from './ui/Badge'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product)
    toast.success('Added to cart!')
  }

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString('en-PK')}`
  }

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'In Stock':
        return 'text-green-400 border-green-600'
      case 'Limited Stock':
        return 'text-yellow-400 border-yellow-600'
      case 'Preorder':
        return 'text-blue-400 border-blue-600'
      default:
        return 'text-gray-400 border-gray-600'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="group bg-card rounded-lg border border-gray-800 overflow-hidden transition-all hover:border-brand/50 hover:shadow-soft"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              const svg = encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>\
<rect width='100%' height='100%' fill='#0b1220'/>\
<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#7aa7ff' font-size='22' font-family='Arial, sans-serif'>Image unavailable</text>\
</svg>`
              )
              target.src = `data:image/svg+xml;charset=utf-8,${svg}`
            }}
          />
          {product.availability && (
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-md border ${getAvailabilityColor(product.availability)}`}>
              {product.availability}
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute left-2 bottom-2 flex gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant={tag === 'sale' ? 'warn' : 'brand'}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold hover:text-brand line-clamp-1 mb-1">
            {product.title}
          </h3>
          <div className="text-brand font-semibold text-lg mb-2">
            {formatPrice(product.price)}
          </div>
          <div className="text-xs text-gray-400 mb-3">
            {product.category}
            {product.subcategory && ` • ${product.subcategory}`}
            {` • ${product.brand}`}
          </div>
        </Link>
        
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
          <Link href={`/products/${product.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
