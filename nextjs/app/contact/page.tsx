import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form className="grid gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div>
              <label className="text-sm text-gray-700 font-medium">Name</label>
              <Input placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">Email</label>
              <Input placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">Phone</label>
              <Input placeholder="03xx-xxxxxxx" />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">Subject</label>
              <Input placeholder="Subject" />
            </div>
            <Button className="w-max mt-2">Submit</Button>
          </form>
          <div className="text-sm text-gray-700 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Our Locations</h3>
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900">Karachi</div>
                <div className="text-gray-600">Office #UG25, Glamour Mobile & Computer Mall</div>
              </div>
              <div className="mt-4">
                <div className="font-medium text-gray-900">Rawalpindi</div>
                <div className="text-gray-600">Office#LG 7-8, Office#M-27, Midway Shopping Mall</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


