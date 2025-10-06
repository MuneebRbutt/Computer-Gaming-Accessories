/**
 * SEO Optimization for Gaming Store
 * Comprehensive SEO with meta tags, structured data, and sitemap generation
 */

import { Metadata } from 'next'

/**
 * Gaming Store SEO Configuration
 */
export const SEO_CONFIG = {
  siteName: 'Gaming Elite Store',
  siteUrl: 'https://gaming-elite-store.com',
  defaultDescription: 'Ultimate destination for gaming accessories, PC components, and gaming gear. Build your dream gaming setup with premium components and accessories.',
  defaultKeywords: [
    'gaming accessories',
    'pc gaming',
    'gaming gear',
    'graphics cards',
    'gaming keyboards',
    'gaming mice',
    'pc components',
    'gaming setup',
    'esports equipment',
    'gaming peripherals'
  ],
  social: {
    twitter: '@GamingEliteStore',
    facebook: 'GamingEliteStore',
    instagram: 'gamingEliteStore',
    youtube: 'GamingEliteStore',
    discord: 'gamingEliteStore'
  },
  contact: {
    email: 'support@gaming-elite-store.com',
    phone: '+1-800-GAMING',
    address: 'Gaming Elite HQ, Tech District, Gaming City'
  }
}

/**
 * Generate optimized meta tags for different page types
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  product,
  category,
  noIndex = false
}: {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'product' | 'category' | 'article'
  product?: any
  category?: string
  noIndex?: boolean
}): Metadata {
  const fullTitle = `${title} | ${SEO_CONFIG.siteName}`
  const fullDescription = description || SEO_CONFIG.defaultDescription
  const fullUrl = url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl
  const fullImage = image ? `${SEO_CONFIG.siteUrl}${image}` : `${SEO_CONFIG.siteUrl}/images/og-default.jpg`
  const allKeywords = [...SEO_CONFIG.defaultKeywords, ...keywords]

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: SEO_CONFIG.siteName }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: SEO_CONFIG.siteName,
      images: [{
        url: fullImage,
        width: 1200,
        height: 630,
        alt: title
      }],
      locale: 'en_US',
      type: 'website'
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: SEO_CONFIG.social.twitter,
      site: SEO_CONFIG.social.twitter
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional meta tags
    other: {
      'theme-color': '#8B5CF6', // Gaming purple
      'color-scheme': 'dark light',
      'format-detection': 'telephone=no',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    }
  }

  // Add product-specific metadata
  if (type === 'product' && product) {
    const currentOther = metadata.other || {}
    const productMeta: Record<string, string> = {
      'product:brand': product.brand?.toString() || '',
      'product:category': product.category?.toString() || '',
      'product:price:amount': product.price?.toString() || '',
      'product:price:currency': 'USD',
      'product:availability': product.inStock ? 'in stock' : 'out of stock'
    }
    
    metadata.other = {
      ...currentOther,
      ...productMeta
    }
  }

  return metadata
}

/**
 * Generate structured data (JSON-LD) for different content types
 */
export function generateStructuredData(type: string, data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseSchema,
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        logo: `${SEO_CONFIG.siteUrl}/images/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: SEO_CONFIG.contact.phone,
          contactType: 'customer service',
          email: SEO_CONFIG.contact.email
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Gaming City',
          addressCountry: 'US'
        },
        sameAs: [
          `https://twitter.com/${SEO_CONFIG.social.twitter.replace('@', '')}`,
          `https://facebook.com/${SEO_CONFIG.social.facebook}`,
          `https://instagram.com/${SEO_CONFIG.social.instagram}`,
          `https://youtube.com/c/${SEO_CONFIG.social.youtube}`
        ]
      }

    case 'Product':
      return {
        ...baseSchema,
        name: data.name,
        description: data.description,
        brand: {
          '@type': 'Brand',
          name: data.brand
        },
        image: data.images?.map((img: string) => `${SEO_CONFIG.siteUrl}${img}`),
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'USD',
          availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: SEO_CONFIG.siteName
          }
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount,
          bestRating: 5,
          worstRating: 1
        } : undefined,
        category: data.category,
        sku: data.id,
        gtin: data.gtin,
        mpn: data.mpn
      }

    case 'WebSite':
      return {
        ...baseSchema,
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }

    case 'BreadcrumbList':
      return {
        ...baseSchema,
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SEO_CONFIG.siteUrl}${item.url}`
        }))
      }

    case 'Review':
      return {
        ...baseSchema,
        itemReviewed: {
          '@type': 'Product',
          name: data.productName,
          image: data.productImage
        },
        author: {
          '@type': 'Person',
          name: data.authorName
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: data.content,
        datePublished: data.date
      }

    case 'FAQPage':
      return {
        ...baseSchema,
        mainEntity: data.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }

    case 'VideoGame':
      return {
        ...baseSchema,
        name: data.name,
        description: data.description,
        genre: data.genre,
        gameSystem: data.platforms,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'USD'
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount
        } : undefined
      }

    default:
      return baseSchema
  }
}

/**
 * SEO-optimized URL generator
 */
export function generateSEOUrl(type: string, data: any): string {
  const slugify = (text: string) => 
    text.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

  switch (type) {
    case 'product':
      return `/products/${slugify(data.name)}-${data.id}`
    
    case 'category':
      return `/categories/${slugify(data.name)}`
    
    case 'brand':
      return `/brands/${slugify(data.name)}`
    
    case 'gaming-guide':
      return `/guides/${slugify(data.title)}`
    
    case 'build':
      return `/builds/${slugify(data.name)}-${data.id}`
    
    default:
      return `/${slugify(data.name || data.title)}`
  }
}

/**
 * Sitemap generator
 */
export class SitemapGenerator {
  private baseUrl: string
  private pages: Array<{
    url: string
    lastModified: Date
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }> = []

  constructor(baseUrl: string = SEO_CONFIG.siteUrl) {
    this.baseUrl = baseUrl
  }

  addPage(url: string, options: {
    lastModified?: Date
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority?: number
  } = {}) {
    this.pages.push({
      url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
      lastModified: options.lastModified || new Date(),
      changeFrequency: options.changeFrequency || 'weekly',
      priority: options.priority || 0.5
    })
  }

  addProducts(products: any[]) {
    products.forEach(product => {
      this.addPage(generateSEOUrl('product', product), {
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'daily',
        priority: 0.8
      })
    })
  }

  addCategories(categories: any[]) {
    categories.forEach(category => {
      this.addPage(generateSEOUrl('category', category), {
        changeFrequency: 'weekly',
        priority: 0.7
      })
    })
  }

  generateXML(): string {
    const urls = this.pages.map(page => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>`).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`
  }
}

/**
 * Gaming-specific SEO utilities
 */
export const gamingSEO = {
  // Generate gaming product metadata
  productMeta: (product: any) => generateMetadata({
    title: `${product.name} - ${product.brand}`,
    description: `${product.description} Perfect for gaming enthusiasts. ${product.inStock ? 'In stock' : 'Pre-order'} with fast shipping.`,
    keywords: [
      product.category,
      product.brand,
      'gaming',
      'pc gaming',
      ...product.tags || []
    ],
    image: product.images?.[0],
    type: 'product',
    product
  }),

  // Generate category page metadata
  categoryMeta: (category: any) => generateMetadata({
    title: `${category.name} - Gaming Accessories`,
    description: `Discover the best ${category.name.toLowerCase()} for gaming. Premium quality gaming gear with competitive prices and fast shipping.`,
    keywords: [
      category.name,
      'gaming',
      'gaming accessories',
      'pc gaming',
      'esports'
    ],
    type: 'category',
    category: category.name
  }),

  // Generate gaming guide metadata
  guideMeta: (guide: any) => generateMetadata({
    title: guide.title,
    description: guide.description,
    keywords: [
      'gaming guide',
      'pc building',
      'gaming setup',
      ...guide.tags || []
    ],
    type: 'article'
  }),

  // Generate structured data for gaming products
  gameProductSchema: (product: any) => generateStructuredData('Product', {
    ...product,
    category: `Gaming > ${product.category}`,
    additionalProperty: product.specs?.map((spec: any) => ({
      '@type': 'PropertyValue',
      name: spec.name,
      value: spec.value
    }))
  }),

  // Gaming performance schema
  performanceSchema: (data: any) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.gameName,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Windows',
    requirements: data.systemRequirements,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'USD'
    }
  })
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Gaming-specific crawling
Allow: /products/
Allow: /categories/
Allow: /brands/
Allow: /guides/
Allow: /builds/

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /account/
Disallow: /cart/
Disallow: /checkout/

# Disallow search results to prevent duplicate content
Disallow: /search?*
Disallow: /*?sort=*
Disallow: /*?filter=*

# Allow images
Allow: /images/
Allow: /_next/static/

Sitemap: ${SEO_CONFIG.siteUrl}/sitemap.xml
`
}

/**
 * Meta tag configuration helper
 */
export function getSEOConfig(options: {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  structuredData?: any
  canonical?: string
}) {
  const metadata = generateMetadata({
    title: options.title,
    description: options.description,
    keywords: options.keywords || [],
    image: options.image,
    url: options.canonical
  })

  return {
    metadata,
    structuredDataScript: options.structuredData ? JSON.stringify(options.structuredData) : null,
    canonicalUrl: options.canonical ? `${SEO_CONFIG.siteUrl}${options.canonical}` : null,
    preconnectUrls: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://ik.imagekit.io'
    ],
    dnsPrefetchUrls: [
      '//www.google-analytics.com',
      '//googletagmanager.com'
    ]
  }
}