import Header from '@/components/Header'

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Deals & Promotions</h1>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-600">Time-limited offers, clearance sales, and bundle deals coming soon!</p>
        </div>
      </main>
    </div>
  )
}


