'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delay?: number
  variant?: 'default' | 'gaming' | 'dark' | 'light'
  disabled?: boolean
  className?: string
}

const sideClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
}

const alignClasses = {
  start: 'left-0',
  center: 'left-1/2 transform -translate-x-1/2',
  end: 'right-0'
}

const variantStyles = {
  default: {
    bg: 'bg-gray-900 dark:bg-gray-100',
    text: 'text-white dark:text-gray-900',
    border: 'border-gray-700 dark:border-gray-300'
  },
  gaming: {
    bg: 'bg-gradient-to-r from-gaming-primary to-gaming-accent',
    text: 'text-white',
    border: 'border-gaming-primary/30'
  },
  dark: {
    bg: 'bg-black',
    text: 'text-white',
    border: 'border-gray-800'
  },
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200'
  }
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delay = 300,
  variant = 'default',
  disabled = false,
  className
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const styles = variantStyles[variant]

  const showTooltip = () => {
    if (disabled) return
    
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hideTooltip()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg border max-w-xs',
              sideClasses[side],
              alignClasses[align],
              styles.bg,
              styles.text,
              styles.border,
              className
            )}
            role="tooltip"
          >
            {/* Gaming glow effect */}
            {variant === 'gaming' && (
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gaming-primary/20 to-gaming-accent/20 animate-pulse" />
            )}
            
            <div className="relative">
              {content}
            </div>
            
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45',
                styles.bg,
                side === 'top' && 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
                side === 'bottom' && 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
                side === 'left' && 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
                side === 'right' && 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Specialized Tooltip Components
interface GamingTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function GamingTooltip({ children, content, side = 'top', delay = 200 }: GamingTooltipProps) {
  return (
    <Tooltip
      content={content}
      side={side}
      delay={delay}
      variant="gaming"
    >
      {children}
    </Tooltip>
  )
}

interface InfoTooltipProps {
  children: React.ReactNode
  info: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ children, info, side = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip
      content={info}
      side={side}
      variant="default"
    >
      {children}
    </Tooltip>
  )
}

interface SpecTooltipProps {
  children: React.ReactNode
  specs: Record<string, string>
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function SpecTooltip({ children, specs, side = 'top' }: SpecTooltipProps) {
  return (
    <GamingTooltip
      content={
        <div className="space-y-1">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-2 text-xs">
              <span className="opacity-80">{key}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      }
      side={side}
    >
      {children}
    </GamingTooltip>
  )
}

interface PriceTooltipProps {
  children: React.ReactNode
  originalPrice?: number
  discount?: number
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function PriceTooltip({ 
  children, 
  originalPrice, 
  discount, 
  side = 'top' 
}: PriceTooltipProps) {
  if (!originalPrice || !discount) return <>{children}</>

  return (
    <Tooltip
      content={
        <div className="text-center">
          <div className="text-xs opacity-80">Original Price</div>
          <div className="font-semibold">${originalPrice.toLocaleString()}</div>
          <div className="text-xs text-green-400">Save ${discount.toLocaleString()}</div>
        </div>
      }
      side={side}
      variant="gaming"
    >
      {children}
    </Tooltip>
  )
}

// Tooltip Provider for global tooltip management
interface TooltipProviderProps {
  children: React.ReactNode
  delay?: number
  skipDelayDuration?: number
}

export function TooltipProvider({ 
  children, 
  delay = 300, 
  skipDelayDuration = 300 
}: TooltipProviderProps) {
  return (
    <div className="tooltip-provider">
      {children}
    </div>
  )
}
