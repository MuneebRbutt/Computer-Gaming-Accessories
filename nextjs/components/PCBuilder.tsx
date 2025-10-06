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
import toast from 'react-hot-toast'
import BuilderStepper from './BuilderStepper'
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
  Share2,
  Download,
  Upload,
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
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [activeCategory, setActiveCategory] = useState('cpu')
  const [buildPreset, setBuildPreset] = useState<string>('')
  
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

  // Preset builds for quick start
  const presetBuilds = [
    {
      id: 'budget-gaming',
      name: 'Budget Gaming',
      description: 'Perfect for 1080p gaming on a budget',
      price: 80000,
      components: {
        cpu: 'cpu-ryzen5-4600g',
        motherboard: 'motherboard-b450m',
        gpu: 'gpu-gtx1660-super',
        ram: 'ram-16gb-ddr4-3200',
        storage: 'storage-ssd-500gb',
        psu: 'psu-600w-bronze'
      }
    },
    {
      id: 'mid-range',
      name: 'Mid-Range Beast',
      description: 'Excellent 1440p gaming performance',
      price: 150000,
      components: {
        cpu: 'cpu-ryzen5-5600x',
        motherboard: 'motherboard-b550',
        gpu: 'gpu-rtx3060ti',
        ram: 'ram-16gb-ddr4-3600',
        storage: 'storage-nvme-1tb',
        psu: 'psu-750w-gold'
      }
    },
    {
      id: 'high-end',
      name: 'High-End Elite',
      description: '4K gaming and content creation',
      price: 300000,
      components: {
        cpu: 'cpu-ryzen7-5800x3d',
        motherboard: 'motherboard-x570',
        gpu: 'gpu-rtx4070',
        ram: 'ram-32gb-ddr4-3600',
        storage: 'storage-nvme-2tb',
        psu: 'psu-850w-gold'
      }
    }
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

  const handlePresetLoad = useCallback((presetId: string) => {
    const preset = presetBuilds.find(p => p.id === presetId)
    if (preset) {
      setSelectedComponents(preset.components)
      setBuildPreset(presetId)
      toast.success(`${preset.name} preset loaded!`)
    }
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
    setBuildName('')
    setShowSaveDialog(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-darker to-bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
            PC Builder Studio
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Build your dream gaming PC with our intelligent compatibility checker and performance estimator
          </p>
        </motion.div>

        {/* Preset Builds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Quick Start Presets
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presetBuilds.map((preset, index) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={cn(
                  'p-4 rounded-xl border cursor-pointer transition-all duration-300',
                  'bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm',
                  'hover:from-card/70 hover:to-card/50 hover:scale-105',
                  buildPreset === preset.id 
                    ? 'border-primary/50 shadow-[0_0_20px_rgba(15,240,252,0.3)]' 
                    : 'border-primary/20 hover:border-primary/40'
                )}
                onClick={() => handlePresetLoad(preset.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-text-primary">{preset.name}</h3>
                  <Badge variant="default" size="sm">
                    {formatPrice(preset.price)}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted mb-3">{preset.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary font-mono">
                    {Object.keys(preset.components).length} Components
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Load Preset
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_350px] gap-6">
          {/* Component Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
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
                    'w-full p-3 rounded-lg border text-left transition-all duration-300',
                    'flex items-center gap-3 group',
                    isActive 
                      ? 'border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10 shadow-[0_0_15px_rgba(15,240,252,0.2)]'
                      : 'border-primary/20 bg-card/50 hover:border-primary/40 hover:bg-card/70'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg bg-gradient-to-r transition-all duration-300',
                    category.color,
                    'group-hover:scale-110'
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm text-text-primary">
                      {category.label}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-text-muted truncate">
                        {PC_COMPONENTS.find(c => c.id === isSelected)?.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {category.required && (
                      <Badge variant="warning" size="sm">Required</Badge>
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
            className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className={cn(
                        'p-3 rounded-xl bg-gradient-to-r',
                        category.color
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary">
                          {category.label}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {category.required ? 'Required component' : 'Optional component'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Select
                        value={selectedComp || ''}
                        onChange={(e) => handleComponentChange(category.key, e.target.value)}
                        className="w-full"
                      >
                        <option value="">Select {category.label}...</option>
                        {compatibleComponents.map(component => (
                          <option key={component.id} value={component.id}>
                            {component.name} — {formatPrice(component.price)}
                          </option>
                        ))}
                      </Select>

                      {selectedComp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 bg-bg-dark/50 rounded-lg border border-primary/10"
                        >
                          {(() => {
                            const component = PC_COMPONENTS.find(c => c.id === selectedComp)
                            if (!component) return null
                            
                            return (
                              <div>
                                <h4 className="font-semibold text-text-primary mb-2">
                                  {component.name}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-text-muted">Price:</span>
                                    <span className="ml-2 text-accent font-semibold">
                                      {formatPrice(component.price)}
                                    </span>
                                  </div>
                                  {component.watts && (
                                    <div>
                                      <span className="text-text-muted">Power:</span>
                                      <span className="ml-2">{component.watts}W</span>
                                    </div>
                                  )}
                                  {component.socket && (
                                    <div>
                                      <span className="text-text-muted">Socket:</span>
                                      <span className="ml-2">{component.socket}</span>
                                    </div>
                                  )}
                                  {component.formFactor && (
                                    <div>
                                      <span className="text-text-muted">Form Factor:</span>
                                      <span className="ml-2">{component.formFactor}</span>
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
            className="space-y-4"
          >
            {/* Build Overview */}
            <div className="bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Build Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Total Price:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(buildStats.totalPrice)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Power Draw:</span>
                  <span className="font-semibold">{buildStats.totalWatts}W</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Performance:</span>
                  <div className="flex items-center gap-2">
                    <performanceCategory.icon className={cn('w-4 h-4', performanceCategory.color)} />
                    <span className={cn('font-semibold', performanceCategory.color)}>
                      {performanceCategory.name}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-muted">Completion:</span>
                    <span className="font-semibold">
                      {Math.round(buildStats.completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-bg-dark/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${buildStats.completionPercentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compatibility Check */}
            <div className="bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                <div className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All components are compatible!
                </div>
              ) : (
                <div className="space-y-2">
                  {compatibilityCheck.issues.map((issue, index) => (
                    <div key={index} className="text-red-400 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                  {compatibilityCheck.warnings.map((warning, index) => (
                    <div key={index} className="text-yellow-400 text-xs flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Meter */}
            <div className="bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">Performance Rating</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Performance Score</span>
                  <span className="font-bold text-primary">{buildStats.performance}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${buildStats.performance}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-text-muted text-center mt-2">
                Estimated gaming performance
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={buildStats.totalPrice === 0 || compatibilityCheck.issues.length > 0}
                className="w-full"
                variant="primary"
              >
                Add to Cart — {formatPrice(buildStats.totalPrice)}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={Object.keys(selectedComponents).length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedComponents({})
                    setBuildPreset('')
                    setActiveCategory('cpu')
                    toast.success('Build cleared!')
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {compatibilityCheck.issues.length > 0 && (
              <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                Please resolve compatibility issues before adding to cart
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
