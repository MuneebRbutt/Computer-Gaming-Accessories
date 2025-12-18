'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { StaticImageData } from 'next/image'
import { PC_COMPONENTS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import { Badge } from './ui/Badge'
import { Input } from './ui/Input'
import toast from 'react-hot-toast'
import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  HardDrive,
  Zap,
  Monitor,
  Gamepad2,
  TrendingUp,
  DollarSign,
  Save,
  RotateCcw,
  Info,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BuildConfiguration {
  id: string
  name: string
  components: Record<string, string>
  totalPrice: number
  performance: number
  createdAt: Date
}

export default function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({})
  const [buildName, setBuildName] = useState('')
  const [savedBuilds, setSavedBuilds] = useState<BuildConfiguration[]>([])
  const [activeCategory, setActiveCategory] = useState('cpu')

  const { addItem } = useCartStore()

  // Component categories with enhanced metadata
  const componentCategories = [
    { key: 'cpu', label: 'Processor', icon: Cpu, color: 'from-blue-500 to-cyan-500', required: true },
    { key: 'motherboard', label: 'Motherboard', icon: HardDrive, color: 'from-green-500 to-emerald-500', required: true },
    { key: 'gpu', label: 'Graphics Card', icon: Monitor, color: 'from-purple-500 to-pink-500', required: true },
    { key: 'ram', label: 'Memory (RAM)', icon: Zap, color: 'from-orange-500 to-red-500', required: true },
    { key: 'storage', label: 'Storage', icon: HardDrive, color: 'from-indigo-500 to-blue-500', required: true },
    { key: 'psu', label: 'Power Supply', icon: Zap, color: 'from-yellow-500 to-orange-500', required: true },
    { key: 'case', label: 'PC Case', icon: Monitor, color: 'from-slate-500 to-gray-500', required: false },
    { key: 'cooler', label: 'CPU Cooler', icon: Zap, color: 'from-cyan-500 to-blue-500', required: false },
  ]

  // Get all components by category
  const componentsByCategory = useMemo(() => {
    return PC_COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, typeof PC_COMPONENTS>)
  }, [])

  // Calculate build statistics
  const buildStats = useMemo(() => {
    const components = Object.values(selectedComponents).map(id =>
      PC_COMPONENTS.find(c => c.id === id)
    ).filter(Boolean)

    const totalPrice = components.reduce((sum, comp) => sum + (comp?.price || 0), 0)
    const totalWatts = components.reduce((sum, comp) => sum + (comp?.watts || 0), 0)

    // Enhanced performance calculation based on component names and prices
    const performanceFactors = {
      cpu: components.find(c => c?.category === 'cpu')?.price || 0,
      gpu: components.find(c => c?.category === 'gpu')?.price || 0,
      ram: components.find(c => c?.category === 'ram')?.price || 0,
      storage: components.find(c => c?.category === 'storage')?.price || 0
    }

    // Convert price to performance score (higher price = better performance)
    const performance = Math.round(
      (Math.sqrt(performanceFactors.cpu / 1000) * 0.3 +
        Math.sqrt(performanceFactors.gpu / 1000) * 0.4 +
        Math.sqrt(performanceFactors.ram / 1000) * 0.2 +
        Math.sqrt(performanceFactors.storage / 1000) * 0.1) * 20
    )

    return {
      totalPrice,
      totalWatts,
      performance,
      componentCount: components.length,
      completionPercentage: (components.length / componentCategories.filter(c => c.required).length) * 100
    }
  }, [selectedComponents, componentCategories])

  // Enhanced compatibility checking
  const compatibilityCheck = useMemo(() => {
    const issues: string[] = []
    const warnings: string[] = []

    const selectedComps = Object.entries(selectedComponents).reduce((acc, [category, id]) => {
      acc[category] = PC_COMPONENTS.find(c => c.id === id)
      return acc
    }, {} as Record<string, any>)

    // CPU + Motherboard socket compatibility
    if (selectedComps.cpu && selectedComps.motherboard) {
      if (selectedComps.cpu.socket !== selectedComps.motherboard.socket) {
        issues.push(`CPU socket (${selectedComps.cpu.socket}) incompatible with motherboard (${selectedComps.motherboard.socket})`)
      }
    }

    // PSU wattage check
    if (selectedComps.psu && buildStats.totalWatts > 0) {
      const psuWattage = selectedComps.psu.watts || 0
      const requiredWattage = buildStats.totalWatts * 1.2 // 20% headroom

      if (psuWattage < requiredWattage) {
        issues.push(`PSU insufficient: ${psuWattage}W PSU for ${Math.round(requiredWattage)}W system`)
      } else if (psuWattage < buildStats.totalWatts * 1.5) {
        warnings.push(`PSU barely adequate: consider higher wattage for better efficiency`)
      }
    }

    // Case + Motherboard form factor
    if (selectedComps.case && selectedComps.motherboard) {
      const caseSize = selectedComps.case.formFactor
      const mbSize = selectedComps.motherboard.formFactor

      if (mbSize === 'ATX' && caseSize === 'ITX') {
        issues.push(`ATX motherboard won't fit in ITX case`)
      }
    }

    // GPU clearance check
    if (selectedComps.gpu && selectedComps.case) {
      const gpuLength = selectedComps.gpu.length || 0
      const caseGpuClearance = selectedComps.case.gpuClearance || 999

      if (gpuLength > caseGpuClearance) {
        issues.push(`GPU too long: ${gpuLength}mm GPU in case with ${caseGpuClearance}mm clearance`)
      }
    }

    return {
      issues,
      warnings,
      score: issues.length === 0 ? (warnings.length === 0 ? 100 : 85) : 0
    }
  }, [selectedComponents, buildStats])

  // Performance category calculation
  const performanceCategory = useMemo(() => {
    const score = buildStats.performance
    if (score >= 80) return { name: 'Enthusiast', color: 'text-purple-400', icon: Sparkles }
    if (score >= 60) return { name: 'High-End', color: 'text-blue-400', icon: TrendingUp }
    if (score >= 40) return { name: 'Mid-Range', color: 'text-green-400', icon: Gamepad2 }
    if (score >= 20) return { name: 'Budget', color: 'text-yellow-400', icon: DollarSign }
    return { name: 'Entry-Level', color: 'text-gray-400', icon: Monitor }
  }, [buildStats.performance])

  const handleComponentChange = useCallback((category: string, componentId: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: componentId
    }))
  }, [])


  const handleSaveBuild = useCallback(() => {
    if (!buildName.trim()) {
      toast.error('Please enter a build name')
      return
    }

    const newBuild: BuildConfiguration = {
      id: `build-${Date.now()}`,
      name: buildName.trim(),
      components: { ...selectedComponents },
      totalPrice: buildStats.totalPrice,
      performance: buildStats.performance,
      createdAt: new Date()
    }

    setSavedBuilds(prev => [...prev, newBuild])
    toast.success('Build saved successfully!')
  }, [buildName, selectedComponents, buildStats])

  const handleAddToCart = useCallback(() => {
    if (Object.keys(selectedComponents).length === 0) {
      toast.error('Please select components first')
      return
    }

    if (compatibilityCheck.issues.length > 0) {
      toast.error('Please resolve compatibility issues first')
      return
    }

    const customBuild = {
      id: `custom-build-${Date.now()}`,
      title: buildName || 'Custom PC Build',
      price: buildStats.totalPrice,
      category: 'Custom PC',
      subcategory: 'PC Builder',
      brand: 'Custom',
      image: '/images/pc-build.jpg' as string | StaticImageData,
      description: `Custom ${performanceCategory.name} PC build with ${buildStats.componentCount} components`,
      availability: 'In Stock' as const,
      specs: Object.entries(selectedComponents).reduce((acc, [category, componentId]) => {
        const component = PC_COMPONENTS.find(c => c.id === componentId)
        if (component) {
          acc[category.toUpperCase()] = component.name
        }
        return acc
      }, {} as Record<string, string>)
    }

    addItem(customBuild)
    toast.success('Custom build added to cart!')
  }, [selectedComponents, compatibilityCheck.issues, buildName, buildStats, performanceCategory.name])

  const builderHighlights = [
    {
      title: 'Plan Your Build',
      description: 'Start with the essentials like CPU, motherboard, graphics, and memory to anchor your setup.'
    },
    {
      title: 'Check Compatibility',
      description: 'We flag socket, power, and clearance conflicts automatically so you can adjust with confidence.'
    },
    {
      title: 'Finalize & Save',
      description: 'Name your build, review totals, then add it to cart or save the configuration for later tweaks.'
    }
  ]

  return (
    <div className="min-h-screen bg-gaming-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3 glow-text">
            PC Builder Studio
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Build your dream rig with live compatibility checks, performance projections, and a streamlined parts workflow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {builderHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-gaming-card p-6 text-left shadow-glass hover:border-gaming-primary/30 transition-colors"
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-gaming-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-8 xl:gap-10">
          {/* Component Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gaming-primary" />
              Components
            </h3>

            {componentCategories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedComponents[category.key]
              const isActive = activeCategory === category.key

              return (
                <motion.button
                  key={category.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.key)}
                  className={cn(
                    'w-full p-4 rounded-xl border text-left transition-all duration-300',
                    'flex items-center gap-3 group',
                    isActive
                      ? 'border-gaming-primary bg-gaming-primary/10 shadow-neon'
                      : 'border-white/5 bg-gaming-card hover:border-white/20 hover:bg-gaming-card/80'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg bg-gradient-to-r transition-all duration-300 shadow-inner',
                    category.color,
                    'group-hover:scale-110'
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">
                      {category.label}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-gaming-primary truncate mt-1">
                        {PC_COMPONENTS.find(c => c.id === isSelected)?.name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {category.required && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Component Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gaming-card border border-white/5 rounded-2xl p-8 shadow-glass h-fit"
          >
            <AnimatePresence mode="wait">
              {componentCategories.map((category) => {
                if (activeCategory !== category.key) return null

                const Icon = category.icon
                const compatibleComponents = componentsByCategory[category.key] || []
                const selectedComp = selectedComponents[category.key]

                return (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className={cn(
                        'p-4 rounded-xl bg-gradient-to-r shadow-lg',
                        category.color
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {category.required ? 'Required component' : 'Optional component'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Select
                        value={selectedComp || ''}
                        onChange={(e) => handleComponentChange(category.key, e.target.value)}
                        className="w-full bg-gaming-surface border-white/10 text-white focus:border-gaming-primary p-4 text-lg"
                      >
                        <option value="" className="bg-gaming-card">Select {category.label}...</option>
                        {compatibleComponents.map(component => (
                          <option key={component.id} value={component.id} className="bg-gaming-card">
                            {component.name} — {formatPrice(component.price)}
                          </option>
                        ))}
                      </Select>

                      {selectedComp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-6 bg-gaming-surface rounded-xl border border-white/5"
                        >
                          {(() => {
                            const component = PC_COMPONENTS.find(c => c.id === selectedComp)
                            if (!component) return null

                            return (
                              <div>
                                <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                                  {component.name}
                                  <Badge className="bg-gaming-primary/20 text-gaming-primary border-gaming-primary/20">Selected</Badge>
                                </h4>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                  <div>
                                    <span className="text-gray-500 block mb-1 uppercase text-xs font-bold tracking-wider">Price</span>
                                    <span className="text-gaming-secondary font-bold text-lg">
                                      {formatPrice(component.price)}
                                    </span>
                                  </div>
                                  {component.watts && (
                                    <div>
                                      <span className="text-gray-500 block mb-1 uppercase text-xs font-bold tracking-wider">Power</span>
                                      <span className="text-white font-medium">{component.watts}W</span>
                                    </div>
                                  )}
                                  {component.socket && (
                                    <div>
                                      <span className="text-gray-500 block mb-1 uppercase text-xs font-bold tracking-wider">Socket</span>
                                      <span className="text-white font-medium">{component.socket}</span>
                                    </div>
                                  )}
                                  {component.formFactor && (
                                    <div>
                                      <span className="text-gray-500 block mb-1 uppercase text-xs font-bold tracking-wider">Form Factor</span>
                                      <span className="text-white font-medium">{component.formFactor}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })()}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Build Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Build Overview */}
            <div className="bg-gaming-card border border-white/5 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-gaming-primary" />
                Build Overview
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
                    Build Name
                  </label>
                  <Input
                    value={buildName}
                    onChange={(event) => setBuildName(event.target.value)}
                    placeholder="My neon battlestation"
                    className="bg-gaming-surface border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {formatPrice(buildStats.totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Power Draw:</span>
                  <span className="font-semibold text-white">{buildStats.totalWatts}W</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Performance:</span>
                  <div className="flex items-center gap-2">
                    <performanceCategory.icon className={cn('w-4 h-4', performanceCategory.color)} />
                    <span className={cn('font-semibold', performanceCategory.color)}>
                      {performanceCategory.name}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2 text-xs uppercase font-bold tracking-wider text-gray-500">
                    <span>Completion</span>
                    <span>{Math.round(buildStats.completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gaming-surface rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${buildStats.completionPercentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-gaming-primary to-gaming-secondary shadow-neon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compatibility Check */}
            <div className="bg-gaming-card border border-white/5 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2 text-white">
                {compatibilityCheck.score === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : compatibilityCheck.issues.length > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <Info className="w-5 h-5 text-yellow-400" />
                )}
                Compatibility
              </h3>

              {compatibilityCheck.issues.length === 0 && compatibilityCheck.warnings.length === 0 ? (
                <div className="text-green-400 text-sm flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="w-4 h-4" />
                  All components are compatible!
                </div>
              ) : (
                <div className="space-y-2">
                  {compatibilityCheck.issues.map((issue, index) => (
                    <div key={index} className="text-red-400 text-xs flex items-start gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                  {compatibilityCheck.warnings.map((warning, index) => (
                    <div key={index} className="text-yellow-400 text-xs flex items-start gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Meter */}
            <div className="bg-gaming-card border border-white/5 rounded-2xl p-6 shadow-glass">
              <h3 className="text-lg font-display font-bold mb-4 text-white">Performance Rating</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Score</span>
                  <span className="font-bold text-gaming-primary">{buildStats.performance}/100</span>
                </div>
                <div className="w-full bg-gaming-surface rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 shadow-neon"
                    style={{ width: `${buildStats.performance}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-3 uppercase tracking-wider">
                Estimated gaming performance
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={buildStats.totalPrice === 0 || compatibilityCheck.issues.length > 0}
                className="w-full bg-gradient-to-r from-gaming-primary to-gaming-secondary hover:opacity-90 text-white font-bold py-3 shadow-neon border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                variant="primary"
              >
                Add to Cart — {formatPrice(buildStats.totalPrice)}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveBuild}
                  disabled={Object.keys(selectedComponents).length === 0}
                  className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedComponents({})
                    setBuildName('')
                    setActiveCategory('cpu')
                    toast.success('Build cleared!')
                  }}
                  className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {savedBuilds.length > 0 && (
              <div className="text-xs text-gray-500 text-center">
                {savedBuilds.length} build{savedBuilds.length > 1 ? 's' : ''} saved this session.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
