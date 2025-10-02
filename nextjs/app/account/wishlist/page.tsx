export default function WishlistPage() {
  const items = [
    { id: 'kb-rgb', title: 'RGB Mechanical Keyboard', price: 12500 },
    { id: 'laptop4060', title: 'Gaming Laptop 15" RTX 4060', price: 345000 },
  ]
  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Wishlist</div>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="p-4 border border-gray-800 rounded-md bg-card flex items-center justify-between">
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-brand">Rs {i.price.toLocaleString('en-PK')}</div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/products/${i.id}`} className="px-3 py-1.5 border border-gray-700 rounded-md text-sm hover:border-brand">View</a>
              <button className="px-3 py-1.5 bg-brand text-black rounded-md text-sm font-semibold">Move to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


