/**
 * Configuration constants for the application
 */

export const APP_CONFIG = {
  name: 'Advance IT Traders',
  description: 'Pakistan\'s premier gaming accessories and computer hardware store',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  tagline: 'Gaming & Tech Hub',
  
  // Contact Information
  contact: {
    phone: '+92 322-4264260',
    email: 'advanceittraders@gmail.com',
    address: 'Karachi, Pakistan',
    owner: 'Syed Khuram Shah'
  },
  
  // Social Media
  social: {
    facebook: 'https://facebook.com/advanceittraders',
    instagram: 'https://instagram.com/advanceittraders',
    twitter: 'https://twitter.com/advanceittraders',
    youtube: 'https://youtube.com/@advanceittraders'
  },
  
  // Business Settings
  business: {
    currency: 'PKR',
    locale: 'en-PK',
    timezone: 'Asia/Karachi',
    freeShippingThreshold: 50000, // Rs 50,000
    maxCartItems: 10,
    defaultProductImage: '/images/placeholder-product.jpg'
  },
  
  // SEO & Meta
  seo: {
    keywords: [
      'gaming accessories pakistan',
      'computer hardware karachi',
      'gaming pc pakistan',
      'mechanical keyboards',
      'gaming mice',
      'gaming headsets',
      'graphics cards',
      'processors',
      'gaming laptops'
    ],
    openGraph: {
      type: 'website',
      siteName: 'Advance IT Traders',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Advance IT Traders - Gaming Accessories Store'
        }
      ]
    }
  },
  
  // Performance
  cache: {
    products: 300, // 5 minutes
    categories: 3600, // 1 hour
    static: 86400 // 24 hours
  }
} as const

export const ROUTES = {
  home: '/',
  products: '/products',
  categories: '/categories',
  pcBuilder: '/pc-builder',
  cart: '/cart',
  checkout: '/checkout',
  account: '/account',
  login: '/login',
  signup: '/signup',
  about: '/about',
  contact: '/contact',
  deals: '/deals',
  support: '/support'
} as const

export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/categories',
  cart: '/api/cart',
  orders: '/api/orders',
  auth: '/api/auth',
  search: '/api/search',
  newsletter: '/api/newsletter'
} as const