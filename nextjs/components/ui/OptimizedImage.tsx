'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { getOptimizedImageUrl } from '@/lib/imageLoader'
import { FALLBACK_IMAGE_DATA_URI } from '@/lib/utils'
import { motion } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  preset?: 'default' | 'thumbnail' | 'hero' | 'product' | 'avatar' | 'background' | 'card'
  className?: string
  priority?: boolean
  lazy?: boolean
  gaming?: boolean
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  preset = 'default',
  className = '',
  priority = false,
  lazy = true,
  gaming = false,
  fallback = FALLBACK_IMAGE_DATA_URI,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  // Gaming-specific loading animation
  const GamingLoader = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 animate-pulse">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setImageSrc(fallback)
    setIsLoading(false)
    onError?.()
  }

  // Lazy loading intersection observer
  useEffect(() => {
    if (!lazy || priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            setImageSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '100px 0px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, src])

  // Get optimized image URL
  const optimizedSrc = getOptimizedImageUrl(imageSrc, preset)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading state with gaming theme */}
      {isLoading && gaming && <GamingLoader />}
      
      {/* Optimized Image */}
      <Image
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={gaming ? 85 : 75}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${gaming ? 'gaming-image-enhancement' : ''}
          ${className}
        `}
        style={{
          objectFit: 'cover',
          ...(gaming && {
            filter: 'contrast(1.1) saturate(1.1)',
          }),
        }}
        {...props}
      />

      {/* Gaming enhancement overlay */}
      {gaming && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none gaming-overlay"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Gaming-specific image variants
export function GamingHeroImage(props: Omit<OptimizedImageProps, 'gaming' | 'preset'>) {
  return <OptimizedImage {...props} gaming preset="hero" priority />
}

export function ProductImage(props: Omit<OptimizedImageProps, 'gaming' | 'preset'>) {
  return <OptimizedImage {...props} gaming preset="product" />
}

export function ThumbnailImage(props: Omit<OptimizedImageProps, 'preset'>) {
  return <OptimizedImage {...props} preset="thumbnail" />
}

export function AvatarImage(props: Omit<OptimizedImageProps, 'preset'>) {
  return <OptimizedImage {...props} preset="avatar" />
}