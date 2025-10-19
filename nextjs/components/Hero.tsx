'use client'

import Link from 'next/link'
import { Button } from './ui/Button'
import { Gamepad2, Zap, Monitor, Cpu } from 'lucide-react'

export default function Hero() {
  return (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#101010] to-[#1a1a1a] pt-12 pb-20 md:pt-16 md:pb-24">
      {/* Layered abstract background */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full opacity-70"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="1920" height="1080" fill="url(#paint0_radial)" />
          <g filter="url(#filter0_f)">
            <path
              d="M1694 318L1920 146V-70L1528 -50L1328 106L1694 318Z"
              fill="url(#paint1_linear)"
              fillOpacity="0.45"
            />
          </g>
          <g filter="url(#filter1_f)">
            <path
              d="M-120 958L382 642L744 812L286 1158L-120 958Z"
              fill="url(#paint2_linear)"
              fillOpacity="0.55"
            />
          </g>
          <g opacity="0.9" filter="url(#filter2_f)">
            <path
              d="M1348 986L1050 768L1308 540L1732 786L1348 986Z"
              fill="url(#paint3_linear)"
              fillOpacity="0.6"
            />
          </g>
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960 540) rotate(90) scale(820 1180)">
              <stop stopColor="#141414" />
              <stop offset="1" stopColor="#050505" />
            </radialGradient>
            <linearGradient id="paint1_linear" x1="1920" y1="-70" x2="1328" y2="318" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6D28D9" />
              <stop offset="1" stopColor="#22D3EE" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="paint2_linear" x1="382" y1="642" x2="104" y2="1076" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="paint3_linear" x1="1732" y1="540" x2="1050" y2="986" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="filter0_f" x="1228" y="-170" width="792" height="618" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
            </filter>
            <filter id="filter1_f" x="-220" y="542" width="1064" height="716" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur" />
            </filter>
            <filter id="filter2_f" x="930" y="420" width="922" height="686" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
            </filter>
          </defs>
        </svg>
        <div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-[#7c3aed]/30 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[22rem] w-[22rem] rounded-full bg-[#22d3ee]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
        {/* Content */}
        <div>
          {/* Gaming badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <Gamepad2 className="h-4 w-4 text-rose-300" />
            <span className="text-sm font-medium tracking-[0.2em] text-white/80">Elite Gaming Hub</span>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Next-Gen Gaming
            <br />
            <span className="bg-gradient-to-r from-[#22d3ee] via-[#ec4899] to-[#8b5cf6] bg-clip-text text-transparent">
              Accessories
            </span>
          </h1>

          {/* Subheading */}
          <p className="mb-8 text-lg leading-relaxed text-white/70">
            Dominate every arena with curated rigs, precision gear, and pro-tier peripherals.
            <span className="ml-2 font-semibold text-white">Pakistan&apos;s #1 Gaming Destination</span>
          </p>

          {/* Features */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {[
              { icon: Monitor, label: '4K Gaming Ready', color: 'text-cyan-300' },
              { icon: Zap, label: 'RGB Everything', color: 'text-rose-300' },
              { icon: Cpu, label: 'Custom Builds', color: 'text-indigo-300' },
              { icon: Gamepad2, label: 'Pro Peripherals', color: 'text-emerald-300' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 text-white/80 shadow-[0_10px_30px_rgba(32,32,32,0.45)] transition duration-300 hover:border-white/10 hover:bg-white/10"
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                <span className="text-sm font-medium text-white/80">{feature.label}</span>
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
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:border-transparent">
                <Cpu className="w-5 h-5 mr-2" />
                Custom PC Builder
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-8">
            {[
              { value: '1000+', label: 'Products' },
              { value: '500+', label: 'Happy Gamers' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative flex items-center justify-center">
          <div className="relative flex w-full max-w-xl flex-col items-center overflow-hidden rounded-[40px] border border-white/5 bg-white/5 p-10 text-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur">
            <svg
              viewBox="0 0 420 420"
              className="h-72 w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="hero-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(210 210) scale(160)">
                  <stop stopColor="#22d3ee" stopOpacity="0.95" />
                  <stop offset="0.45" stopColor="#9333ea" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="hero-orbit" x1="60" y1="60" x2="360" y2="360" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="210" cy="210" r="155" fill="url(#hero-core)" opacity="0.7" />
              <g stroke="url(#hero-orbit)" strokeWidth="2.5" opacity="0.9">
                <circle cx="210" cy="210" r="175" strokeDasharray="24 18" strokeLinecap="round" />
                <circle cx="210" cy="210" r="130" strokeDasharray="16 12" strokeLinecap="round" opacity="0.6" />
                <path d="M110 310C180 350 260 350 310 270" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
                <path d="M120 140C190 80 270 80 320 160" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
              </g>
              <g opacity="0.35">
                <path d="M90 220C120 260 160 280 210 280C260 280 300 260 330 220" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 10" />
                <path d="M90 200C120 160 160 140 210 140C260 140 300 160 330 200" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeDasharray="14 12" />
              </g>
              <circle cx="115" cy="150" r="10" fill="#22d3ee" />
              <circle cx="315" cy="240" r="8" fill="#ec4899" />
              <circle cx="250" cy="115" r="6" fill="#8b5cf6" />
              <circle cx="150" cy="300" r="5" fill="#38bdf8" />
            </svg>

            <div className="relative mt-6 flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/30 text-white/90">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Signal Locked</p>
                  <p className="text-base font-semibold text-white">Neon performance detected</p>
                </div>
              </div>
              <p className="text-white/60">
                Synthwave-inspired shapes pulse in real time, mirroring the precision and speed of our gaming catalogue.
              </p>
            </div>

            <div className="absolute -left-28 top-16 h-48 w-48 rounded-full bg-[#22d3ee]/20 blur-3xl" />
            <div className="absolute -right-24 bottom-12 h-40 w-40 rounded-full bg-[#ec4899]/30 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-[#ec4899]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-4 h-64 w-64 rounded-full bg-[#22d3ee]/25 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
