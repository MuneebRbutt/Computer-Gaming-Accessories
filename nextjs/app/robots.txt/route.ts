/**
 * Robots.txt Generation API
 * Automatically generates robots.txt for SEO optimization
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRobotsTxt } from '@/lib/seo'

export async function GET(request: NextRequest) {
  try {
    const robotsTxt = generateRobotsTxt()
    
    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    })
  } catch (error) {
    console.error('Robots.txt generation error:', error)
    return new NextResponse('Error generating robots.txt', { status: 500 })
  }
}