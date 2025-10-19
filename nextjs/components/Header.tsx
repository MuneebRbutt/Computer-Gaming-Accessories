'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Search, ShoppingCart, Menu, X, User, LogOut, Home, Package, Cpu, Mail, Phone } from 'lucide-react'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

  // Only render cart count after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Custom Builder', href: '/pc-builder', icon: Cpu },
    { name: 'Contact', href: '/contact', icon: Mail },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Info Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-primary" />
              <span className="hidden sm:inline">Call:</span> +92 300 1234567
            </span>
          </div>
          <span className="text-gray-300 text-xs hidden md:inline">
            🎮 Your Ultimate Gaming Accessories Destination
          </span>
          <Link href="/support" className="hover:text-primary transition-colors">
            Support
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight">Gaming Store</h1>
              <p className="text-xs text-gray-500">Premium Accessories</p>
            </div>
          </Link>

          {/* Desktop Navigation - Sliding Buttons */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative px-6 py-2.5 rounded-full font-medium transition-all duration-300
                    flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-primary'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      {(session.user as any)?.role === 'SUPER_ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-primary hover:bg-gray-50 font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut()
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-primary hover:bg-gray-50 font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="search"
                placeholder="Search for gaming accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-4 duration-300">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`} />
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile User Menu */}
            <div className="pt-4 border-t border-gray-200">
              {session ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 text-primary" />
                    My Account
                  </Link>
                  {(session.user as any)?.role === 'SUPER_ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-primary hover:bg-gray-100 mt-2"
                    >
                      <Cpu className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 text-primary" />
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 mt-2 font-medium"
                  >
                    <User className="w-5 h-5" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
