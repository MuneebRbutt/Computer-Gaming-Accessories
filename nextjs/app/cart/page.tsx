"use client"

import Header from '@/components/Header'
import { useCartStore } from '@/hooks/useCartStore'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import CheckoutProgress from '@/components/CheckoutProgress'
import { useMemo, useState } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, hydrated } = useCartStore()
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Shopping Cart</h1>
        <CheckoutProgress steps={[{key:'cart',label:'Cart'},{key:'shipping',label:'Shipping'},{key:'payment',label:'Payment'},{key:'confirm',label:'Confirmation'}]} active="cart" />

        {!hydrated ? (
          <div className="text-gray-500">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image src={product.image} alt={product.title} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{product.title}</div>
                    <div className="text-primary font-semibold">Rs {product.price.toLocaleString('en-PK')}</div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(product.id, quantity - 1)}>-</Button>
                      <span>{quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(product.id, quantity + 1)}>+</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(product.id)}>Remove</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border border-gray-200 rounded-md bg-white shadow-sm h-max sticky top-24">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="font-semibold text-gray-900">Rs {getTotalPrice().toLocaleString('en-PK')}</div>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingEstimate === 0 ? 'Free' : `Rs ${shippingEstimate}`}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Estimated Delivery</span>
                  <span>2–5 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <input value={coupon} onChange={(e)=>setCoupon(e.target.value)} className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Coupon code (SAVE500 / OFF10)" />
                  <Button variant="outline" size="sm" onClick={()=>setApplied(coupon)}>Apply</Button>
                </div>
                {applied && <div className="text-green-600 font-medium">Applied: {applied.toUpperCase()} (−Rs {discount.toLocaleString('en-PK')})</div>}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-900">Total</div>
                <div className="text-xl font-bold text-gray-900">Rs {total.toLocaleString('en-PK')}</div>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-4">Proceed to Checkout</Button>
              </Link>
              <Link href="/" className="block text-center text-sm text-gray-600 mt-3 hover:text-primary transition-colors">Continue Shopping</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


