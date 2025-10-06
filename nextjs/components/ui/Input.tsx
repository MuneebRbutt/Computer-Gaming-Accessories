import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'light' | 'dark'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'dark', ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'dark'
            ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary disabled:bg-gray-900'
            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-primary focus:border-transparent disabled:bg-gray-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
