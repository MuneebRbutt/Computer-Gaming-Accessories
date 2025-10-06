/**
 * Performance Monitoring for Gaming Store
 * Real-time performance tracking and optimization
 */

import { cacheManager, CACHE_CONFIG } from './cache'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url?: string
  userAgent?: string
  connectionType?: string
}

interface WebVitals {
  CLS: number  // Cumulative Layout Shift
  FID: number  // First Input Delay
  FCP: number  // First Contentful Paint
  LCP: number  // Largest Contentful Paint
  TTFB: number // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private vitals: Partial<WebVitals> = {}

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return

    // Web Vitals monitoring
    this.initWebVitals()
    
    // Gaming-specific performance monitoring
    this.initGamingMetrics()
    
    // Resource timing monitoring
    this.initResourceTiming()
    
    // User interaction monitoring
    this.initUserInteractionTiming()
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime)
          this.vitals.FCP = entry.startTime
        }
      })
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
      this.vitals.LCP = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
        this.vitals.FID = entry.processingStart - entry.startTime
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.vitals.CLS = clsValue
        }
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }

  /**
   * Gaming-specific performance metrics
   */
  private initGamingMetrics() {
    // Track gaming component load times
    const gamingComponents = [
      'pc-builder',
      'product-comparison',
      'performance-meter',
      'gaming-cart'
    ]

    gamingComponents.forEach(component => {
      const startTime = performance.now()
      
      // Use Intersection Observer to track when components become visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const loadTime = performance.now() - startTime
            this.recordMetric(`${component}-load-time`, loadTime)
            observer.unobserve(entry.target)
          }
        })
      })

      // Observe elements with gaming component classes
      document.querySelectorAll(`[data-component="${component}"]`).forEach(el => {
        observer.observe(el)
      })
    })

    // Track 3D/WebGL performance for product viewers
    this.monitorWebGLPerformance()
  }

  /**
   * Monitor WebGL performance for 3D product viewers
   */
  private monitorWebGLPerformance() {
    const canvas = document.querySelector('canvas[data-webgl]')
    if (!canvas) return

    let frameCount = 0
    let lastTime = performance.now()
    let fps = 0

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        fps = frameCount
        this.recordMetric('webgl-fps', fps)
        frameCount = 0
        lastTime = currentTime
        
        // Alert if FPS drops below gaming standards
        if (fps < 30) {
          this.recordMetric('webgl-performance-warning', fps)
        }
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }

  /**
   * Resource timing monitoring
   */
  private initResourceTiming() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        // Track gaming images and assets
        if (entry.name.includes('/images/') || 
            entry.name.includes('gaming') ||
            entry.name.includes('product')) {
          
          const loadTime = entry.responseEnd - entry.startTime
          this.recordMetric('resource-load-time', loadTime, {
            resource: entry.name,
            size: entry.transferSize
          })
          
          // Alert on slow loading gaming assets
          if (loadTime > 2000) {
            this.recordMetric('slow-resource-warning', loadTime, {
              resource: entry.name
            })
          }
        }
      })
    }).observe({ entryTypes: ['resource'] })
  }

  /**
   * User interaction timing
   */
  private initUserInteractionTiming() {
    // Track gaming-specific interactions
    const gamingActions = [
      'add-to-cart',
      'pc-builder-component-select',
      'product-comparison-add',
      'wishlist-add',
      'filter-apply'
    ]

    gamingActions.forEach(action => {
      document.addEventListener(action, (event: any) => {
        const startTime = performance.now()
        
        // Use RAF to measure when the UI updates
        requestAnimationFrame(() => {
          const interactionTime = performance.now() - startTime
          this.recordMetric(`${action}-interaction-time`, interactionTime)
          
          // Alert on slow interactions
          if (interactionTime > 100) {
            this.recordMetric('slow-interaction-warning', interactionTime, {
              action
            })
          }
        })
      })
    })
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, metadata?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: (navigator as any).connection?.effectiveType
    }

    this.metrics.push(metric)

    // Cache frequently accessed metrics
    if (name.includes('gaming') || name.includes('performance')) {
      cacheManager.set(
        CACHE_CONFIG.PERFORMANCE_METRICS,
        `metric:${name}:${Date.now()}`,
        { ...metric, metadata },
        60 * 5 // 5 minutes
      )
    }

    // Log performance warnings
    if (name.includes('warning')) {
      console.warn(`Performance Warning: ${name}`, { value, metadata })
    }

    // Send to analytics (implement your analytics endpoint)
    this.sendToAnalytics(metric, metadata)
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const now = Date.now()
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 300000) // Last 5 minutes

    const summary = {
      vitals: this.vitals,
      recentMetrics: recentMetrics.length,
      averageLoadTime: this.calculateAverage(recentMetrics, 'load-time'),
      averageFPS: this.calculateAverage(recentMetrics, 'fps'),
      warnings: recentMetrics.filter(m => m.name.includes('warning')).length,
      gamingPerformanceScore: this.calculateGamingScore()
    }

    return summary
  }

  /**
   * Calculate gaming performance score
   */
  private calculateGamingScore(): number {
    let score = 100

    // Deduct points for poor Web Vitals
    if (this.vitals.LCP && this.vitals.LCP > 2500) score -= 20
    if (this.vitals.FID && this.vitals.FID > 100) score -= 15
    if (this.vitals.CLS && this.vitals.CLS > 0.1) score -= 15
    if (this.vitals.FCP && this.vitals.FCP > 1800) score -= 10

    // Deduct points for slow gaming interactions
    const slowInteractions = this.metrics.filter(m => 
      m.name.includes('interaction-time') && m.value > 100
    ).length
    score -= slowInteractions * 5

    // Deduct points for low FPS
    const lowFPSMetrics = this.metrics.filter(m => 
      m.name.includes('fps') && m.value < 30
    ).length
    score -= lowFPSMetrics * 10

    return Math.max(0, score)
  }

  /**
   * Calculate average value for metrics containing a keyword
   */
  private calculateAverage(metrics: PerformanceMetric[], keyword: string): number {
    const relevantMetrics = metrics.filter(m => m.name.includes(keyword))
    if (relevantMetrics.length === 0) return 0
    
    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0)
    return sum / relevantMetrics.length
  }

  /**
   * Send metrics to analytics service
   */
  private async sendToAnalytics(metric: PerformanceMetric, metadata?: any) {
    try {
      // Use Navigator.sendBeacon for reliability
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify({ metric, metadata })
        navigator.sendBeacon('/api/analytics/performance', data)
      } else {
        // Fallback to fetch
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metric, metadata }),
          keepalive: true
        }).catch(() => {
          // Silently fail - don't impact user experience
        })
      }
    } catch (error) {
      // Silently fail - performance monitoring shouldn't break the app
    }
  }

  /**
   * Export performance data
   */
  exportData() {
    return {
      metrics: this.metrics,
      vitals: this.vitals,
      summary: this.getPerformanceSummary(),
      timestamp: Date.now()
    }
  }
}

// Singleton performance monitor
export const performanceMonitor = new PerformanceMonitor()

/**
 * Gaming-specific performance utilities
 */
export const gamingPerformance = {
  // Preload critical gaming resources
  preloadGamingAssets: () => {
    const criticalAssets = [
      '/images/banner.png',
      '/images/logo.png'
    ]

    criticalAssets.forEach(asset => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = asset
      document.head.appendChild(link)
    })
  },

  // Optimize images for gaming content
  optimizeGamingImages: () => {
    const images = document.querySelectorAll('img[data-gaming]')
    
    images.forEach((img: any) => {
      // Add intersection observer for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const startTime = performance.now()
            
            img.onload = () => {
              const loadTime = performance.now() - startTime
              performanceMonitor.recordMetric('gaming-image-load', loadTime)
            }
            
            observer.unobserve(entry.target)
          }
        })
      })
      
      observer.observe(img)
    })
  },

  // Monitor gaming component performance
  monitorGamingComponent: (componentName: string, element: HTMLElement) => {
    const startTime = performance.now()
    
    // Monitor when component becomes interactive
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const loadTime = performance.now() - startTime
          performanceMonitor.recordMetric(`${componentName}-ready`, loadTime)
          observer.unobserve(entry.target)
        }
      })
    })
    
    observer.observe(element)
  }
}

/**
 * Initialize performance monitoring when DOM is ready
 */
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.init()
      gamingPerformance.preloadGamingAssets()
    })
  } else {
    performanceMonitor.init()
    gamingPerformance.preloadGamingAssets()
  }
}