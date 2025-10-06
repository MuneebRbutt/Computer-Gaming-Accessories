"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/account', label: 'Dashboard' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/builds', label: 'Saved Builds' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/settings', label: 'Settings' },
  { href: '/account/support', label: 'Support' },
]

export default function AccountSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:block md:w-64">
      <div className="sticky top-20 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
        <div className="text-sm font-bold text-gray-900 mb-3">My Account</div>
        <nav className="grid gap-1 text-sm">
          {items.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-md border transition-all ${active ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:text-gray-900'}`}>{item.label}</Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}


