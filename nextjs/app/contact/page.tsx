import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gaming-background text-white">
      <Header />
      <div className="relative h-60 md:h-72 bg-gaming-background overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gaming-primary/20 blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gaming-secondary/20 blur-[100px] transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <p className="text-sm uppercase tracking-[0.4em] mb-2 text-gaming-primary font-bold">Get Support</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 glow-text">Contact Us</h1>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
            <Link href="/" className="hover:text-gaming-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gaming-primary">Contact Us</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        <div className="overflow-hidden rounded-3xl shadow-glass border border-white/5 bg-gaming-card/50">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8534448732986!2d74.34304607549654!3d31.508874974246906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904f90c9fbc47%3A0x2c0e1e1e1e1e1e1e!2sHafeez%20Centre%2C%20Main%20Blvd%20Gulberg%2C%20Block%20E1%20Gulberg%20III%2C%20Lahore!5e0!3m2!1sen!2s!4v1729684800000!5m2!1sen!2s"
            width="100%"
            height="420"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-10">
          <form className="bg-gaming-card border border-white/5 rounded-3xl shadow-glass p-8 space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-display font-bold text-white mb-2">Get In Touch</h2>
              <p className="text-sm text-gray-400">Drop us a message and our support team will respond as soon as possible.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium uppercase tracking-wider block">Your Name</label>
                <Input placeholder="John Doe" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium uppercase tracking-wider block">Your Email</label>
                <Input placeholder="you@example.com" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium uppercase tracking-wider block">Subject</label>
                <Input placeholder="How can we help?" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium uppercase tracking-wider block">Phone / WhatsApp</label>
                <Input placeholder="03xx-xxxxxxx" className="bg-gaming-surface border-white/10 text-white placeholder:text-gray-600 focus:border-gaming-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium uppercase tracking-wider block">Your Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-white/10 bg-gaming-surface px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gaming-primary focus:border-gaming-primary resize-none placeholder:text-gray-600"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-gray-500 flex items-center gap-2 bg-gaming-surface px-3 py-2 rounded-full border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                Our live chat is open 10am - 7pm daily
              </div>
              <Button className="bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 px-8 py-2 rounded-full text-white font-bold shadow-neon border-0 w-full sm:w-auto hover:shadow-neon-hover transition-all">
                Submit Now
              </Button>
            </div>
          </form>

          <div className="bg-gaming-card border border-white/5 rounded-3xl shadow-glass p-8 space-y-8">
            <h3 className="text-xl font-display font-bold text-white border-b border-white/5 pb-4">Contact Details</h3>
            <p className="text-sm text-gray-400">Reach out via phone, WhatsApp, or email. We also welcome walk-ins at our store locations.</p>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gaming-primary/10 flex items-center justify-center group-hover:bg-gaming-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-gaming-primary" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Store Location</p>
                  <p className="text-gray-400">Shop #65, 2nd Floor, Hafeez Centre</p>
                  <p className="text-gray-400">Main Boulevard, Block E1 Gulberg 2, Lahore</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gaming-secondary/10 flex items-center justify-center group-hover:bg-gaming-secondary/20 transition-colors">
                  <Phone className="w-5 h-5 text-gaming-secondary" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Call Us</p>
                  <p className="text-gray-400">(+92) 300-1234567</p>
                  <p className="text-gray-400">(+92) 321-7654321</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">WhatsApp Support</p>
                  <Link
                    href="https://wa.me/923001234567"
                    target="_blank"
                    className="text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Chat via WhatsApp
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">Available Monday to Sunday, 10am - 10pm (PKT)</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gaming-primary/10 flex items-center justify-center group-hover:bg-gaming-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-gaming-primary" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Email</p>
                  <Link href="mailto:support@advanceittraders.com" className="text-gaming-primary hover:text-gaming-accent transition-colors">support@advanceittraders.com</Link>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gaming-secondary/10 flex items-center justify-center group-hover:bg-gaming-secondary/20 transition-colors">
                  <Clock className="w-5 h-5 text-gaming-secondary" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Store Timings</p>
                  <p className="text-gray-400">Open every day 10:00 AM – 09:00 PM</p>
                  <p className="text-gray-400">Service center support 11:00 AM – 08:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


