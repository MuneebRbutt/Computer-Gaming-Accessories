import { SelectHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'light' | 'dark'
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, variant = 'dark', ...props }, ref) => {
    return (
      <select
        className={clsx(
          'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'dark'
            ? 'bg-gaming-dark border-gaming-accent/20 text-white focus:ring-gaming-primary focus:border-gaming-primary disabled:bg-gaming-darker'
            : 'bg-white border-gray-300 text-gray-900 focus:ring-primary focus:border-transparent disabled:bg-gray-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export { Select }
