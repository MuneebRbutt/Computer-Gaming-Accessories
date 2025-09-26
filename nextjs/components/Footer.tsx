export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="font-semibold text-white">Advance IT Traders</div>
          <div className="text-sm text-gray-400">Gaming PCs, Laptops & Accessories</div>
          <div className="mt-3 text-sm text-gray-400">Shop Address: Karachi, Pakistan</div>
        </div>
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand">Home</a></li>
            <li><a href="#products" className="hover:text-brand">Products</a></li>
            <li><a href="#about" className="hover:text-brand">About</a></li>
            <li><a href="#contact" className="hover:text-brand">Contact</a></li>
            <li><a href="#cart" className="hover:text-brand">Cart</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+923224264260" className="hover:text-brand">+92 322-4264260</a></li>
            <li><a href="mailto:advanceittraders@gmail.com" className="hover:text-brand">advanceittraders@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Follow</div>
          <div className="flex items-center gap-3 text-gray-300">
            <a href="#" aria-label="Facebook" className="hover:text-brand">Fb</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand">Ig</a>
            <a href="#" aria-label="Twitter" className="hover:text-brand">Tw</a>
            <a href="#" aria-label="YouTube" className="hover:text-brand">Yt</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Advance IT Traders. All rights reserved.
      </div>
    </footer>
  )
}


