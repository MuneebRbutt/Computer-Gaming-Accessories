"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock,
  AlertCircle,
  Zap,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  key: string
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  required?: boolean
  estimatedTime?: string
  tips?: string[]
}

interface BuilderStepperProps {
  steps: Step[]
  activeStep: string
  completedSteps: Set<string>
  onStepClick: (key: string) => void
  variant?: 'default' | 'gaming' | 'minimal'
  orientation?: 'vertical' | 'horizontal'
  showProgress?: boolean
  showTips?: boolean
  className?: string
}

export default function BuilderStepper({ 
  steps, 
  activeStep, 
  completedSteps, 
  onStepClick,
  variant = 'gaming',
  orientation = 'vertical',
  showProgress = true,
  showTips = false,
  className 
}: BuilderStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.key === activeStep)
  const progressPercentage = ((completedSteps.size) / steps.length) * 100

  const getStepStatus = (step: Step, index: number) => {
    if (completedSteps.has(step.key)) return 'completed'
    if (step.key === activeStep) return 'active'
    if (index < currentStepIndex) return 'skipped'
    return 'pending'
  }

  const getStepIcon = (step: Step, status: string) => {
    if (status === 'completed') return CheckCircle2
    if (status === 'active') return step.icon || Play
    if (status === 'skipped') return AlertCircle
    return step.icon || Circle
  }

  const getStepClasses = (status: string) => {
    const baseClasses = 'transition-all duration-300'
    
    switch (status) {
      case 'completed':
        return cn(
          baseClasses,
          'text-green-400 border-green-400/50 bg-green-500/10 hover:bg-green-500/20'
        )
      case 'active':
        return cn(
          baseClasses,
          'text-primary border-primary/50 bg-primary/10',
          'shadow-sm hover:shadow-md'
        )
      case 'skipped':
        return cn(
          baseClasses,
          'text-yellow-400 border-yellow-400/50 bg-yellow-500/10 hover:bg-yellow-500/20'
        )
      default:
        return cn(
          baseClasses,
          'text-gray-600 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
        )
    }
  }

  if (orientation === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-primary">
                Build Progress
              </span>
              <span className="text-sm text-text-muted">
                {completedSteps.size} of {steps.length} completed
              </span>
            </div>
            <div className="w-full bg-bg-dark/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index)
            const Icon = getStepIcon(step, status)
            
            return (
              <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  onClick={() => onStepClick(step.key)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer',
                    'min-w-[200px] text-left',
                    getStepClasses(status)
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.label}</div>
                    {step.description && (
                      <div className="text-xs opacity-75">{step.description}</div>
                    )}
                  </div>
                  {step.required && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </motion.button>
                
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full max-w-sm', className)}>
      <div className={cn(
        'sticky top-6 rounded-xl overflow-hidden',
        variant === 'gaming' 
          ? 'bg-white border border-gray-200 shadow-sm'
          : 'bg-white border border-gray-200'
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Build Guide
            </h3>
            {showProgress && (
              <span className="text-xs text-gray-600">
                {completedSteps.size}/{steps.length}
              </span>
            )}
          </div>
          
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Steps List */}
        <div className="p-4">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const status = getStepStatus(step, index)
              const Icon = getStepIcon(step, status)
              const isActive = step.key === activeStep
              
              return (
                <motion.div
                  key={step.key}
                  layout
                  className="relative"
                >
                  <motion.button
                    onClick={() => onStepClick(step.key)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-left',
                      getStepClasses(status)
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Step Number/Icon */}
                    <div className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      status === 'completed' ? 'bg-green-500/20' :
                      status === 'active' ? 'bg-primary/20' :
                      status === 'skipped' ? 'bg-yellow-500/20' :
                      'bg-text-muted/20'
                    )}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === 'active' ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {step.label}
                        </span>
                        {step.required && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded flex-shrink-0">
                            Required
                          </span>
                        )}
                      </div>
                      
                      {step.description && (
                        <p className="text-xs opacity-75 mt-1 truncate">
                          {step.description}
                        </p>
                      )}
                      
                      {step.estimatedTime && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs opacity-75">{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Active indicator - removed for clean theme */}
                  </motion.button>

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className={cn(
                        'w-px h-4 transition-colors duration-300',
                        completedSteps.has(step.key) ? 'bg-green-400/50' :
                        status === 'active' ? 'bg-primary/50' :
                        'bg-text-muted/20'
                      )} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Tips Section */}
          {showTips && (
            <AnimatePresence>
              {(() => {
                const activeStepData = steps.find(s => s.key === activeStep)
                if (!activeStepData?.tips?.length) return null
                
                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-primary/10"
                  >
                    <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-accent" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-1">
                      {activeStepData.tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-xs text-text-muted flex items-start gap-2"
                        >
                          <span className="text-accent mt-1">•</span>
                          <span>{tip}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })()}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <motion.button
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.key === activeStep)
                if (currentIndex > 0) {
                  onStepClick(steps[currentIndex - 1].key)
                }
              }}
              disabled={currentStepIndex === 0}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200',
                currentStepIndex === 0
                  ? 'border-text-muted/20 text-text-muted/50 cursor-not-allowed'
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              )}
              whileHover={currentStepIndex !== 0 ? { scale: 1.02 } : undefined}
              whileTap={currentStepIndex !== 0 ? { scale: 0.98 } : undefined}
            >
              Previous
            </motion.button>
            
            <motion.button
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.key === activeStep)
                if (currentIndex < steps.length - 1) {
                  onStepClick(steps[currentIndex + 1].key)
                }
              }}
              disabled={currentStepIndex === steps.length - 1}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200',
                currentStepIndex === steps.length - 1
                  ? 'border-text-muted/20 text-text-muted/50 cursor-not-allowed'
                  : 'border-accent/30 text-accent hover:bg-accent/10'
              )}
              whileHover={currentStepIndex !== steps.length - 1 ? { scale: 1.02 } : undefined}
              whileTap={currentStepIndex !== steps.length - 1 ? { scale: 0.98 } : undefined}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}


