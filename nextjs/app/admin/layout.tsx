'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Bypass login/role checks entirely when auth is disabled
    if (disableAuth) {
      setIsAdmin(true)
      setLoading(false)
      return
    }

    if (status === 'loading') return
    
    if (!session) {
      router.push('/login?callbackUrl=/admin')
      return
    }

    // Check if user has admin role
    const checkAdminRole = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const userData = await response.json()
        
        if (userData && (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN')) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Failed to check admin role:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminRole()
  }, [session, status, router, disableAuth])

  if ((status === 'loading' && !disableAuth) || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
          <p className="text-purple-300 text-lg">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-purple-300 mb-6">You don't have permission to access the admin panel.</p>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Simple Admin Header */}
      <header className="bg-gradient-to-r from-slate-800/90 to-purple-800/90 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold">G</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Gaming Store Admin
                  </h1>
                  <p className="text-sm text-purple-300">Management Panel</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {(session?.user?.email?.[0]?.toUpperCase() || 'A')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'}
                  </p>
                  <p className="text-xs text-purple-300">{session?.user?.email || 'admin@demo.local'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Simple Sidebar Navigation */}
        <nav className="w-72 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-lg border-r border-purple-500/20 min-h-screen shadow-2xl">
          <div className="p-6">
            <div className="space-y-3">
              <AdminNavLink href="/admin" icon="📊">
                Dashboard
              </AdminNavLink>
              <AdminNavLink href="/admin/products" icon="🎮">
                Products
              </AdminNavLink>
              <AdminNavLink href="/admin/categories" icon="📁">
                Categories
              </AdminNavLink>
              <AdminNavLink href="/admin/orders" icon="📦">
                Orders
              </AdminNavLink>
              <AdminNavLink href="/admin/users" icon="👥">
                Users
              </AdminNavLink>
              <AdminNavLink href="/admin/reviews" icon="⭐">
                Reviews
              </AdminNavLink>
              <AdminNavLink href="/admin/analytics" icon="📈">
                Analytics
              </AdminNavLink>
              <AdminNavLink href="/admin/settings" icon="⚙️">
                Settings
              </AdminNavLink>
            </div>
            
            <div className="mt-8 pt-8 border-t border-purple-500/20">
              <AdminNavLink href="/" icon="🏠" external>
                Back to Store
              </AdminNavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 text-white bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function AdminNavLink({ 
  href, 
  icon, 
  children, 
  external = false
}: { 
  href: string
  icon: string
  children: React.ReactNode
  external?: boolean 
}) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center space-x-3 px-4 py-3 rounded-xl
        text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20
        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        border border-transparent hover:border-purple-500/30
        backdrop-blur-sm
        ${external ? 'border border-purple-500/30 bg-slate-800/30' : ''}
      `}
    >
      <div className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
        <span className="text-lg">{icon}</span>
      </div>
      <span className="font-medium group-hover:font-semibold transition-all duration-300">{children}</span>
    </Link>
  )
}