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

  // Cart loading moved to CartSynchronizer component

  // Sync add item to backend
  const addItem = async (product: any, options?: any) => {
    // Always add to local store first (optimistic update)
    addItemLocal(product, options)
    toast.success('Added to cart')

    // If logged in, sync to backend
    if (session?.user) {
      try {
        await cartApi.add(product.id, options?.quantity || 1)
      } catch (error) {
        console.error('Failed to sync to backend:', error)
        // We don't revert local state here to avoid bad UX, 
        // but it might be out of sync until next reload
      }
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

