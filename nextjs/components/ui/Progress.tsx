'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gaming' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const variantStyles = {
  default: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-blue-500'
  },
  gaming: {
    bg: 'bg-gaming-dark',
    fill: 'bg-gradient-to-r from-gaming-primary to-gaming-accent'
  },
  success: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-green-500'
  },
  warning: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-yellow-500'
  },
  error: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-red-500'
  }
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  className
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const styles = variantStyles[variant]

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full rounded-full overflow-hidden',
        sizeClasses[size],
        styles.bg
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            styles.fill,
            animated && 'animate-pulse'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Specialized Progress Components
interface GamingProgressProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  className?: string
}

export function GamingProgress({ 
  value, 
  max = 100, 
  label, 
  showLabel = true, 
  className 
}: GamingProgressProps) {
  return (
    <Progress
      value={value}
      max={max}
      variant="gaming"
      size="lg"
      showLabel={showLabel}
      label={label}
      animated={true}
      className={className}
    />
  )
}

interface SkillProgressProps {
  skill: string
  level: number
  max?: number
  variant?: 'default' | 'gaming' | 'success' | 'warning' | 'error'
}

export function SkillProgress({ 
  skill, 
  level, 
  max = 100, 
  variant = 'default' 
}: SkillProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {skill}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {level}/{max}
        </span>
      </div>
      <Progress
        value={level}
        max={max}
        variant={variant}
        size="sm"
        animated={true}
      />
    </div>
  )
}

interface LoadingProgressProps {
  progress: number
  message?: string
  variant?: 'default' | 'gaming'
}

export function LoadingProgress({ 
  progress, 
  message = 'Loading...', 
  variant = 'gaming' 
}: LoadingProgressProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
      <Progress
        value={progress}
        variant={variant}
        size="md"
        animated={true}
      />
      <div className="text-center">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'default' | 'gaming' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = false,
  label,
  className
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: 'stroke-blue-500',
    gaming: 'stroke-gaming-accent',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    error: 'stroke-red-500'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={variantColors[variant]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(percentage)}%
            </div>
            {label && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface MultiStepProgressProps {
  steps: string[]
  currentStep: number
  variant?: 'default' | 'gaming'
  className?: string
}

export function MultiStepProgress({ 
  steps, 
  currentStep, 
  variant = 'default',
  className 
}: MultiStepProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar */}
      <Progress
        value={progress}
        variant={variant}
        size="sm"
        animated={true}
      />
      
      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col items-center space-y-1',
              index <= currentStep ? 'text-gaming-accent' : 'text-gray-400'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                index <= currentStep
                  ? 'bg-gaming-accent text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              )}
            >
              {index + 1}
            </div>
            <span className="text-xs text-center max-w-20">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
