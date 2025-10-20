import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gaming' | 'success' | 'warning' | 'error' | 'premium'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
          {
            // Primary - Gaming theme
            'bg-gaming-primary text-white hover:bg-gaming-primary/90 shadow-sm hover:shadow-md active:scale-95': variant === 'primary',
            // Secondary - Indigo
            'bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md active:scale-95': variant === 'secondary',
            // Outline - Gaming border
            'border-2 border-gaming-primary text-gaming-primary hover:bg-gaming-primary hover:text-white active:scale-95': variant === 'outline',
            // Ghost - Subtle hover
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gaming-primary active:scale-95': variant === 'ghost',
            // Link - No background
            'text-gaming-primary hover:text-gaming-accent underline-offset-4 hover:underline p-0 h-auto': variant === 'link',
            // Gaming - Special gaming style
            'bg-gradient-to-r from-gaming-primary to-gaming-accent text-white hover:from-gaming-primary/90 hover:to-gaming-accent/90 shadow-lg hover:shadow-xl active:scale-95': variant === 'gaming',
            // Success
            'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md active:scale-95': variant === 'success',
            // Warning
            'bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow-md active:scale-95': variant === 'warning',
            // Error
            'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md active:scale-95': variant === 'error',
            // Premium
            'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl active:scale-95': variant === 'premium',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
            'h-14 px-8 text-lg': size === 'xl',
          },
          variant === 'link' && 'h-auto px-0 py-0',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Gaming glow effect */}
        {variant === 'gaming' && (
          <div className="absolute inset-0 bg-gradient-to-r from-gaming-primary/20 to-gaming-accent/20 animate-pulse" />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
