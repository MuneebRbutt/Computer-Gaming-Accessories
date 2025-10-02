export default function OrdersPage() {
  const orders = [
    { id: 'A12345', date: '2025-09-30', status: 'Processing', total: 345000 },
    { id: 'A12012', date: '2025-08-15', status: 'Delivered', total: 12500 },
  ]
  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Orders</div>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="p-4 border border-gray-800 rounded-md bg-card flex items-center justify-between">
            <div>
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-xs text-gray-400">{o.date} • {o.status}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-semibold">Rs {o.total.toLocaleString('en-PK')}</div>
              <a href="#" className="px-3 py-1.5 border border-gray-700 rounded-md text-sm hover:border-brand">Details</a>
              <a href="#" className="px-3 py-1.5 bg-brand text-black rounded-md text-sm font-semibold">Reorder</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


