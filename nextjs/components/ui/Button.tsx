import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Primary - Light Green
            'bg-primary text-white hover:bg-primary-600 shadow-sm hover:shadow-md': variant === 'primary',
            // Secondary - Indigo
            'bg-secondary text-white hover:bg-secondary-600 shadow-sm hover:shadow-md': variant === 'secondary',
            // Outline - Light Green border
            'border-2 border-primary text-primary hover:bg-primary hover:text-white': variant === 'outline',
            // Ghost - Subtle hover
            'text-gray-700 hover:bg-gray-100 hover:text-primary': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
