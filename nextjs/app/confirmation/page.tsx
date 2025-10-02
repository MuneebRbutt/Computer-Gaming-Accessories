import Header from '@/components/Header'
import Link from 'next/link'

export default function ConfirmationPage() {
  const orderId = Math.floor(100000 + Math.random() * 900000)
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
        <div className="text-2xl font-semibold">Thank you for your order!</div>
        <div className="mt-2 text-gray-300">Order #{orderId}</div>
        <div className="mt-4 text-sm text-gray-400">We have emailed your order confirmation and will notify you when it ships.</div>
        <div className="mt-6">
          <Link href="/" className="text-brand hover:underline">Continue Shopping</Link>
        </div>
      </main>
    </div>
  )
}


