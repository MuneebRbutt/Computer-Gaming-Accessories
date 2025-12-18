"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { wishlistApi, ApiError } from '@/lib/api/client'
import toast from 'react-hot-toast'

/**
 * Hook to sync wishlist with backend API
 */
export function useWishlistSync() {
  const { data: session } = useSession()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Load wishlist from backend on mount
  useEffect(() => {
    if (!session?.user) {
      setItems([])
      return
    }

    const loadWishlist = async () => {
      setLoading(true)
      try {
        const wishlistItems = await wishlistApi.get() as any[]
        
        // Transform backend wishlist items to frontend format
        const transformedItems = wishlistItems.map((item: any) => ({
          id: item.id,
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            image: item.product.images?.[0] || '/images/placeholder.png',
            category: item.product.category?.name || '',
            brand: item.product.brand?.name || '',
          },
          addedAt: new Date(item.createdAt),
        }))

        setItems(transformedItems)
      } catch (error) {
        if (error instanceof ApiError && error.status !== 401) {
          console.error('Failed to load wishlist:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [session?.user])

  // Add to wishlist
  const addItem = async (productId: string) => {
    if (!session?.user) {
      toast.error('Please login to add items to wishlist')
      return
    }

    try {
      await wishlistApi.add(productId)
      // Reload wishlist
      const wishlistItems = await wishlistApi.get() as any[]
      const transformedItems = wishlistItems.map((item: any) => ({
        id: item.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.images?.[0] || '/images/placeholder.png',
          category: item.product.category?.name || '',
          brand: item.product.brand?.name || '',
        },
        addedAt: new Date(item.createdAt),
      }))
      setItems(transformedItems)
      toast.success('Added to wishlist')
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to add to wishlist')
    }
  }

  // Remove from wishlist
  const removeItem = async (productId: string) => {
    if (!session?.user) {
      return
    }

    try {
      await wishlistApi.remove(productId)
      setItems(items.filter(item => item.product.id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to remove from wishlist')
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId)
  }

  return {
    items,
    loading,
    addItem,
    removeItem,
    isInWishlist,
  }
}

