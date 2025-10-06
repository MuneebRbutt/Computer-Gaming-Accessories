/**
 * High-Performance In-Memory Cache Implementation for Gaming Store API
 * Provides optimized caching with gaming-specific features and Redis-ready architecture
 */

interface CacheItem {
  data: any
  timestamp: number
  ttl: number
  tags: string[]
  hits: number
}

interface CacheStats {
  totalKeys: number
  memoryUsage: string
  hitRate: number
  tags: string[]
  hits: number
  misses: number
}

// In-memory cache store
const cacheStore = new Map<string, CacheItem>()
const tagStore = new Map<string, Set<string>>()
let cacheStats: CacheStats = {
  totalKeys: 0,
  memoryUsage: '0MB',
  hitRate: 0,
  tags: [],
  hits: 0,
  misses: 0
}

/**
 * Cache configuration for different data types
 */
export const CACHE_CONFIG = {
  // Product data caching
  PRODUCTS: {
    key: 'products',
    ttl: 60 * 15, // 15 minutes
    tags: ['products', 'catalog']
  },
  PRODUCT_DETAILS: {
    key: 'product-details',
    ttl: 60 * 30, // 30 minutes
    tags: ['products', 'details']
  },
  
  // Gaming performance data
  PERFORMANCE_METRICS: {
    key: 'performance-metrics',
    ttl: 60 * 60 * 2, // 2 hours
    tags: ['performance', 'gaming']
  },
  
  // User preferences and wishlists
  USER_DATA: {
    key: 'user-data',
    ttl: 60 * 10, // 10 minutes
    tags: ['user', 'preferences']
  },
  
  // Shopping cart data
  CART_DATA: {
    key: 'cart',
    ttl: 60 * 60 * 24, // 24 hours
    tags: ['cart', 'user']
  },
  
  // Search results
  SEARCH_RESULTS: {
    key: 'search',
    ttl: 60 * 5, // 5 minutes
    tags: ['search', 'catalog']
  },
  
  // Gaming builds and configurations
  PC_BUILDS: {
    key: 'pc-builds',
    ttl: 60 * 60, // 1 hour
    tags: ['builds', 'gaming']
  },
  
  // API responses
  API_RESPONSES: {
    key: 'api',
    ttl: 60 * 2, // 2 minutes
    tags: ['api', 'responses']
  }
} as const

/**
 * High-performance cache manager with gaming optimizations
 */
export class CacheManager {
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start background cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Set cache with automatic key generation and TTL
   */
  async set(
    config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
    identifier: string,
    data: any,
    customTTL?: number
  ): Promise<void> {
    try {
      const key = `${config.key}:${identifier}`
      const ttl = customTTL || config.ttl
      const timestamp = Date.now()
      
      const cacheItem: CacheItem = {
        data,
        timestamp,
        ttl: ttl * 1000, // Convert to milliseconds
        tags: [...config.tags], // Convert readonly array to mutable
        hits: 0
      }

      cacheStore.set(key, cacheItem)
      
      // Add to tag sets for cache invalidation
      for (const tag of config.tags) {
        if (!tagStore.has(tag)) {
          tagStore.set(tag, new Set())
        }
        tagStore.get(tag)!.add(key)
      }

      cacheStats.totalKeys = cacheStore.size
      this.updateMemoryUsage()
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Get cached data with freshness check
   */
  async get<T = any>(
    config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
    identifier: string
  ): Promise<T | null> {
    try {
      const key = `${config.key}:${identifier}`
      const cached = cacheStore.get(key)
      
      if (!cached) {
        cacheStats.misses++
        return null
      }

      const age = Date.now() - cached.timestamp
      
      // Check if expired
      if (age > cached.ttl) {
        cacheStore.delete(key)
        this.removeFromTags(key, cached.tags)
        cacheStats.misses++
        return null
      }

      // Gaming-specific freshness logic
      if (config.key === 'performance-metrics' && age > 60000) {
        // Performance data should be fresh within 1 minute for competitive gaming
        cacheStats.misses++
        return null
      }

      // Update hit count and stats
      cached.hits++
      cacheStats.hits++
      this.updateHitRate()

      return cached.data as T
    } catch (error) {
      console.error('Cache get error:', error)
      cacheStats.misses++
      return null
    }
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTag(tag: string): Promise<void> {
    try {
      const keys = tagStore.get(tag)
      
      if (keys) {
        Array.from(keys).forEach(key => {
          cacheStore.delete(key)
        })
        tagStore.delete(tag)
        cacheStats.totalKeys = cacheStore.size
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  /**
   * Cache with automatic refresh for gaming data
   */
  async getOrFetch<T>(
    config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
    identifier: string,
    fetchFunction: () => Promise<T>,
    options: { 
      refreshThreshold?: number
      backgroundRefresh?: boolean 
    } = {}
  ): Promise<T> {
    const cached = await this.get<T>(config, identifier)
    
    if (cached) {
      // Background refresh for gaming performance
      if (options.backgroundRefresh) {
        this.backgroundRefresh(config, identifier, fetchFunction)
      }
      return cached
    }

    // Fetch and cache
    const data = await fetchFunction()
    await this.set(config, identifier, data)
    return data
  }

  /**
   * Background refresh for seamless gaming experience
   */
  private async backgroundRefresh<T>(
    config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
    identifier: string,
    fetchFunction: () => Promise<T>
  ): Promise<void> {
    try {
      const data = await fetchFunction()
      await this.set(config, identifier, data)
    } catch (error) {
      console.error('Background refresh error:', error)
    }
  }

  /**
   * Multi-get for batch operations
   */
  async mget<T>(
    config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
    identifiers: string[]
  ): Promise<(T | null)[]> {
    const results: (T | null)[] = []
    
    for (const identifier of identifiers) {
      const result = await this.get<T>(config, identifier)
      results.push(result)
    }
    
    return results
  }

  /**
   * Gaming-specific cache warming
   */
  async warmGamingCache(): Promise<void> {
    try {
      // Warm popular gaming categories
      const popularCategories = ['graphics-cards', 'processors', 'gaming-mice', 'keyboards']
      
      for (const category of popularCategories) {
        await this.set(
          CACHE_CONFIG.PRODUCTS,
          `category:${category}`,
          { warmed: true, category, timestamp: Date.now() },
          60 * 30 // 30 minutes
        )
      }

      // Warm performance benchmarks
      await this.set(
        CACHE_CONFIG.PERFORMANCE_METRICS,
        'popular-games',
        { 
          warmed: true, 
          games: ['cyberpunk', 'valorant', 'apex'],
          benchmarks: {
            cyberpunk: { fps: 60, settings: 'ultra' },
            valorant: { fps: 300, settings: 'competitive' },
            apex: { fps: 144, settings: 'high' }
          }
        },
        60 * 60 * 4 // 4 hours
      )
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    this.updateMemoryUsage()
    this.updateHitRate()
    
    return {
      ...cacheStats,
      tags: Array.from(tagStore.keys())
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    Array.from(cacheStore.entries()).forEach(([key, item]) => {
      if (now - item.timestamp > item.ttl) {
        cacheStore.delete(key)
        this.removeFromTags(key, item.tags)
        cleaned++
      }
    })

    if (cleaned > 0) {
      cacheStats.totalKeys = cacheStore.size
      console.log(`Cache cleanup: removed ${cleaned} expired entries`)
    }
  }

  /**
   * Remove key from tag sets
   */
  private removeFromTags(key: string, tags: string[]): void {
    for (const tag of tags) {
      const tagSet = tagStore.get(tag)
      if (tagSet) {
        tagSet.delete(key)
        if (tagSet.size === 0) {
          tagStore.delete(tag)
        }
      }
    }
  }

  /**
   * Update memory usage estimation
   */
  private updateMemoryUsage(): void {
    const approximateSize = cacheStore.size * 1024 // Rough estimate
    cacheStats.memoryUsage = `${(approximateSize / 1024 / 1024).toFixed(2)}MB`
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = cacheStats.hits + cacheStats.misses
    cacheStats.hitRate = total > 0 ? cacheStats.hits / total : 0
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    cacheStore.clear()
    tagStore.clear()
    cacheStats = {
      totalKeys: 0,
      memoryUsage: '0MB',
      hitRate: 0,
      tags: [],
      hits: 0,
      misses: 0
    }
  }

  /**
   * Destroy cache manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}

// Singleton cache manager
export const cacheManager = new CacheManager()

/**
 * Middleware for automatic API response caching
 */
export function withCache(
  config: typeof CACHE_CONFIG[keyof typeof CACHE_CONFIG],
  keyGenerator: (req: any) => string
) {
  return function cacheMiddleware(handler: Function) {
    return async function cachedHandler(req: any, res: any) {
      const cacheKey = keyGenerator(req)
      
      // Try to get from cache
      const cached = await cacheManager.get(config, cacheKey)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Key', cacheKey)
        return res.status(200).json(cached)
      }

      // Execute original handler
      const originalJson = res.json
      let responseData: any

      res.json = function(data: any) {
        responseData = data
        return originalJson.call(this, data)
      }

      await handler(req, res)

      // Cache the response if successful
      if (res.statusCode === 200 && responseData) {
        await cacheManager.set(config, cacheKey, responseData)
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Cache-Key', cacheKey)
      }
    }
  }
}

/**
 * Gaming-specific cache utilities
 */
export const gamingCache = {
  // Cache game performance data
  cachePerformance: async (gameId: string, specs: any, performance: any) => {
    await cacheManager.set(
      CACHE_CONFIG.PERFORMANCE_METRICS,
      `${gameId}:${JSON.stringify(specs)}`,
      performance,
      60 * 60 * 12 // 12 hours for performance data
    )
  },

  // Get cached performance data
  getPerformance: async (gameId: string, specs: any) => {
    return await cacheManager.get(
      CACHE_CONFIG.PERFORMANCE_METRICS,
      `${gameId}:${JSON.stringify(specs)}`
    )
  },

  // Cache user's gaming profile
  cacheGamingProfile: async (userId: string, profile: any) => {
    await cacheManager.set(
      CACHE_CONFIG.USER_DATA,
      `profile:${userId}`,
      profile,
      60 * 30 // 30 minutes
    )
  },

  // Preload popular gaming content
  preloadPopularContent: async () => {
    await cacheManager.warmGamingCache()
  }
}