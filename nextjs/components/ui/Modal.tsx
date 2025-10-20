'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, CheckCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  variant?: 'default' | 'gaming' | 'warning' | 'success' | 'error'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-gaming-darker',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-900 dark:text-gray-100'
  },
  gaming: {
    bg: 'bg-gradient-to-br from-gaming-darker to-gaming-dark',
    border: 'border-gaming-primary/30',
    text: 'text-gaming-accent'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200'
  }
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const styles = variantStyles[variant]

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEscape, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full rounded-lg shadow-xl border',
              sizeClasses[size],
              styles.bg,
              styles.border,
              className
            )}
          >
            {/* Gaming glow effect */}
            {variant === 'gaming' && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gaming-primary/5 to-gaming-accent/5 animate-pulse" />
            )}
            
            <div className="relative">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {variant === 'gaming' && <Zap className="h-5 w-5 text-gaming-accent" />}
                    {variant === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                    {variant === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {variant === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    {title && (
                      <h2 className={cn('text-lg font-semibold', styles.text)}>
                        {title}
                      </h2>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                        styles.text
                      )}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Description */}
              {description && (
                <div className="px-6 pt-4">
                  <p className={cn('text-sm', styles.text, 'opacity-80')}>
                    {description}
                  </p>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Specialized Modal Components
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'error' | 'success'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      variant={variant}
    >
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50',
            variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700',
            variant === 'error' && 'bg-red-600 hover:bg-red-700',
            variant === 'success' && 'bg-green-600 hover:bg-green-700'
          )}
        >
          {isLoading ? 'Loading...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    title: string
    price: number
    image: string
    description?: string
    specs?: Record<string, string>
  }
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick View"
      size="lg"
      variant="gaming"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gaming-accent">
            {product.title}
          </h3>
          
          <div className="text-2xl font-bold text-gaming-primary">
            ${product.price.toLocaleString()}
          </div>
          
          {product.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          )}
          
          {product.specs && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gaming-accent">Specifications</h4>
              <div className="space-y-1">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                    <span className="text-gray-900 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-gaming-primary text-white px-4 py-2 rounded-md hover:bg-gaming-primary/90 transition-colors">
              Add to Cart
            </button>
            <button className="px-4 py-2 border border-gaming-primary text-gaming-primary rounded-md hover:bg-gaming-primary/10 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Hook for managing modal state
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return {
    isOpen,
    open,
    close,
    toggle
  }
}
