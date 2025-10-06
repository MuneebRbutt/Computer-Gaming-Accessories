/**
 * Sitemap Generation API
 * Automatically generates sitemap.xml for SEO optimization
 */

import { NextRequest, NextResponse } from 'next/server'
import { SitemapGenerator, SEO_CONFIG } from '@/lib/seo'

export async function GET(request: NextRequest) {
  try {
    const sitemap = new SitemapGenerator(SEO_CONFIG.siteUrl)
    
    // Add static pages
    sitemap.addPage('/', {
      changeFrequency: 'daily',
      priority: 1.0
    })
    
    sitemap.addPage('/about', {
      changeFrequency: 'monthly',
      priority: 0.6
    })
    
    sitemap.addPage('/contact', {
      changeFrequency: 'monthly',
      priority: 0.5
    })
    
    sitemap.addPage('/shop', {
      changeFrequency: 'daily',
      priority: 0.9
    })
    
    sitemap.addPage('/deals', {
      changeFrequency: 'daily',
      priority: 0.8
    })
    
    sitemap.addPage('/pc-builder', {
      changeFrequency: 'weekly',
      priority: 0.8
    })
    
    // Add gaming categories
    const categories = [
      { name: 'Graphics Cards', slug: 'graphics-cards' },
      { name: 'Processors', slug: 'processors' },
      { name: 'Gaming Mice', slug: 'gaming-mice' },
      { name: 'Gaming Keyboards', slug: 'gaming-keyboards' },
      { name: 'Gaming Headsets', slug: 'gaming-headsets' },
      { name: 'Monitors', slug: 'monitors' },
      { name: 'Memory', slug: 'memory' },
      { name: 'Storage', slug: 'storage' },
      { name: 'Motherboards', slug: 'motherboards' },
      { name: 'Power Supplies', slug: 'power-supplies' }
    ]
    
    categories.forEach(category => {
      sitemap.addPage(`/categories/${category.slug}`, {
        changeFrequency: 'weekly',
        priority: 0.7
      })
    })
    
    // Add gaming brands
    const brands = [
      'NVIDIA', 'AMD', 'Intel', 'ASUS', 'MSI', 'Gigabyte',
      'Corsair', 'Razer', 'Logitech', 'SteelSeries'
    ]
    
    brands.forEach(brand => {
      sitemap.addPage(`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`, {
        changeFrequency: 'weekly',
        priority: 0.6
      })
    })
    
    // Add products (mock data for demonstration)
    const mockProducts = Array.from({ length: 100 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Gaming Product ${i + 1}`,
      category: categories[i % categories.length].slug,
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
    
    mockProducts.forEach(product => {
      sitemap.addPage(`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.id}`, {
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    })
    
    // Add gaming guides and articles
    const guides = [
      'ultimate-gaming-pc-build-guide',
      'how-to-choose-graphics-card',
      'gaming-monitor-buying-guide',
      'mechanical-keyboard-guide',
      'gaming-mouse-sensitivity-guide',
      'pc-cooling-solutions-guide',
      'streaming-setup-guide',
      'esports-equipment-guide'
    ]
    
    guides.forEach(guide => {
      sitemap.addPage(`/guides/${guide}`, {
        changeFrequency: 'monthly',
        priority: 0.6
      })
    })
    
    // Generate XML
    const xml = sitemap.generateXML()
    
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}