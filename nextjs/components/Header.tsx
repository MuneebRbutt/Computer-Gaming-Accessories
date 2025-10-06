'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Menu, X, User, LogOut, Gamepad2, Monitor } from 'lucide-react'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const { getTotalItems, hydrated } = useCartStore()
  
  // Use try-catch to handle missing SessionProvider
  let session = null
  let status = 'unauthenticated'
  try {
    const sessionData = useSession()
    session = sessionData.data
    status = sessionData.status
  } catch (error) {
    // SessionProvider not available, continue without session
  }
  
  const router = useRouter()

  // Only render cart badge on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    router.push(q ? `/products?query=${encodeURIComponent(q)}` : '/products')
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Top Bar - Clean Style */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-3 h-3 text-primary" />
            Owner: <span className="font-medium text-gray-900">Syed Khuram Shah</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+923224264260" className="hover:text-primary transition-colors">
              +92 322-4264260
            </a>
            <span className="text-gray-300">|</span>
            <a href="mailto:advanceittraders@gmail.com" className="hover:text-primary transition-colors">
              advanceittraders@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Header - Clean Modern */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Advance IT Traders logo"
                  width={48}
                  height={48}
                  className="rounded-full shadow-sm group-hover:shadow-md transition-all duration-200"
                />
              </div>
              <div className="leading-5">
                <div className="font-bold text-gray-900 text-lg">
                  Advance IT Traders
                </div>
                <div className="text-xs text-gray-500">Gaming & Accessories</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl relative">
              <form className="flex w-full" onSubmit={handleSearchSubmit}>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    variant="light"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for gaming PCs, laptops, accessories..."
                    className="w-full rounded-r-none"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button 
                  type="submit" 
                  className="rounded-l-none"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/pc-builder', label: 'Custom Builder' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {status === 'loading' ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="hidden sm:flex items-center gap-2"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="hidden md:inline">{session.user?.name || 'Account'}</span>
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <Link 
                          href="/account"
                          className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link 
                          href="/account/orders"
                          className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link 
                          href="/account/wishlist"
                          className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-red-600 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="hidden sm:inline-block">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="hidden sm:inline-block">
                      Register
                    </Button>
                  </Link>
                </>
              )}
              
              {/* Cart Button */}
              <Link href="/cart" className="relative">
                <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {mounted && hydrated && getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full grid place-items-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <div className="relative mb-3 mt-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex w-full gap-2">
                    <Input
                      type="text"
                      variant="light"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
              <nav className="grid gap-2 text-sm">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/products', label: 'Products' },
                  { href: '/pc-builder', label: 'Custom Builder' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/cart', label: 'Cart' },
                ].map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {session ? (
                  <>
                    <hr className="border-gray-200 my-2" />
                    <Link 
                      href="/account" 
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <button 
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 text-red-600 text-left w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <hr className="border-gray-200 my-2" />
                    <Link 
                      href="/login" 
                      className="py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
