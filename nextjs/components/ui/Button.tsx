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
          'relative overflow-hidden inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-brand text-black hover:bg-brand-dark hover:shadow-soft': variant === 'primary',
            'bg-card text-white hover:bg-gray-800 hover:shadow-soft': variant === 'secondary',
            'border border-gray-700 text-white hover:border-brand hover:shadow-soft': variant === 'outline',
            'text-white hover:bg-gray-800 hover:shadow-soft': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {/* neon gradient hover overlay */}
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(110deg,rgba(14,165,233,0.25),rgba(14,165,233,0.05),rgba(14,165,233,0.25))] bg-[length:200%_100%] animate-shimmer" />
        <span className="relative z-10">{props.children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
