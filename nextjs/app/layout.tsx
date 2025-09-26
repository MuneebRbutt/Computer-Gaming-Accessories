import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Advance IT Traders - Gaming PCs, Laptops & Accessories',
  description: 'Advance IT Traders - Gaming PCs, laptops, and computer accessories at the best prices in Pakistan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface via-[#0b1224] to-surface text-gray-100 font-sans min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.06),transparent_35%)]" />
        <div className="relative">
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
