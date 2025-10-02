"use client"

import Header from '@/components/Header'
import CheckoutProgress from '@/components/CheckoutProgress'
import { useCartStore } from '@/hooks/useCartStore'
import Image from 'next/image'

export default function ReviewPage() {
  const { items, getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shipping = subtotal >= 150000 ? 0 : 500
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-2xl font-semibold mb-3">Review & Confirmation</h1>
        <CheckoutProgress steps={[{key:'cart',label:'Cart'},{key:'shipping',label:'Shipping'},{key:'payment',label:'Payment'},{key:'confirm',label:'Confirmation'}]} active="confirm" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.length === 0 ? (
              <div className="text-gray-400">Your cart is empty.</div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 p-4 border border-gray-800 rounded-md bg-card">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image src={product.image} alt={product.title} fill className="object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-400">Qty: {quantity}</div>
                  </div>
                  <div className="font-semibold">Rs {(product.price * quantity).toLocaleString('en-PK')}</div>
                </div>
              ))
            )}
            {/* Shipping and Payment summary placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-800 rounded-md bg-card">
                <div className="font-semibold mb-2">Shipping To</div>
                <div className="text-sm text-gray-300">Saved address (example)</div>
                <div className="text-xs text-gray-400 mt-1">City selected in previous step</div>
              </div>
              <div className="p-4 border border-gray-800 rounded-md bg-card">
                <div className="font-semibold mb-2">Payment Method</div>
                <div className="text-sm text-gray-300">Cash on Delivery</div>
                <div className="text-xs text-gray-400 mt-1">SSL Secured • Trusted Payments</div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border border-gray-800 rounded-md bg-card h-max sticky top-24">
            <div className="font-semibold mb-2">Order Summary</div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs ${shipping}`}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span>Total</span>
              <span className="font-semibold">Rs {total.toLocaleString('en-PK')}</span>
            </div>
            <a href="/confirmation" className="block mt-4 px-4 py-2 bg-brand text-black rounded-md text-sm font-semibold text-center">Place Order</a>
          </div>
        </div>

        {/* Mobile sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-gray-800 p-3 md:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Total</div>
              <div className="font-semibold">Rs {total.toLocaleString('en-PK')}</div>
            </div>
            <a href="/confirmation" className="px-4 py-2 bg-brand text-black rounded-md text-sm font-semibold">Place Order</a>
          </div>
        </div>
      </main>
    </div>
  )
}


