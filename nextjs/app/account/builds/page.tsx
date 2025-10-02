export default function BuildsPage() {
  const builds = [
    { id: 'build-001', name: 'Gaming 1080p', total: 165000 },
  ]
  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Saved Builds</div>
      <div className="space-y-3">
        {builds.map(b => (
          <div key={b.id} className="p-4 border border-gray-800 rounded-md bg-card flex items-center justify-between">
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-sm text-brand">Rs {b.total.toLocaleString('en-PK')}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-700 rounded-md text-sm hover:border-brand">View</button>
              <button className="px-3 py-1.5 bg-brand text-black rounded-md text-sm font-semibold">Add to Cart</button>
              <button className="px-3 py-1.5 border border-gray-700 rounded-md text-sm hover:border-brand">Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


