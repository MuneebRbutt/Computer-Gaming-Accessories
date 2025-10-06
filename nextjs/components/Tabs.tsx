"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline' | 'gaming'
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  className?: string
  onChange?: (key: string) => void
}

export default function Tabs({ 
  items, 
  defaultTab,
  variant = 'gaming',
  size = 'md',
  orientation = 'horizontal',
  className,
  onChange
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.key)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement>>({})

  useEffect(() => {
    updateIndicator()
  }, [activeTab])

  const updateIndicator = () => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement && tabsRef.current) {
      const tabsRect = tabsRef.current.getBoundingClientRect()
      const activeRect = activeTabElement.getBoundingClientRect()
      
      setIndicatorStyle({
        left: activeRect.left - tabsRect.left,
        width: activeRect.width
      })
    }
  }

  const handleTabChange = (key: string) => {
    if (items.find(item => item.key === key)?.disabled) return
    
    setActiveTab(key)
    onChange?.(key)
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const getTabClasses = (item: TabItem, isActive: boolean) => {
    const baseClasses = cn(
      'relative transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg',
      sizeClasses[size],
      {
        'cursor-not-allowed opacity-50': item.disabled,
        'cursor-pointer': !item.disabled
      }
    )

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          isActive
            ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
        )
      
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 rounded-none',
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-primary/30'
        )
      
      case 'gaming':
        return cn(
          baseClasses,
          isActive
            ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
        )
      
      default:
        return cn(
          baseClasses,
          isActive
            ? 'bg-card text-text-primary border border-primary/20'
            : 'text-text-muted hover:text-text-primary hover:bg-card/50 border border-transparent'
        )
    }
  }

  const activeItem = items.find(item => item.key === activeTab)

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div
        ref={tabsRef}
        className={cn(
          'relative flex gap-1 p-1 rounded-xl',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          variant === 'gaming' 
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-white border border-gray-200'
        )}
      >
        {/* Animated Indicator */}
        {variant === 'gaming' && orientation === 'horizontal' && (
          <motion.div
            className="absolute bottom-0 h-0.5 bg-primary rounded-full"
            initial={false}
            animate={{
              x: indicatorStyle.left,
              width: indicatorStyle.width
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}

        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.key

          return (
            <motion.button
              key={item.key}
              ref={(el) => {
                if (el) tabRefs.current[item.key] = el
              }}
              onClick={() => handleTabChange(item.key)}
              className={getTabClasses(item, isActive)}
              whileHover={!item.disabled ? { scale: 1.02 } : undefined}
              whileTap={!item.disabled ? { scale: 0.98 } : undefined}
              layout
            >
              <div className="flex items-center gap-2 relative">
                {Icon && (
                  <Icon className={cn(
                    'transition-all duration-300',
                    size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6',
                    isActive ? 'scale-110' : 'scale-100'
                  )} />
                )}
                
                <span className="relative">
                  {item.label}
                </span>
                
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center shadow-sm'
                    )}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="w-full"
            >
              {activeItem.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Preset tab configurations for common use cases
export const createProductTabs = (product: any, reviews?: React.ReactNode, specs?: React.ReactNode) => [
  {
    key: 'overview',
    label: 'Overview',
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-text-muted leading-relaxed">
          {product.description || 'No description available for this product.'}
        </p>
      </div>
    )
  },
  {
    key: 'specs',
    label: 'Specifications',
    content: specs || (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.specs ? Object.entries(product.specs).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2 border-b border-primary/10">
            <span className="text-text-muted">{key}</span>
            <span className="text-text-primary font-medium">{value as string}</span>
          </div>
        )) : (
          <p className="text-text-muted">No specifications available.</p>
        )}
      </div>
    )
  },
  {
    key: 'reviews',
    label: 'Reviews',
    badge: product.reviewCount || 0,
    content: reviews || <div className="text-text-muted">No reviews yet.</div>
  },
  {
    key: 'compatibility',
    label: 'Compatibility',
    content: (
      <div className="text-text-muted">
        <p>Compatibility information will be displayed here.</p>
      </div>
    )
  }
]


