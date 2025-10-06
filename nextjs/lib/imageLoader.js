/**
 * Custom Image Loader for ImageKit Integration
 * Provides optimized image delivery with WebP conversion and responsive sizing
 */

export default function imageKitLoader({ src, width, quality }) {
  // If it's already an optimized URL, return as-is
  if (src.startsWith('https://ik.imagekit.io/') || src.startsWith('data:')) {
    return src
  }

  const params = new URLSearchParams()
  
  // Set width for responsive images
  if (width) {
    params.set('tr', `w-${width}`)
  }
  
  // Set quality (default 75 for optimal balance)
  const imageQuality = quality || 75
  params.set('tr', `${params.get('tr') || ''},q-${imageQuality}`)
  
  // Auto format to WebP/AVIF for modern browsers
  params.set('tr', `${params.get('tr')},f-auto`)
  
  // Progressive loading
  params.set('tr', `${params.get('tr')},pr-true`)
  
  // ImageKit endpoint
  const IMAGEKIT_ENDPOINT = process.env.IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/gaming-store'
  
  // Handle different source types
  let imagePath = src
  
  // If it's a relative path, make it absolute
  if (src.startsWith('/')) {
    imagePath = src.substring(1)
  }
  
  // If it's an external URL, encode it
  if (src.startsWith('http')) {
    imagePath = encodeURIComponent(src)
  }
  
  return `${IMAGEKIT_ENDPOINT}/${imagePath}?${params.toString()}`
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(src, sizes = [640, 750, 828, 1080, 1200, 1920]) {
  return sizes
    .map(size => `${imageKitLoader({ src, width: size, quality: 75 })} ${size}w`)
    .join(', ')
}

/**
 * Get optimized image URL with gaming-specific presets
 */
export function getOptimizedImageUrl(src, preset = 'default') {
  const presets = {
    default: { width: 800, quality: 75 },
    thumbnail: { width: 300, quality: 80 },
    hero: { width: 1920, quality: 85 },
    product: { width: 600, quality: 80 },
    avatar: { width: 128, quality: 90 },
    background: { width: 1920, quality: 70 },
    card: { width: 400, quality: 75 },
  }
  
  const config = presets[preset] || presets.default
  return imageKitLoader({ src, ...config })
}

/**
 * Lazy loading intersection observer setup
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined') return
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.classList.remove('lazy-loading')
          img.classList.add('lazy-loaded')
          observer.unobserve(img)
        }
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '50px 0px'
  })
  
  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img)
  })
}

/**
 * Preload critical images for gaming performance
 */
export function preloadCriticalImages(urls) {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedImageUrl(url, 'hero')
    document.head.appendChild(link)
  })
}