import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, forwardRef } from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-white',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
        error: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        secondary: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        outline: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
        neutral: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        gaming: 'border-transparent bg-gradient-to-r from-gaming-primary to-gaming-accent text-white',
        info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        premium: 'border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        new: 'border-transparent bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        sale: 'border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white',
        featured: 'border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
        limited: 'border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white',
        ghost: 'border-transparent bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }


