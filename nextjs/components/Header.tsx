'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getTotalItems } = useCartStore()

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-black/40 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div>Owner: <span className="font-medium">Syed Khuram Shah</span></div>
          <div className="flex items-center gap-4">
            <a href="tel:+923224264260" className="hover:text-brand">+92 322-4264260</a>
            <span className="hidden md:inline">|</span>
            <a href="mailto:advanceittraders@gmail.com" className="hover:text-brand">advanceittraders@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://placehold.co/40x40/0ea5e9/000000?text=AIT"
                alt="Advance IT Traders logo"
                width={40}
                height={40}
                className="rounded-full shadow-soft"
              />
              <div className="leading-5">
                <div className="font-semibold text-white">Advance IT Traders</div>
                <div className="text-xs text-gray-400">Gaming & Accessories</div>
              </div>
            </Link>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-xl relative">
              <div className="flex w-full">
                <Input
                  type="text"
                  placeholder="Search for gaming PCs, laptops, accessories..."
                  className="rounded-l-md"
                />
                <Button className="rounded-l-none rounded-r-md">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/pc-builder', label: 'Custom Builder' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/cart', label: 'Cart' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="relative inline-block">
                  <span className="hover:text-brand transition-colors">{item.label}</span>
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:inline-block">
                Login
              </Button>
              <Button size="sm" className="hidden sm:inline-block">
                Register
              </Button>
              <Link href="/cart" className="relative p-2 rounded-md hover:bg-gray-800" title="Cart">
                <ShoppingCart className="w-6 h-6 text-gray-200" />
                <span className="absolute -top-1 -right-1 bg-brand text-black text-xs font-bold w-5 h-5 rounded-full grid place-items-center">
                  {getTotalItems()}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search & Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full"
                />
              </div>
              <nav className="grid gap-2 text-sm">
                <Link href="/" className="hover:text-brand">Home</Link>
                <Link href="/products" className="hover:text-brand">Products</Link>
                <Link href="/pc-builder" className="hover:text-brand">Custom Builder</Link>
                <Link href="/about" className="hover:text-brand">About Us</Link>
                <Link href="/contact" className="hover:text-brand">Contact Us</Link>
                <Link href="/cart" className="hover:text-brand">Cart</Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
