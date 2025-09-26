import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warn' | 'neutral'
}

export function Badge({ className, variant = 'brand', ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
        {
          'border-cyan-500/40 text-cyan-300 bg-cyan-500/10': variant === 'brand',
          'border-green-500/40 text-green-300 bg-green-500/10': variant === 'success',
          'border-yellow-500/40 text-yellow-300 bg-yellow-500/10': variant === 'warn',
          'border-gray-600/40 text-gray-300 bg-gray-600/10': variant === 'neutral',
        },
        className
      )}
      {...props}
    />
  )
}


