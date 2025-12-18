"use client"

import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import CheckoutProgress from '@/components/CheckoutProgress'
import { useState, useMemo } from 'react'
import { useCartStore } from '@/hooks/useCartStore'

export default function CheckoutPage() {
  const [city, setCity] = useState('')
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta']
  const filteredCities = cities.filter(c => c.toLowerCase().includes(city.toLowerCase())).slice(0, 5)
  const [savedAddress, setSavedAddress] = useState('')
  const { getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shippingEstimate = subtotal >= 150000 ? 0 : 500
  const total = subtotal + shippingEstimate
  return (
    <div className="min-h-screen bg-gaming-background text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-display font-bold text-white mb-6 glow-text text-center">Checkout</h1>
        <CheckoutProgress steps={[{ key: 'cart', label: 'Cart' }, { key: 'shipping', label: 'Shipping' }, { key: 'payment', label: 'Payment' }, { key: 'confirm', label: 'Confirmation' }]} active="shipping" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form className="lg:col-span-2 grid gap-8">
            <div className="space-y-4">
              <div className="text-lg font-display font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gaming-primary rounded-full"></span>
                Shipping Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gaming-card border border-white/5 rounded-2xl shadow-glass">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Full Name</label>
                  <Input placeholder="Your name" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</label>
                  <Input placeholder="03xx-xxxxxxx" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</label>
                  <Input placeholder="you@example.com" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
                </div>
                <div className="relative space-y-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" autoComplete="off" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
                  {city && (
                    <div className="absolute z-10 mt-1 w-full bg-gaming-surface border border-white/10 rounded-lg shadow-xl text-sm overflow-hidden">
                      {filteredCities.map(c => (
                        <button key={c} type="button" onClick={() => setCity(c)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-300 transition-colors">{c}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Address</label>
                  <Input placeholder="Street address" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Saved Addresses</div>
                <div className="flex flex-wrap gap-2">
                  {['Home - Karachi', 'Office - Rawalpindi'].map(a => (
                    <button key={a} type="button" onClick={() => setSavedAddress(a)} className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${savedAddress === a ? 'border-gaming-primary bg-gaming-primary/20 text-gaming-primary shadow-neon' : 'border-white/10 bg-gaming-surface text-gray-400 hover:border-white/20 hover:text-white'}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-display font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gaming-secondary rounded-full"></span>
                Payment Method
              </div>
              <div className="grid gap-3 border border-white/5 rounded-2xl p-6 bg-gaming-card shadow-glass">
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <input type="radio" name="pm" defaultChecked className="text-gaming-primary focus:ring-gaming-primary bg-gaming-surface border-white/20" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <input type="radio" name="pm" className="text-gaming-primary focus:ring-gaming-primary bg-gaming-surface border-white/20" />
                  <span className="font-medium">Bank Transfer</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <input type="radio" name="pm" className="text-gaming-primary focus:ring-gaming-primary bg-gaming-surface border-white/20" />
                  <span className="font-medium">Card Payment</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <input type="radio" name="pm" className="text-gaming-primary focus:ring-gaming-primary bg-gaming-surface border-white/20" />
                  <span className="font-medium">JazzCash / Easypaisa</span>
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2 px-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                SSL Secured • Trusted Payments
              </div>
            </div>

            <Button className="w-max bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 shadow-neon border-0">Continue to Review</Button>
          </form>
          <div className="p-6 border border-white/5 rounded-2xl bg-gaming-card shadow-glass h-max sticky top-24">
            <h3 className="font-display font-bold text-white mb-6 text-xl">Order Summary</h3>
            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>Subtotal</span>
              <span className="text-white">Rs {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-white/10">
              <span>Shipping</span>
              <span className="text-green-400">{shippingEstimate === 0 ? 'Free' : `Rs ${shippingEstimate}`}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-gray-300">Total</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Rs {total.toLocaleString('en-PK')}</span>
            </div>
            <a href="/confirmation" className="block w-full py-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 text-white rounded-xl text-sm font-bold text-center transition-all shadow-neon hover:shadow-neon-hover">
              Place Order
            </a>
          </div>
        </div>
        {/* Mobile sticky bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gaming-card border-t border-white/10 p-4 md:hidden shadow-lg backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Total</div>
              <div className="font-bold text-white text-lg">Rs {total.toLocaleString('en-PK')}</div>
            </div>
            <a href="/confirmation" className="px-8 py-3 bg-gaming-primary text-white rounded-lg text-sm font-bold shadow-neon">Place Order</a>
          </div>
        </div>
      </main>
    </div>
  )
}


