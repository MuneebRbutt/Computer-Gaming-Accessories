"use client"

import Header from '@/components/Header'
import { useCartSync } from '@/lib/hooks/useCartSync'
import { useCartStore } from '@/hooks/useCartStore'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import CheckoutProgress from '@/components/CheckoutProgress'
import { useMemo, useState } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartSync()
  const { getTotalPrice } = useCartStore()
  const hydrated = true // Always hydrated when using API sync
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState('')

  const subtotal = getTotalPrice()
  const discount = useMemo(() => {
    if (applied.toUpperCase() === 'SAVE500') return 500
    if (applied.toUpperCase() === 'OFF10') return Math.min(Math.round(subtotal * 0.10), 15000)
    return 0
  }, [applied, subtotal])
  const shippingEstimate = subtotal - discount >= 150000 ? 0 : 500
  const total = Math.max(0, subtotal - discount) + shippingEstimate

  return (
    <div className="min-h-screen bg-gaming-background text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-display font-bold text-white mb-6 glow-text">Shopping Cart</h1>
        <CheckoutProgress steps={[{ key: 'cart', label: 'Cart' }, { key: 'shipping', label: 'Shipping' }, { key: 'payment', label: 'Payment' }, { key: 'confirm', label: 'Confirmation' }]} active="cart" />

        {!hydrated ? (
          <div className="text-gray-400">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gaming-card rounded-2xl border border-white/5 shadow-glass">
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any gear yet.</p>
            <Link href="/">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 p-4 border border-white/5 rounded-xl bg-gaming-card shadow-card hover:border-gaming-primary/30 transition-colors duration-300">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gaming-surface rounded-lg overflow-hidden">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white font-display mb-1">{product.title}</div>
                    <div className="text-gaming-primary font-bold text-lg">Rs {product.price.toLocaleString('en-PK')}</div>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-gaming-surface rounded-lg p-1 border border-white/10">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10" onClick={() => updateQuantity(product.id, quantity - 1)}>-</Button>
                        <span className="w-8 text-center font-mono">{quantity}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10" onClick={() => updateQuantity(product.id, quantity + 1)}>+</Button>
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => removeItem(product.id)}>Remove</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border border-white/5 rounded-2xl bg-gaming-card shadow-glass h-max sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4 font-display">Order Summary</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Subtotal</div>
                <div className="font-semibold text-white">Rs {getTotalPrice().toLocaleString('en-PK')}</div>
              </div>
              <div className="space-y-3 text-sm border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">{shippingEstimate === 0 ? 'Free' : `Rs ${shippingEstimate}`}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Estimated Delivery</span>
                  <span>2–5 days</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 bg-gaming-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gaming-primary focus:ring-1 focus:ring-gaming-primary outline-none placeholder:text-gray-600"
                    placeholder="Coupon code"
                  />
                  <Button variant="outline" size="sm" onClick={() => setApplied(coupon)} className="border-gaming-primary/50 text-gaming-primary hover:bg-gaming-primary hover:text-white">Apply</Button>
                </div>
                {applied && <div className="text-green-400 font-medium text-xs">Applied: {applied.toUpperCase()} (−Rs {discount.toLocaleString('en-PK')})</div>}
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-base font-medium text-gray-300">Total</div>
                <div className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Rs {total.toLocaleString('en-PK')}</div>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 transition-opacity text-white font-bold shadow-neon border-0">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/" className="block text-center text-sm text-gray-500 mt-4 hover:text-gaming-primary transition-colors">Continue Shopping</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


