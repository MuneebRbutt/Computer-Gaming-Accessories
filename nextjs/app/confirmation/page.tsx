import Header from '@/components/Header'
import Link from 'next/link'

export default function ConfirmationPage() {
  const orderId = Math.floor(100000 + Math.random() * 900000)
  return (
    <div className="min-h-screen bg-gaming-background text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gaming-card border border-white/5 rounded-2xl p-8 shadow-glass text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gaming-primary/5 to-transparent pointer-events-none" />

          <div className="w-20 h-20 mx-auto bg-gaming-success/10 rounded-full flex items-center justify-center mb-6 shadow-neon-success border border-gaming-success/20">
            <svg className="w-10 h-10 text-gaming-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2 glow-text">Order Confirmed!</h1>
          <p className="text-gray-400 mb-6">Thank you for leveling up your gear with us.</p>

          <div className="bg-gaming-surface rounded-xl p-4 mb-8 border border-white/5">
            <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Order Number</div>
            <div className="text-2xl font-mono font-bold text-gaming-primary">#{orderId}</div>
          </div>

          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            We've sent a confirmation email to your inbox. We'll notify you as soon as your loot ships.
          </p>

          <Link href="/">
            <div className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gaming-primary to-gaming-secondary text-white rounded-xl font-bold hover:shadow-neon transition-all duration-300 w-full">
              Continue Shopping
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}


