import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-gray-600">Brand story, mission and vision, values, and milestones.</p>
      </main>
    </div>
  )
}


