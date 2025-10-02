'use client'

import { useState, useMemo } from 'react'
import type { StaticImageData } from 'next/image'
import ImgPC from '../images/Image (3).png'
import { PC_COMPONENTS } from '@/lib/data'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import toast from 'react-hot-toast'
import BuilderStepper from './BuilderStepper'
import PerformanceMeter from './PerformanceMeter'
import { AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react'

export default function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({})
  const { addItem } = useCartStore()

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

  // Calculate total price
  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((total, componentId) => {
      const component = PC_COMPONENTS.find(c => c.id === componentId)
      return total + (component?.price || 0)
    }, 0)
  }, [selectedComponents])

  // Calculate total power consumption
  const totalWatts = useMemo(() => {
    return Object.values(selectedComponents).reduce((total, componentId) => {
      const component = PC_COMPONENTS.find(c => c.id === componentId)
      return total + (component?.watts || 0)
    }, 0) + 50 // 50W for motherboard/headroom
  }, [selectedComponents])

  // Get selected components objects
  const selectedComponentObjects = useMemo(() => {
    return Object.entries(selectedComponents).reduce((acc, [category, id]) => {
      acc[category] = PC_COMPONENTS.find(c => c.id === id)
      return acc
    }, {} as Record<string, any>)
  }, [selectedComponents])

  // Check PSU compatibility
  const selectedPSU = selectedComponentObjects.psu
  const isPsuCompatible = !selectedPSU || totalWatts <= (selectedPSU?.watts || 0) * 0.8

  // Check CPU and motherboard socket compatibility
  const cpuSocketCompatible = useMemo(() => {
    const cpu = selectedComponentObjects.cpu
    const motherboard = selectedComponentObjects.motherboard
    
    if (!cpu || !motherboard) return true // Not incompatible if either is not selected
    
    return cpu.socket === motherboard.socket
  }, [selectedComponentObjects])

  // Check case and motherboard form factor compatibility
  const formFactorCompatible = useMemo(() => {
    const motherboard = selectedComponentObjects.motherboard
    const pcCase = selectedComponentObjects.case
    
    if (!motherboard || !pcCase) return true // Not incompatible if either is not selected
    
    // ITX motherboards can fit in ATX cases, but ATX motherboards can't fit in ITX cases
    if (motherboard.formFactor === 'ITX') return true
    if (motherboard.formFactor === 'ATX' && pcCase.formFactor === 'ITX') return false
    
    return motherboard.formFactor === pcCase.formFactor
  }, [selectedComponentObjects])

  // Overall compatibility check
  const compatibilityIssues = useMemo(() => {
    const issues = []
    
    if (!isPsuCompatible) {
      issues.push(`PSU wattage insufficient for components (${totalWatts}W needed)`);
    }
    
    if (!cpuSocketCompatible) {
      issues.push(`CPU socket (${selectedComponentObjects.cpu?.socket}) doesn't match motherboard socket (${selectedComponentObjects.motherboard?.socket})`);
    }
    
    if (!formFactorCompatible) {
      issues.push(`Motherboard form factor (${selectedComponentObjects.motherboard?.formFactor}) incompatible with case (${selectedComponentObjects.case?.formFactor})`);
    }
    
    return issues;
  }, [isPsuCompatible, cpuSocketCompatible, formFactorCompatible, selectedComponentObjects, totalWatts])

  // Performance score calculation with more factors
  const perfScore = useMemo(() => {
    const cpu = selectedComponentObjects.cpu
    const gpu = selectedComponentObjects.gpu
    const ram = selectedComponentObjects.ram
    const storage = selectedComponentObjects.storage
    
    // Base scores for components
    const cpuScore = cpu ? (cpu.id.includes('i5') ? 150 : cpu.id.includes('r5') ? 160 : cpu.id.includes('r7') ? 220 : 100) : 0
    const gpuScore = gpu ? (gpu.id.includes('4060') ? 280 : gpu.id.includes('3060') ? 220 : gpu.id.includes('1660') ? 140 : 100) : 0
    const ramScore = ram ? (ram.id.includes('32gb') ? 80 : ram.id.includes('16gb') ? 50 : 30) : 0
    const storageScore = storage ? (storage.id.includes('1tb') ? 40 : storage.id.includes('500') ? 25 : 10) : 0
    
    return cpuScore + gpuScore + ramScore + storageScore
  }, [selectedComponentObjects])

  // Filter compatible components based on current selections
  const getCompatibleComponents = (category: string) => {
    if (!componentsByCategory[category]) return []
    
    let filtered = [...componentsByCategory[category]]
    
    // Filter based on compatibility rules
    if (category === 'motherboard' && selectedComponentObjects.cpu) {
      // Filter motherboards compatible with selected CPU socket
      filtered = filtered.filter(mb => mb.socket === selectedComponentObjects.cpu.socket)
    }
    
    if (category === 'cpu' && selectedComponentObjects.motherboard) {
      // Filter CPUs compatible with selected motherboard socket
      filtered = filtered.filter(cpu => cpu.socket === selectedComponentObjects.motherboard.socket)
    }
    
    if (category === 'case' && selectedComponentObjects.motherboard) {
      // Filter cases compatible with motherboard form factor
      if (selectedComponentObjects.motherboard.formFactor === 'ATX') {
        filtered = filtered.filter(c => c.formFactor === 'ATX')
      }
      // ITX motherboards can fit in any case
    }
    
    return filtered
  }

  const handleComponentChange = (category: string, componentId: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: componentId
    }))
  }

  const handleAddToCart = () => {
    // Create a custom build product
    const customBuild = {
      id: `custom-build-${Date.now()}`,
      title: 'Custom PC Build',
      price: totalPrice,
      category: 'PC',
      subcategory: 'Custom PC Builder',
      brand: 'Custom',
      image: ImgPC as unknown as string | StaticImageData,
      description: `Custom PC build with selected components. Total power consumption: ${totalWatts}W`,
      availability: 'In Stock' as const,
      specs: Object.entries(selectedComponents).reduce((acc, [category, componentId]) => {
        const component = PC_COMPONENTS.find(c => c.id === componentId)
        if (component) {
          acc[component.category.toUpperCase()] = component.name
        }
        return acc
      }, {} as Record<string, string>)
    }

    addItem(customBuild)
    toast.success('Custom build added to cart!')
  }

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString('en-PK')}`
  }

  const steps = [
    { key: 'cpu', label: 'CPU' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'gpu', label: 'GPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'psu', label: 'Power Supply' },
    { key: 'case', label: 'Case' },
    { key: 'cooler', label: 'Cooling' },
    { key: 'peripherals', label: 'Peripherals' },
  ]
  const [activeStep, setActiveStep] = useState(steps[0].key)
  const completed = new Set(Object.keys(selectedComponents))

  return (
    <section id="pc-builder" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Custom PC Builder</h2>
        <div className="text-sm text-gray-400">Build your dream PC</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr_18rem] gap-5">
        <BuilderStepper steps={steps} active={activeStep} completed={completed} onJump={setActiveStep} />

        {/* Component Selection */}
        <div className="grid gap-3">
          {steps.map(({ key, label }) => (
            <div key={key} className={activeStep !== key ? 'hidden' : 'grid gap-2'}>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">{label}</label>
                {selectedComponentObjects[key] && (
                  <div className="flex items-center gap-1 text-xs">
                    {key === 'cpu' && !cpuSocketCompatible && (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> Socket incompatible
                      </span>
                    )}
                    {key === 'motherboard' && (!cpuSocketCompatible || !formFactorCompatible) && (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> {!cpuSocketCompatible ? 'Socket incompatible' : 'Form factor issue'}
                      </span>
                    )}
                    {key === 'case' && !formFactorCompatible && (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> Too small for motherboard
                      </span>
                    )}
                    {key === 'psu' && !isPsuCompatible && (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> Insufficient wattage
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <Select
                value={selectedComponents[key] || ''}
                onChange={(e) => handleComponentChange(key, e.target.value)}
                className={selectedComponentObjects[key] && (
                  (key === 'cpu' && !cpuSocketCompatible) ||
                  (key === 'motherboard' && (!cpuSocketCompatible || !formFactorCompatible)) ||
                  (key === 'case' && !formFactorCompatible) ||
                  (key === 'psu' && !isPsuCompatible)
                ) ? 'border-yellow-600' : ''}
              >
                <option value="">Select {label}...</option>
                {getCompatibleComponents(key).map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} — {formatPrice(component.price)}
                    {component.socket ? ` (${component.socket})` : ''}
                    {component.formFactor ? ` (${component.formFactor})` : ''}
                    {component.watts ? ` (${component.watts}W)` : ''}
                  </option>
                ))}
              </Select>
              
              {selectedComponentObjects[key] && (
                <div className="text-xs text-gray-400">
                  {key === 'cpu' && selectedComponentObjects[key].socket && (
                    <span>Socket: {selectedComponentObjects[key].socket}</span>
                  )}
                  {key === 'motherboard' && selectedComponentObjects[key].socket && (
                    <span>Socket: {selectedComponentObjects[key].socket}, Form Factor: {selectedComponentObjects[key].formFactor}</span>
                  )}
                  {key === 'psu' && selectedComponentObjects[key].watts && (
                    <span>Wattage: {selectedComponentObjects[key].watts}W (System needs {totalWatts}W)</span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={()=>{
                  const i = steps.findIndex(s=>s.key===key); if (i>0) setActiveStep(steps[i-1].key)
                }}>Prev</Button>
                <Button onClick={()=>{
                  const i = steps.findIndex(s=>s.key===key); if (i<steps.length-1) setActiveStep(steps[i+1].key)
                }}>Next</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Build Summary */}
        <div className="grid content-start gap-3">
          <div className="border border-gray-800 rounded-md p-4">
            <div className="text-sm text-gray-400">Estimated Price</div>
            <div className="text-xl font-semibold text-brand">
              {formatPrice(totalPrice)}
            </div>
            
            <div className="mt-3 text-sm text-gray-400">Estimated Wattage</div>
            <div className="text-sm">{totalWatts} W</div>
            
            <div className="mt-3 text-sm text-gray-400">Compatibility Check</div>
            {compatibilityIssues.length === 0 ? (
              <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                <CheckCircle size={16} /> All components are compatible
              </div>
            ) : (
              <div className="mt-1">
                {compatibilityIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-1 text-yellow-400 text-xs mb-1">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-1">Performance Rating</div>
              <PerformanceMeter score={perfScore} />
              <div className="text-xs text-gray-400 mt-1">
                {perfScore < 200 ? 'Entry-level gaming' : 
                 perfScore < 350 ? 'Mid-range gaming' : 
                 perfScore < 500 ? 'High-end gaming' : 'Enthusiast level'}
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={totalPrice === 0}
            className="w-full"
          >
            Add Complete Build to Cart
          </Button>
          
          {compatibilityIssues.length > 0 && (
            <div className="text-xs text-yellow-400 text-center">
              Warning: This build has compatibility issues
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
