import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { APP_CONFIG } from './config'

/**
 * Utility function to merge class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with Pakistani Rupee formatting
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string
    notation?: Intl.NumberFormatOptions['notation']
    locale?: string
  } = {}
) {
  const { currency = 'PKR', notation = 'standard', locale = 'en-PK' } = options

  if (currency === 'PKR') {
    return `Rs ${price.toLocaleString('en-PK')}`
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, length + 2)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert string to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}

/**
 * Validate Pakistani phone number
 */
export function isValidPakistaniPhone(phone: string): boolean {
  const phoneRegex = /^\+92[0-9]{10}$/
  return phoneRegex.test(phone)
}

/**
 * Format Pakistani phone number
 */
export function formatPakistaniPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Handle different input formats
  if (digits.startsWith('92') && digits.length === 12) {
    return `+${digits}`
  }
  
  if (digits.startsWith('0') && digits.length === 11) {
    return `+92${digits.substring(1)}`
  }
  
  if (digits.length === 10) {
    return `+92${digits}`
  }
  
  return phone // Return original if can't format
}

/**
 * Calculate shipping cost based on order total
 */
export function calculateShipping(orderTotal: number): number {
  if (orderTotal >= APP_CONFIG.business.freeShippingThreshold) {
    return 0 // Free shipping
  }
  
  // Base shipping rates
  if (orderTotal < 10000) return 300 // Rs 300
  if (orderTotal < 25000) return 200 // Rs 200
  return 150 // Rs 150
}

/**
 * Calculate estimated delivery date
 */
export function getEstimatedDelivery(city: string = 'Karachi'): { min: Date; max: Date } {
  const now = new Date()
  
  // Major cities get faster delivery
  const majorCities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'faisalabad']
  const isMajorCity = majorCities.includes(city.toLowerCase())
  
  const minDays = isMajorCity ? 1 : 3
  const maxDays = isMajorCity ? 3 : 7
  
  const minDate = new Date(now)
  minDate.setDate(now.getDate() + minDays)
  
  const maxDate = new Date(now)
  maxDate.setDate(now.getDate() + maxDays)
  
  return { min: minDate, max: maxDate }
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-PK', defaultOptions).format(date)
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Generate SEO-friendly meta description
 */
export function generateMetaDescription(
  title: string,
  description?: string,
  maxLength: number = 160
): string {
  const baseDescription = description || `Buy ${title} at best price in Pakistan. ${APP_CONFIG.description}`
  return truncate(baseDescription, maxLength)
}

/**
 * Generate structured data for products
 */
export function generateProductStructuredData(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || generateMetaDescription(product.title),
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "PKR",
      "availability": product.availability === 'In Stock' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": APP_CONFIG.name
      }
    },
    "category": product.category,
    "sku": product.id
  }
}