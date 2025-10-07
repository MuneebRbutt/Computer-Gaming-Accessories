import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simplified layout - authentication will be handled by NextAuth middleware later
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                🎮 Gaming Store Admin
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
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
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <AdminNavLink href="/" icon="🏠" external>
                Back to Store
              </AdminNavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
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
        text-gray-400 hover:text-white hover:bg-gray-700
        transition-all duration-200
        ${external ? 'border border-gray-700' : ''}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}