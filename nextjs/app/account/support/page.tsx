export default function SupportPage() {
  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Support & Help</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-800 rounded-md bg-card">
          <div className="font-semibold mb-2">FAQs</div>
          <a href="/support" className="text-brand hover:underline text-sm">Browse FAQs</a>
        </div>
        <div className="p-4 border border-gray-800 rounded-md bg-card">
          <div className="font-semibold mb-2">Live Chat</div>
          <div className="text-sm text-gray-400">Available 12 PM – 9 PM</div>
        </div>
      </div>
    </div>
  )
}


