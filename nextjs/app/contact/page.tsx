import Header from '@/components/Header'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative h-60 md:h-72 bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-90">
          <div className="absolute top-0 left-0 w-80 md:w-96 h-80 bg-gradient-to-br from-red-600 to-red-800 transform -rotate-12 -translate-x-24 -translate-y-16 rounded-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-red-500 to-red-700 transform rotate-6 translate-x-12 -translate-y-1/2 rounded-3xl"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-sm uppercase tracking-[0.4em] mb-2 text-rose-200">Get Support</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <div className="flex items-center gap-2 text-xs md:text-sm text-rose-100">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        <div className="overflow-hidden rounded-3xl shadow-xl border border-rose-100">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19802.30023008769!2d-0.13012233486475534!3d51.50735580150778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900e67c05%3A0x9f129c8f6a74797!2sLondon%20Eye!5e0!3m2!1sen!2suk!4v1684335678007!5m2!1sen!2suk"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_360px] gap-10">
          <form className="bg-white border border-rose-100 rounded-3xl shadow-lg p-8 space-y-5">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Get In Touch</h2>
              <p className="text-sm text-gray-600">Drop us a message and our support team will respond as soon as possible.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Your Name</label>
                <Input placeholder="John Doe" className="bg-gray-50 border-gray-200" />
              </div>
              <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Your Email</label>
                <Input placeholder="you@example.com" className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Subject</label>
                <Input placeholder="How can we help?" className="bg-gray-50 border-gray-200" />
              </div>
              <div>
                <label className="text-sm text-gray-700 font-medium mb-1 block">Phone / WhatsApp</label>
                <Input placeholder="03xx-xxxxxxx" className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium mb-1 block">Your Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-rose-400" />
                Our live chat is open 10am - 7pm daily
              </div>
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-rose-200/60 w-full sm:w-auto">
                Submit Now
              </Button>
            </div>
          </form>

          <div className="bg-white border border-rose-100 rounded-3xl shadow-lg p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
            <p className="text-sm text-gray-600">Reach out via phone, WhatsApp, or email. We also welcome walk-ins at our store locations.</p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Head Office</p>
                  <p className="text-gray-600">Office #UG25, Glamour Mobile & Computer Mall, Karachi</p>
                  <p className="text-gray-600 mt-2">Office #LG 7-8 & M-27, Midway Shopping Mall, Rawalpindi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <p className="text-gray-600">(+92) 300-1234567</p>
                  <p className="text-gray-600">(+92) 321-7654321</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">WhatsApp Support</p>
                  <Link
                    href="https://wa.me/923001234567"
                    target="_blank"
                    className="text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Chat via WhatsApp
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">Available Monday to Sunday, 10am - 10pm (PKT)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <Link href="mailto:support@advanceittraders.com" className="text-rose-500 hover:text-rose-600">support@advanceittraders.com</Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-rose-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Store Timings</p>
                  <p className="text-gray-600">Open every day 10:00 AM – 09:00 PM</p>
                  <p className="text-gray-600">Service center support 11:00 AM – 08:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


