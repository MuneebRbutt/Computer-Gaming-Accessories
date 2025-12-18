import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Gamepad2, Shield, Heart } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export default function Footer() {
  return (
    <footer className="bg-gaming-background text-gray-400 border-t border-white/5 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gaming-primary/5 rounded-full blur-[128px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gaming-secondary/5 rounded-full blur-[128px]" />
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-display font-bold text-white">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary to-gaming-secondary">Newsletter</span>
            </h3>
            <p className="text-gaming-text-secondary text-lg">
              Get exclusive deals, early access to new products, and gaming tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gaming-primary focus:ring-gaming-primary"
              />
              <Button className="bg-gaming-primary hover:bg-gaming-primary/90 text-white px-8 shadow-neon hover:shadow-neon-hover transition-all">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gaming-primary to-gaming-secondary rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-xl tracking-wide">
                  Advance IT
                </div>
                <div className="text-xs text-gaming-primary font-medium tracking-widest uppercase">
                  Traders
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Pakistan&apos;s premier destination for high-performance gaming rigs, precision peripherals, and next-gen hardware. Built by gamers, for gamers.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-gaming-primary" />
              <span>Karachi, Pakistan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/pc-builder', label: 'Custom PC Builder' },
                { href: '/deals', label: 'Special Deals' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Support' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-gaming-primary transition-all group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-gaming-primary transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-lg">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="tel:+923224264260"
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gaming-primary group-hover:text-white transition-colors border border-white/5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 group-hover:text-gray-300">Call Us</span>
                    <span className="font-medium">+92 322-4264260</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:advanceittraders@gmail.com"
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gaming-secondary group-hover:text-white transition-colors border border-white/5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 group-hover:text-gray-300">Email Us</span>
                    <span className="font-medium break-all">advanceittraders@gmail.com</span>
                  </div>
                </a>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gaming-success">
                <Shield className="w-4 h-4" />
                <span>SECURE PAYMENT</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gaming-primary">
                <Shield className="w-4 h-4" />
                <span>WARRANTY INCLUDED</span>
              </div>
            </div>
          </div>

          {/* Social & Categories */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-lg">
              Community
            </h4>
            <div className="flex items-center gap-3 mb-8">
              {[
                { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
                { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                { icon: Youtube, href: '#', color: 'hover:bg-red-600' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 transition-all hover:text-white hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <h5 className="font-medium text-white mb-4 text-sm tracking-wide">
              Quick Browse
            </h5>
            <div className="flex flex-wrap gap-2">
              {['Gaming PCs', 'Laptops', 'Keyboards', 'Mice', 'Headsets', 'Monitors'].map((category) => (
                <Link
                  key={category}
                  href="/products"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-sm">
            © {new Date().getFullYear()} Advance IT Traders. <span className="hidden sm:inline">Crafted for Gamers.</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-gaming-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gaming-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
