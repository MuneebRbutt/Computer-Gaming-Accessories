'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'circle' | 'gaming'
  animation?: 'pulse' | 'wave' | 'glow'
}

export function Skeleton({ 
  className, 
  variant = 'default', 
  animation = 'pulse' 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variants = {
    default: 'h-4 w-full rounded',
    card: 'h-48 w-full rounded-lg',
    text: 'h-4 w-3/4 rounded',
    circle: 'h-12 w-12 rounded-full',
    gaming: 'h-4 w-full rounded bg-gradient-to-r from-gaming-primary/20 to-gaming-accent/20'
  }
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    glow: 'animate-glow'
  }
  
  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        animations[animation],
        className
      )}
    />
  )
}

// Pre-built skeleton components for common use cases
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gaming-darker rounded-lg shadow-card overflow-hidden">
      <Skeleton variant="card" className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-20" />
          <Skeleton variant="circle" className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Image Gallery */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="flex lg:flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Main Image */}
      <div className="lg:col-span-5 order-1 lg:order-2">
        <Skeleton variant="card" className="h-96 w-full rounded-lg" />
      </div>
      
      {/* Product Info */}
      <div className="lg:col-span-6 order-3 space-y-4">
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="text" className="h-6 w-1/2" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
        <div className="flex items-center gap-4">
          <Skeleton variant="text" className="h-8 w-24" />
          <Skeleton variant="text" className="h-6 w-16" />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="default" className="h-12 w-32" />
          <Skeleton variant="default" className="h-12 w-12" />
        </div>
      </div>
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <header className="bg-white dark:bg-gaming-darker shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-8 w-32" />
          <div className="hidden md:flex items-center gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-4 w-16" />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="h-8 w-8" />
            <Skeleton variant="circle" className="h-8 w-8" />
            <Skeleton variant="default" className="h-8 w-20" />
          </div>
        </div>
      </div>
    </header>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="text" 
              className={`h-4 ${colIndex === 0 ? 'w-16' : 'w-24'}`} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function GamingSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10 p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="relative space-y-3">
        <Skeleton variant="gaming" className="h-6 w-3/4" />
        <Skeleton variant="gaming" className="h-4 w-1/2" />
        <Skeleton variant="gaming" className="h-4 w-2/3" />
      </div>
    </div>
  )
}
