
"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/hooks/useCartStore'
import { cartApi, ApiError } from '@/lib/api/client'

/**
 * Component to handle global cart synchronization
 * Should be placed in the root layout or header
 */
export function CartSynchronizer() {
    const { data: session } = useSession()
    const { addItem: addItemLocal, clearCart: clearCartLocal } = useCartStore()

    // Load cart from backend on mount/login
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
    }, [session?.user, clearCartLocal, addItemLocal])

    return null
}
