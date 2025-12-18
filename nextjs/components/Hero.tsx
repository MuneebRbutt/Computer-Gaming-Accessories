'use client'

import Link from 'next/link'
import { Button } from './ui/Button'
import { Gamepad2, Zap, Monitor, Cpu, ChevronRight, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gaming-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gaming-primary/30 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gaming-secondary/20 rounded-full blur-[128px] animate-pulse-glow delay-1000" />
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gaming-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gaming-success"></span>
              </span>
              <span className="text-xs font-mono text-gaming-text-secondary tracking-widest uppercase">
                Next Gen Systems Online
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight">
              UNLEASH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-primary via-gaming-secondary to-gaming-accent animate-shimmer bg-[length:200%_auto]">
                ULTIMATE POWER
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gaming-text-secondary max-w-xl leading-relaxed">
              Experience gaming like never before with our precision-engineered rigs and premium peripherals. Built for the elite, ready for glory.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-gaming-primary hover:bg-gaming-primary/90 text-white px-8 h-14 rounded-full shadow-neon hover:shadow-neon-hover transition-all duration-300 group">
                  <Zap className="w-5 h-5 mr-2 group-hover:fill-current" />
                  START SHOPPING
                </Button>
              </Link>
              <Link href="/pc-builder">
                <Button variant="outline" size="lg" className="border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 h-14 rounded-full backdrop-blur-md">
                  <Cpu className="w-5 h-5 mr-2" />
                  BUILD YOUR RIG
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t border-white/5">
              {[
                { label: 'Latency', value: '1ms' },
                { label: 'Performance', value: 'ULTRA' },
                { label: 'Warranty', value: '3 YEARS' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-xs text-gaming-text-muted uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            {/* Floating Card */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-float p-8 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700">
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/20 to-transparent rounded-3xl opacity-50" />

              {/* Content inside card */}
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <Cpu className="w-8 h-8 text-gaming-accent" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gaming-success/20 border border-gaming-success/30 text-gaming-success text-xs font-bold">
                    RTX 4090 READY
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-2/3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gaming-primary animate-shimmer" />
                  </div>
                  <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-display font-bold text-white">
                    OMEGA <span className="text-gaming-secondary">X</span>
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Starting at</span>
                    <span className="text-white font-mono font-bold">$2,499</span>
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl">
                    VIEW SPECS <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Background Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gaming-primary/5 rounded-full blur-[100px]" />
          </div>

        </div>
      </div>
    </section>
  )
}
