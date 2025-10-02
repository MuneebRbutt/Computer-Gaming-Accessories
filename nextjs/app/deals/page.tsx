import Header from '@/components/Header'

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-2xl font-semibold mb-6">Deals & Promotions</h1>
        <p className="text-gray-300">Time-limited offers, clearance sales, and bundle deals.</p>
      </main>
    </div>
  )
}


