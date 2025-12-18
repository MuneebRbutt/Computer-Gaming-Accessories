"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/hooks/useCartStore'
import { cartApi, ApiError } from '@/lib/api/client'
import toast from 'react-hot-toast'

/**
 * Hook to sync cart with backend API
 * Loads cart from backend on mount and syncs changes
 */
export function useCartSync() {
  const { data: session } = useSession()
  const { items, addItem: addItemLocal, removeItem: removeItemLocal, updateQuantity: updateQuantityLocal, clearCart: clearCartLocal } = useCartStore()

  // Load cart from backend on mount
  useEffect(() => {
    if (!session?.user) return

    const loadCart = async () => {
      try {
        const cartItems = await cartApi.get() as any[]
        
        // Transform backend cart items to frontend format
        const transformedItems = cartItems.map((item: any) => ({
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.price,
            image: item.product.images?.[0] || '/images/placeholder.png',
            category: item.product.category?.name || '',
            brand: item.product.brand?.name || '',
          },
          quantity: item.quantity,
          addedAt: new Date(item.createdAt),
        }))

        // Update local store with backend data
        clearCartLocal()
        transformedItems.forEach((item: any) => {
          addItemLocal(item.product, { quantity: item.quantity })
        })
      } catch (error) {
        if (error instanceof ApiError && error.status !== 401) {
          console.error('Failed to load cart:', error)
        }
      }
    }

    loadCart()
  }, [session?.user])

  // Sync add item to backend
  const addItem = async (product: any, options?: any) => {
    if (!session?.user) {
      toast.error('Please login to add items to cart')
      return
    }

    try {
      await cartApi.add(product.id, options?.quantity || 1)
      addItemLocal(product, options)
      toast.success('Added to cart')
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to add to cart')
    }
  }

  // Sync remove item to backend
  const removeItem = async (productId: string) => {
    if (!session?.user) {
      removeItemLocal(productId)
      return
    }

    try {
      // Find cart item ID from backend
      const cartItems = await cartApi.get() as any[]
      const cartItem = cartItems.find((item: any) => item.productId === productId || item.product.id === productId)
      
      if (cartItem) {
        await cartApi.remove(cartItem.id)
      }
      removeItemLocal(productId)
      toast.success('Removed from cart')
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to remove from cart')
      // Still remove locally on error
      removeItemLocal(productId)
    }
  }

  // Sync update quantity to backend
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user) {
      updateQuantityLocal(productId, quantity)
      return
    }

    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    try {
      // Find cart item ID from backend
      const cartItems = await cartApi.get() as any[]
      const cartItem = cartItems.find((item: any) => item.productId === productId || item.product.id === productId)
      
      if (cartItem) {
        await cartApi.update(cartItem.id, quantity)
      }
      updateQuantityLocal(productId, quantity)
    } catch (error) {
      console.error('Failed to update cart:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to update cart')
      // Still update locally on error
      updateQuantityLocal(productId, quantity)
    }
  }

  // Sync clear cart to backend
  const clearCart = async () => {
    if (!session?.user) {
      clearCartLocal()
      return
    }

    try {
      await cartApi.clear()
      clearCartLocal()
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Failed to clear cart:', error)
      toast.error(error instanceof ApiError ? error.message : 'Failed to clear cart')
      // Still clear locally on error
      clearCartLocal()
    }
  }

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    items,
  }
}

