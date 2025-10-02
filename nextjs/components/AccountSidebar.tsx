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
      <div className="sticky top-20 border border-gray-800 rounded-lg bg-card p-3">
        <div className="text-sm font-semibold mb-2">My Account</div>
        <nav className="grid gap-1 text-sm">
          {items.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-md border ${active ? 'border-brand text-brand' : 'border-gray-800 hover:border-brand/60'}`}>{item.label}</Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}


