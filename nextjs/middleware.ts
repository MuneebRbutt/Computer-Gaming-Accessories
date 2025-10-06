import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Security and performance imports (simplified for compatibility)
interface RateLimitConfig {
  requests: number;
  window: number;
}

const RATE_LIMITS = {
  API_GENERAL: { requests: 100, window: 60 * 1000 },
  API_AUTH: { requests: 5, window: 60 * 1000 },
  API_SEARCH: { requests: 50, window: 60 * 1000 },
} as const;

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// List of paths that require authentication
const protectedPaths = ['/account', '/checkout', '/orders'];
const authPaths = ['/login', '/signup'];

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function checkRateLimit(
  request: NextRequest,
  limit: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientId = getClientId(request);
  const now = Date.now();
  const windowKey = `${clientId}:${Math.floor(now / limit.window)}`;
  
  const current = rateLimitStore.get(windowKey);
  
  if (!current) {
    rateLimitStore.set(windowKey, {
      count: 1,
      resetTime: now + limit.window
    });
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.window
    };
  }
  
  if (current.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  current.count++;
  
  return {
    allowed: true,
    remaining: limit.requests - current.count,
    resetTime: current.resetTime
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Enhanced Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // Gaming Store specific headers
  response.headers.set('X-Gaming-Store', 'v1.0');
  response.headers.delete('X-Powered-By'); // Remove for security
  
  // API Rate Limiting
  if (pathname.startsWith('/api/')) {
    let rateLimit: RateLimitConfig = RATE_LIMITS.API_GENERAL;
    
    if (pathname.includes('/auth/')) {
      rateLimit = RATE_LIMITS.API_AUTH;
    } else if (pathname.includes('/search')) {
      rateLimit = RATE_LIMITS.API_SEARCH;
    }
    
    const rateLimitResult = checkRateLimit(request, rateLimit);
    
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimit.requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimit.requests.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());
  }
  
  // Authentication Logic
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  const token = await getToken({ req: request });
  
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/account', request.url));
  }
  
  // Performance Optimizations
  if (pathname.includes('/products/') || pathname.includes('/categories/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  }
  
  // SEO Optimizations
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const canonicalUrl = `${request.nextUrl.origin}${pathname}`;
    response.headers.set('X-Canonical-URL', canonicalUrl);
  }
  
  // Gaming performance hints
  if (pathname.includes('/gaming') || pathname.includes('/performance')) {
    response.headers.set('X-Gaming-Optimization', 'enabled');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};