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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Checkout</h1>
        <CheckoutProgress steps={[{key:'cart',label:'Cart'},{key:'shipping',label:'Shipping'},{key:'payment',label:'Payment'},{key:'confirm',label:'Confirmation'}]} active="shipping" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form className="lg:col-span-2 grid gap-6">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">Shipping Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div>
                <label className="text-xs text-gray-600 font-medium">Full Name</label>
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
                <label className="text-xs text-gray-600 font-medium">City</label>
                <Input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" autoComplete="off" />
                {city && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md text-sm">
                    {filteredCities.map(c => (
                      <button key={c} type="button" onClick={()=>setCity(c)} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">{c}</button>
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
              <div className="text-xs text-gray-600 font-medium mb-2">Saved Addresses</div>
              <div className="flex flex-wrap gap-2">
                {['Home - Karachi','Office - Rawalpindi'].map(a => (
                  <button key={a} type="button" onClick={()=>setSavedAddress(a)} className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${savedAddress===a?'border-primary bg-primary/10 text-primary':'border-gray-300 text-gray-600 hover:border-gray-400'}`}>{a}</button>
                ))}
              </div>
            </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">Payment Method</div>
              <div className="grid gap-3 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="pm" defaultChecked className="text-primary" /> Cash on Delivery</label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="pm" className="text-primary" /> Bank Transfer</label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="pm" className="text-primary" /> Card Payment</label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="pm" className="text-primary" /> JazzCash / Easypaisa</label>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                SSL Secured • Trusted Payments
              </div>
            </div>

            <Button className="w-max">Continue to Review</Button>
          </form>
          <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm h-max sticky top-24">
            <div className="font-bold text-gray-900 mb-4">Order Summary</div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span>Shipping</span>
              <span>{shippingEstimate === 0 ? 'Free' : `Rs ${shippingEstimate}`}</span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">Rs {total.toLocaleString('en-PK')}</span>
            </div>
            <a href="/confirmation" className="block mt-6 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold text-center transition-colors shadow-sm">Place Order</a>
          </div>
        </div>
        {/* Mobile sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 md:hidden shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-600">Total</div>
              <div className="font-bold text-gray-900">Rs {total.toLocaleString('en-PK')}</div>
            </div>
            <a href="/confirmation" className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm">Place Order</a>
          </div>
        </div>
      </main>
    </div>
  )
}


