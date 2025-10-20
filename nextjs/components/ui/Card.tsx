'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gaming' | 'elevated' | 'outlined' | 'glass'
  hover?: boolean
  interactive?: boolean
  onClick?: () => void
}

const cardVariants = {
  default: 'bg-white dark:bg-gaming-darker border border-gray-200 dark:border-gray-700',
  gaming: 'bg-gradient-to-br from-gaming-darker to-gaming-dark border border-gaming-primary/30',
  elevated: 'bg-white dark:bg-gaming-darker shadow-lg border border-gray-200 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  glass: 'bg-white/10 dark:bg-gaming-darker/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50'
}

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  hover = false, 
  interactive = false,
  onClick 
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 hover:-translate-y-1' : ''
  const interactiveClasses = interactive ? 'cursor-pointer active:scale-95' : ''

  return (
    <motion.div
      className={cn(
        baseClasses,
        cardVariants[variant],
        hoverClasses,
        interactiveClasses,
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Gaming glow effect */}
      {variant === 'gaming' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gaming-primary/5 to-gaming-accent/5 animate-pulse" />
      )}
      
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}

// Specialized Card Components
interface ProductCardProps {
  title: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  badgeVariant?: 'sale' | 'new' | 'featured' | 'limited'
  onClick?: () => void
  className?: string
}

export function ProductCard({ 
  title, 
  price, 
  originalPrice, 
  image, 
  badge, 
  badgeVariant = 'sale',
  onClick,
  className 
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Card 
      variant="default" 
      hover={true} 
      interactive={true} 
      onClick={onClick}
      className={cn('overflow-hidden group', className)}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2">
            <span className={cn(
              'px-2 py-1 text-xs font-semibold rounded-full text-white',
              badgeVariant === 'sale' && 'bg-red-500',
              badgeVariant === 'new' && 'bg-green-500',
              badgeVariant === 'featured' && 'bg-purple-500',
              badgeVariant === 'limited' && 'bg-orange-500'
            )}>
              {badge}
            </span>
          </div>
        )}
        
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Quick View
          </button>
          <button className="bg-gaming-primary text-white px-4 py-2 rounded-md hover:bg-gaming-primary/90 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
      
      <CardContent>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gaming-primary">
            ${price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-sm text-green-600 font-semibold">
              -{discount}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface GamingCardProps {
  title: string
  description: string
  image: string
  stats?: Record<string, string>
  onClick?: () => void
  className?: string
}

export function GamingCard({ 
  title, 
  description, 
  image, 
  stats, 
  onClick,
  className 
}: GamingCardProps) {
  return (
    <Card 
      variant="gaming" 
      hover={true} 
      interactive={true} 
      onClick={onClick}
      className={cn('overflow-hidden', className)}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover"
        />
        
        {/* Gaming overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark/80 to-transparent" />
        
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-gaming-accent font-bold text-sm">
            {title}
          </h3>
        </div>
      </div>
      
      <CardContent>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        {stats && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span className="text-gaming-accent font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  variant?: 'default' | 'gaming'
  className?: string
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  variant = 'default',
  className 
}: FeatureCardProps) {
  return (
    <Card 
      variant={variant} 
      hover={true}
      className={cn('text-center', className)}
    >
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className={cn(
            'p-3 rounded-full',
            variant === 'gaming' 
              ? 'bg-gaming-primary/20 text-gaming-accent' 
              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          )}>
            {icon}
          </div>
        </div>
        
        <h3 className={cn(
          'font-semibold mb-2',
          variant === 'gaming' ? 'text-gaming-accent' : 'text-gray-900 dark:text-gray-100'
        )}>
          {title}
        </h3>
        
        <p className={cn(
          'text-sm',
          variant === 'gaming' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: ReactNode
  variant?: 'default' | 'gaming' | 'success' | 'warning' | 'error'
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon,
  variant = 'default',
  className 
}: StatsCardProps) {
  const variantStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    gaming: 'text-gaming-accent',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  return (
    <Card 
      variant="elevated" 
      hover={true}
      className={cn('relative overflow-hidden', className)}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className={cn('text-2xl font-bold', variantStyles[variant])}>
              {value}
            </p>
            {change && (
              <p className={cn(
                'text-xs mt-1',
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              )}>
                {change.type === 'increase' ? '↗' : '↘'} {Math.abs(change.value)}%
              </p>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              'p-2 rounded-lg',
              variant === 'gaming' && 'bg-gaming-primary/20 text-gaming-accent',
              variant === 'success' && 'bg-green-100 text-green-600',
              variant === 'warning' && 'bg-yellow-100 text-yellow-600',
              variant === 'error' && 'bg-red-100 text-red-600',
              variant === 'default' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
