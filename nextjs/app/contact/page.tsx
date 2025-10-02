import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form className="grid gap-3">
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <Input placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <Input placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Phone</label>
              <Input placeholder="03xx-xxxxxxx" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Subject</label>
              <Input placeholder="Subject" />
            </div>
            <Button className="w-max">Submit</Button>
          </form>
          <div className="text-sm text-gray-300">
            Karachi: Office #UG25, Glamour Mobile & Computer Mall...
            <div className="mt-3">Rawalpindi: Office#LG 7-8, Office#M-27, Midway Shopping Mall...</div>
          </div>
        </div>
      </main>
    </div>
  )
}


