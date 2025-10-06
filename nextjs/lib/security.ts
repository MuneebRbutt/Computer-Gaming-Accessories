/**
 * Security Utilities for Gaming Store
 * Comprehensive security hardening with input validation, CSRF protection, and rate limiting
 */

import { z } from 'zod'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Input Validation Schemas
 */
export const validationSchemas = {
  // User authentication
  email: z.string().email('Invalid email format').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  
  // Gaming profile data
  gamertag: z.string()
    .min(3, 'Gamertag must be at least 3 characters')
    .max(20, 'Gamertag too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Gamertag can only contain letters, numbers, underscore and dash'),
  
  // Product data
  productId: z.string().uuid('Invalid product ID'),
  productName: z.string()
    .min(1, 'Product name required')
    .max(200, 'Product name too long')
    .regex(/^[a-zA-Z0-9\s\-_().&]+$/, 'Invalid characters in product name'),
  
  // Search queries
  searchQuery: z.string()
    .min(1, 'Search query required')
    .max(100, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-_().&]+$/, 'Invalid characters in search'),
  
  // Gaming specifications
  gameTitle: z.string()
    .min(1, 'Game title required')
    .max(100, 'Game title too long'),
  
  // Cart and order data
  quantity: z.number().int().min(1).max(99),
  price: z.number().positive().max(99999.99),
  
  // User content
  reviewContent: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review too long'),
  rating: z.number().int().min(1).max(5),
  
  // Gaming performance metrics
  fps: z.number().int().min(1).max(1000),
  resolution: z.enum(['1080p', '1440p', '4K', '8K']),
  graphicsSettings: z.enum(['low', 'medium', 'high', 'ultra', 'competitive']),
}

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitize SQL input to prevent injection
 */
export function sanitizeSql(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/['"\\;]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .trim()
}

/**
 * Generate secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(sessionToken, 'hex')
    )
  } catch {
    return false
  }
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  // API endpoints
  API_GENERAL: { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  API_SEARCH: { requests: 50, window: 60 * 1000 },   // 50 searches per minute
  API_AUTH: { requests: 5, window: 60 * 1000 },      // 5 auth attempts per minute
  
  // Gaming-specific endpoints
  PERFORMANCE_DATA: { requests: 30, window: 60 * 1000 }, // 30 performance queries per minute
  PC_BUILDER: { requests: 20, window: 60 * 1000 },       // 20 builds per minute
  
  // User actions
  REVIEWS: { requests: 3, window: 60 * 1000 },        // 3 reviews per minute
  CART_UPDATES: { requests: 50, window: 60 * 1000 },  // 50 cart updates per minute
  
  // Security-sensitive
  PASSWORD_RESET: { requests: 3, window: 60 * 60 * 1000 }, // 3 resets per hour
  ACCOUNT_CREATION: { requests: 3, window: 60 * 60 * 1000 }, // 3 accounts per hour
} as const

/**
 * Rate limiting middleware
 */
export class RateLimiter {
  private static getClientIdentifier(req: NextRequest): string {
    // Use multiple identifiers for better tracking
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    // For authenticated users, also consider user ID
    const userId = req.headers.get('x-user-id') || 'anonymous'
    
    return `${ip}:${userId}`
  }

  static check(
    req: NextRequest,
    limit: typeof RATE_LIMITS[keyof typeof RATE_LIMITS],
    customKey?: string
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const clientId = customKey || this.getClientIdentifier(req)
    const now = Date.now()
    const windowKey = `${clientId}:${Math.floor(now / limit.window)}`
    
    const current = rateLimitStore.get(windowKey)
    
    if (!current) {
      rateLimitStore.set(windowKey, {
        count: 1,
        resetTime: now + limit.window
      })
      return {
        allowed: true,
        remaining: limit.requests - 1,
        resetTime: now + limit.window
      }
    }
    
    if (current.count >= limit.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }
    
    current.count++
    
    return {
      allowed: true,
      remaining: limit.requests - current.count,
      resetTime: current.resetTime
    }
  }

  static middleware(limit: typeof RATE_LIMITS[keyof typeof RATE_LIMITS]) {
    return (handler: Function) => {
      return async (req: NextRequest, res: NextResponse) => {
        const result = this.check(req, limit)
        
        if (!result.allowed) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded',
              message: 'Too many requests. Please try again later.',
              resetTime: result.resetTime
            },
            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': limit.requests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
                'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
              }
            }
          )
        }
        
        // Add rate limit headers
        const response = await handler(req, res)
        if (response instanceof NextResponse) {
          response.headers.set('X-RateLimit-Limit', limit.requests.toString())
          response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
          response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())
        }
        
        return response
      }
    }
  }
}

/**
 * Input validation middleware
 */
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (handler: Function) => {
    return async (req: NextRequest, res: NextResponse) => {
      try {
        let data: any
        
        if (req.method === 'GET') {
          const url = new URL(req.url)
          data = Object.fromEntries(url.searchParams.entries())
        } else {
          data = await req.json()
        }
        
        // Validate and sanitize input
        const validatedData = schema.parse(data)
        
        // Add validated data to request
        ;(req as any).validatedData = validatedData
        
        return await handler(req, res)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              details: error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  }
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection(handler: Function) {
  return async (req: NextRequest, res: NextResponse) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      return await handler(req, res)
    }
    
    const csrfToken = req.headers.get('x-csrf-token')
    const sessionToken = req.headers.get('x-session-token')
    
    if (!csrfToken || !sessionToken || !verifyCSRFToken(csrfToken, sessionToken)) {
      return NextResponse.json(
        { 
          error: 'CSRF token validation failed',
          message: 'Invalid or missing CSRF token'
        },
        { status: 403 }
      )
    }
    
    return await handler(req, res)
  }
}

/**
 * Gaming-specific security checks
 */
export const gamingSecurity = {
  // Validate gaming performance data
  validatePerformanceData: (data: any) => {
    const schema = z.object({
      gameTitle: validationSchemas.gameTitle,
      fps: validationSchemas.fps,
      resolution: validationSchemas.resolution,
      settings: validationSchemas.graphicsSettings,
      gpu: z.string().max(100),
      cpu: z.string().max(100),
      ram: z.number().int().min(4).max(256)
    })
    
    return schema.parse(data)
  },

  // Validate PC build configuration
  validateBuildConfig: (data: any) => {
    const schema = z.object({
      name: z.string().min(1).max(100),
      components: z.array(z.object({
        type: z.enum(['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case']),
        productId: validationSchemas.productId,
        quantity: validationSchemas.quantity
      })).min(1).max(20),
      budget: z.number().positive().max(50000),
      purpose: z.enum(['gaming', 'workstation', 'budget', 'enthusiast'])
    })
    
    return schema.parse(data)
  },

  // Sanitize user-generated gaming content
  sanitizeGamingContent: (content: string) => {
    // Remove potentially harmful gaming-related strings
    return sanitizeHtml(content)
      .replace(/\b(hack|cheat|exploit|mod)\b/gi, '[filtered]')
      .replace(/\b(pirate|crack|torrent)\b/gi, '[filtered]')
  },

  // Validate gaming profile data
  validateGamingProfile: (data: any) => {
    const schema = z.object({
      gamertag: validationSchemas.gamertag,
      preferredGenres: z.array(z.string()).max(10),
      platforms: z.array(z.enum(['pc', 'xbox', 'playstation', 'nintendo'])).max(5),
      skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'pro']),
      publicProfile: z.boolean()
    })
    
    return schema.parse(data)
  }
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https: wss:;
    media-src 'self' blob: data:;
    frame-src 'self' https://www.youtube.com https://player.vimeo.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}

/**
 * Create secure API response
 */
export function createSecureResponse(data: any, status = 200) {
  const response = NextResponse.json(data, { status })
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add gaming-specific security headers
  response.headers.set('X-Gaming-Store', 'secure')
  response.headers.set('X-API-Version', '1.0')
  
  return response
}

/**
 * Log security events
 */
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'csrf_failure' | 'validation_error' | 'suspicious_activity'
  clientId: string
  details: any
  timestamp?: number
}) {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || Date.now(),
    severity: event.type === 'suspicious_activity' ? 'high' : 'medium'
  }
  
  // In production, send to security monitoring service
  console.warn('Security Event:', logEntry)
  
  // Store in security audit log
  // securityAuditLog.push(logEntry)
}