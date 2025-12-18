'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Zap,
  Gamepad2,
  Trophy,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info' | 'gaming'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

interface ToastComponentProps extends ToastProps {
  onRemove: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  gaming: Gamepad2
}

const toastColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-800 dark:text-green-200'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-200'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-800 dark:text-blue-200'
  },
  gaming: {
    bg: 'bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10',
    border: 'border-gaming-primary/30',
    icon: 'text-gaming-accent',
    text: 'text-gaming-primary dark:text-gaming-accent'
  }
}

export function Toast({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  action,
  onRemove
}: ToastComponentProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = toastIcons[type]
  const colors = toastColors[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onRemove(id), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, id, onRemove])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(id), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'relative max-w-sm w-full shadow-lg rounded-lg border p-4',
            colors.bg,
            colors.border,
            type === 'gaming' && 'backdrop-blur-sm'
          )}
        >
          {/* Gaming glow effect */}
          {type === 'gaming' && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gaming-primary/5 to-gaming-accent/5 animate-pulse" />
          )}

          <div className="relative flex items-start gap-3">
            <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', colors.icon)} />

            <div className="flex-1 min-w-0">
              {title && (
                <p className={cn('text-sm font-semibold', colors.text)}>
                  {title}
                </p>
              )}
              {description && (
                <p className={cn('text-sm mt-1', colors.text, title && 'opacity-80')}>
                  {description}
                </p>
              )}

              {action && (
                <button
                  onClick={action.onClick}
                  className={cn(
                    'mt-2 text-sm font-medium underline hover:no-underline transition-all',
                    colors.text
                  )}
                >
                  {action.label}
                </button>
              )}
            </div>

            <button
              onClick={handleClose}
              className={cn(
                'flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
                colors.text
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={cn(
                  'h-full',
                  type === 'gaming'
                    ? 'bg-gradient-to-r from-gaming-primary to-gaming-accent'
                    : 'bg-current'
                )}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastContainer({
  toasts,
  onRemove,
  position = 'top-right'
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 max-w-sm w-full',
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Specialized Gaming Toasts
export function GamingToast({
  id,
  title = "Achievement Unlocked!",
  description,
  onRemove
}: Omit<ToastComponentProps, 'type'>) {
  return (
    <Toast
      id={id}
      title={title}
      description={description}
      type="gaming"
      duration={6000}
      onRemove={onRemove}
    />
  )
}

export function SuccessToast({
  id,
  title = "Success!",
  description,
  onRemove
}: Omit<ToastComponentProps, 'type'>) {
  return (
    <Toast
      id={id}
      title={title}
      description={description}
      type="success"
      onRemove={onRemove}
    />
  )
}

export function ErrorToast({
  id,
  title = "Error",
  description,
  onRemove
}: Omit<ToastComponentProps, 'type'>) {
  return (
    <Toast
      id={id}
      title={title}
      description={description}
      type="error"
      onRemove={onRemove}
    />
  )
}

export function WarningToast({
  id,
  title = "Warning",
  description,
  onRemove
}: Omit<ToastComponentProps, 'type'>) {
  return (
    <Toast
      id={id}
      title={title}
      description={description}
      type="warning"
      onRemove={onRemove}
    />
  )
}

export function InfoToast({
  id,
  title = "Info",
  description,
  onRemove
}: Omit<ToastComponentProps, 'type'>) {
  return (
    <Toast
      id={id}
      title={title}
      description={description}
      type="info"
      onRemove={onRemove}
    />
  )
}
