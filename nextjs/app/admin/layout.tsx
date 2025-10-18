import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/database'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/admin')
  }

  const user = await UserService.getUserByEmail(session.user.email)
  
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      {/* Admin Header */}
      <header className="bg-gaming-darker border-b border-gaming-accent/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                🎮 Gaming Store Admin
              </h1>
              <span className="px-3 py-1 bg-gaming-primary/20 text-gaming-primary text-sm font-medium rounded-full">
                {user.role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gaming-muted">
                Welcome, {user.firstName || user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gaming-darker border-r border-gaming-accent/20 min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
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
            
            <div className="mt-8 pt-8 border-t border-gaming-accent/20">
              <AdminNavLink href="/" icon="🏠" external>
                Back to Store
              </AdminNavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 text-white">
          {children}
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
        flex items-center space-x-3 px-4 py-2 rounded-lg
        text-gaming-muted hover:text-white hover:bg-gaming-accent/10
        transition-all duration-200
        ${external ? 'border border-gaming-accent/20' : ''}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}