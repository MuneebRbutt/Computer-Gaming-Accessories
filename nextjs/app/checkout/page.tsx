"use client"

import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import CheckoutProgress from '@/components/CheckoutProgress'
import { useState, useMemo } from 'react'
import { useCartStore } from '@/hooks/useCartStore'

export default function CheckoutPage() {
  const [city, setCity] = useState('')
  const cities = ['Karachi','Lahore','Islamabad','Rawalpindi','Peshawar','Quetta']
  const filteredCities = cities.filter(c => c.toLowerCase().includes(city.toLowerCase())).slice(0,5)
  const [savedAddress, setSavedAddress] = useState('')
  const { getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shippingEstimate = subtotal >= 150000 ? 0 : 500
  const total = subtotal + shippingEstimate
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-2xl font-semibold mb-3">Checkout</h1>
        <CheckoutProgress steps={[{key:'cart',label:'Cart'},{key:'shipping',label:'Shipping'},{key:'payment',label:'Payment'},{key:'confirm',label:'Confirmation'}]} active="shipping" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form className="lg:col-span-2 grid gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Shipping Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Full Name</label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Phone</label>
                <Input placeholder="03xx-xxxxxxx" />
              </div>
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <Input placeholder="you@example.com" />
              </div>
              <div className="relative">
                <label className="text-xs text-gray-400">City</label>
                <Input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" autoComplete="off" />
                {city && (
                  <div className="absolute z-10 mt-1 w-full bg-card border border-gray-800 rounded-md text-sm">
                    {filteredCities.map(c => (
                      <button key={c} type="button" onClick={()=>setCity(c)} className="w-full text-left px-3 py-2 hover:bg-gray-800">{c}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Address</label>
                <Input placeholder="Street address" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-1">Saved Addresses</div>
              <div className="flex flex-wrap gap-2">
                {['Home - Karachi','Office - Rawalpindi'].map(a => (
                  <button key={a} type="button" onClick={()=>setSavedAddress(a)} className={`px-2 py-1 rounded-md border text-xs ${savedAddress===a?'border-brand text-brand':'border-gray-700 text-gray-300'}`}>{a}</button>
                ))}
              </div>
            </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Payment Method</div>
              <div className="grid gap-2 border border-gray-800 rounded-md p-3">
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="pm" defaultChecked /> Cash on Delivery</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="pm" /> Bank Transfer</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="pm" /> Card Payment</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="pm" /> JazzCash / Easypaisa</label>
              </div>
              <div className="text-xs text-gray-400 mt-2">SSL Secured • Trusted Payments</div>
            </div>

            <Button className="w-max">Continue to Review</Button>
          </form>
          <div className="p-4 border border-gray-800 rounded-md bg-card h-max sticky top-24">
            <div className="font-semibold mb-2">Order Summary</div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
              <span>Shipping</span>
              <span>{shippingEstimate === 0 ? 'Free' : `Rs ${shippingEstimate}`}</span>
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


