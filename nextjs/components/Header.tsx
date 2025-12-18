'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Search, ShoppingCart, Menu, X, User, LogOut, Home, Package, Cpu, Mail, Phone } from 'lucide-react'
import { useCartStore } from '@/hooks/useCartStore'
import { CartItem } from '@/lib/store'
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
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((state) => state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0))

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  return (
    <>
      {/* Top Info Bar - Cyber Aesthetic */}
      <div className="bg-gaming-background/95 border-b border-white/5 text-gray-400 py-1.5 backdrop-blur-sm z-[60] relative">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-gaming-accent transition-colors cursor-pointer">
              <Phone className="w-3 h-3 text-gaming-primary" />
              <span className="hidden sm:inline font-mono">+92 300 1234567</span>
            </span>
          </div>
          <span className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gaming-success animate-pulse" />
            SYSTEMS ONLINE // READY TO SHIP
          </span>
          <Link href="/support" className="hover:text-gaming-primary transition-colors hover:underline decoration-gaming-primary/50 underline-offset-4">
            SUPPORT CENTER
          </Link>
        </div>
      </div>

      {/* Main Header - Floating Glass */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'top-2' : 'top-8'
          }`}
      >
        <div className={`container mx-auto px-4 transition-all duration-300 ${scrolled ? '' : 'max-w-7xl'}`}>
          <div className={`
            relative flex items-center justify-between gap-4 p-4 rounded-2xl transition-all duration-300
            ${scrolled
              ? 'bg-gaming-background/80 backdrop-blur-xl border border-white/10 shadow-glass py-3'
              : 'bg-transparent py-6'
            }
          `}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-gaming-primary to-gaming-secondary flex items-center justify-center shadow-neon group-hover:shadow-neon-hover transition-all duration-300">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="w-6 h-6 text-white relative z-10" />
              </div>
              <div className={`hidden sm:block transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
                <h1 className="font-display font-bold text-xl leading-none text-white tracking-wide group-hover:text-glow transition-all">
                  NEXUS
                </h1>
                <p className="text-[10px] text-gaming-text-accent tracking-[0.2em] uppercase">Gaming Systems</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center px-4">
              <div className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-300 ${scrolled ? 'bg-gaming-surface/50 border border-white/5' : ''}`}>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300
                        flex items-center gap-2 group overflow-hidden
                        ${isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gaming-primary/80 to-gaming-secondary/80 opacity-100 rounded-full" />
                      )}

                      {/* Hover effect background for non-active */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                      )}

                      <Icon className={`w-3.5 h-3.5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gaming-primary'}`} />
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 group-hover:text-gaming-accent transition-colors" />
              </button>

              {/* User Menu */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5 group-hover:text-gaming-primary transition-colors" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-4 w-56 animate-in slide-in-from-top-2 duration-200">
                    <div className="glass-panel rounded-xl overflow-hidden p-1">
                      {session ? (
                        <>
                          <div className="px-4 py-3 border-b border-white/5 mb-1">
                            <p className="text-sm font-medium text-white">{session.user?.name}</p>
                            <p className="text-xs text-gaming-text-muted truncate">{session.user?.email}</p>
                          </div>
                          <div className="space-y-0.5">
                            <Link
                              href="/account"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              My Account
                            </Link>
                            {(session.user as any)?.role === 'SUPER_ADMIN' && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gaming-accent hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Cpu className="w-4 h-4" />
                                Admin Panel
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                setUserMenuOpen(false)
                                signOut()
                              }}
                              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Terminals Off
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-1 space-y-1">
                          <Link
                            href="/login"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg hover:shadow-glow transition-all"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Join Nexus
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:text-gaming-success transition-colors" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gaming-success text-[10px] font-bold text-black border-2 border-gaming-background">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 glass-panel rounded-2xl overflow-hidden animate-in slide-in-from-top-2">
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                         flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                         ${isActive
                          ? 'bg-gradient-to-r from-gaming-primary/20 to-gaming-secondary/20 text-white border border-gaming-primary/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }
                       `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-gaming-primary' : ''}`} />
                      {item.name}
                    </Link>
                  )
                })}

                <div className="h-px bg-white/5 my-4" />

                {!session ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-center py-3 rounded-xl bg-gaming-primary text-white font-bold hover:bg-gaming-primary/90"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      <User className="w-5 h-5" />
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}

          {/* Search Overlay */}
          {searchOpen && (
            <div className="absolute top-full left-0 right-0 mt-4 px-4 pb-4 animate-in slide-in-from-top-2">
              <div className="glass-panel p-2 rounded-2xl flex gap-2">
                <Input
                  type="search"
                  placeholder="Search internal database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/20 border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gaming-primary"
                  autoFocus
                />
                <Button onClick={handleSearch} className="bg-gaming-primary hover:bg-gaming-primary/80 text-white px-6">
                  SCAN
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
