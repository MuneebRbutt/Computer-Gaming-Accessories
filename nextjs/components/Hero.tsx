'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/Button'
import { Gamepad2, Zap, Monitor, Cpu } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div>
          {/* Gaming badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Elite Gaming Hub</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Next-Gen Gaming
            <br />
            <span className="text-primary">Accessories</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Dominate the battlefield with premium gaming PCs, cutting-edge peripherals, 
            and pro-level accessories. <span className="text-primary font-semibold">Pakistan's #1 Gaming Destination</span>
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: Monitor, label: '4K Gaming Ready', color: 'text-primary' },
              { icon: Zap, label: 'RGB Everything', color: 'text-amber-500' },
              { icon: Cpu, label: 'Custom Builds', color: 'text-indigo-500' },
              { icon: Gamepad2, label: 'Pro Peripherals', color: 'text-green-500' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-sm font-medium text-gray-700">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Link href="/pc-builder">
              <Button variant="outline" size="lg">
                <Cpu className="w-5 h-5 mr-2" />
                Custom PC Builder
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
            {[
              { value: '1000+', label: 'Products' },
              { value: '500+', label: 'Happy Gamers' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <Image
              src="/images/banner.png"
              alt="Gaming setup showcase"
              width={500}
              height={400}
              className="rounded-lg"
            />
            
            {/* Overlay badges */}
            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-white text-sm font-bold">GAMING MODE</span>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-amber-500/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-white text-sm font-bold">RGB ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
