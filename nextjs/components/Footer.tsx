import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Gamepad2, Shield } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="orbitron-40 mb-4">
              Join Our Newsletter
            </h3>
            <p className="poppins-18 mb-6">
              Get exclusive deals, early access to new products, and gaming tips delivered to your inbox.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border-gray-700 text-white"
              />
              <Button className="px-6">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">
                  Advance IT Traders
                </div>
                <div className="text-sm text-gray-400">
                  Gaming & Tech Hub
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pakistan's premier destination for gaming PCs, laptops, and accessories. 
              Building dreams, one component at a time.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-gray-400">Karachi, Pakistan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/pc-builder', label: 'PC Builder' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/cart', label: 'Shopping Cart' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:+923224264260"
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+92 322-4264260</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:advanceittraders@gmail.com"
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-3"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="break-all">advanceittraders@gmail.com</span>
                </a>
              </li>
            </ul>
            
            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-400">
                <Shield className="w-3 h-3" />
                <span>SECURE PAYMENT</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Shield className="w-3 h-3" />
                <span>WARRANTY INCLUDED</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Shield className="w-3 h-3" />
                <span>24/7 SUPPORT</span>
              </div>
            </div>
          </div>

          {/* Social & Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-3 mb-6">
              {[
                { icon: Facebook, href: '#', color: 'hover:text-blue-400' },
                { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
                { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
                { icon: Youtube, href: '#', color: 'hover:text-red-400' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 transition-all hover:border-primary ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <h5 className="font-medium text-white mb-3 text-sm">
              Popular Categories
            </h5>
            <ul className="space-y-2 text-xs">
              {['Gaming PCs', 'Gaming Laptops', 'Keyboards', 'Gaming Mice', 'Headsets'].map((category) => (
                <li key={category}>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Advance IT Traders. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/returns" className="hover:text-primary transition-colors">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
