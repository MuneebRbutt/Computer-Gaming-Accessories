/**
 * Minimal image loader that keeps paths local while we develop without ImageKit.
 */

export default function localImageLoader({ src }) {
  if (!src) return ''

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src
  }

  return src.startsWith('/') ? src : `/${src}`
}

/**
 * Generate srcSet for responsive images (returns repeated local URL for now).
 */
export function generateSrcSet(src, sizes = [640, 750, 828, 1080, 1200, 1920]) {
  const resolvedSrc = localImageLoader({ src })
  return sizes.map(size => `${resolvedSrc} ${size}w`).join(', ')
}

/**
 * Return a usable image URL based on the provided source.
 */
export function getOptimizedImageUrl(src) {
  return localImageLoader({ src })
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
    link.href = getOptimizedImageUrl(url)
    document.head.appendChild(link)
  })
}