'use client'

import { useState, useMemo } from 'react'
import { PC_COMPONENTS } from '@/lib/data'
import { useCartStore } from '@/lib/store'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import toast from 'react-hot-toast'

export default function PCBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({})
  const { addItem } = useCartStore()

  const componentsByCategory = useMemo(() => {
    return PC_COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, typeof PC_COMPONENTS>)
  }, [])

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((total, componentId) => {
      const component = PC_COMPONENTS.find(c => c.id === componentId)
      return total + (component?.price || 0)
    }, 0)
  }, [selectedComponents])

  const totalWatts = useMemo(() => {
    return Object.values(selectedComponents).reduce((total, componentId) => {
      const component = PC_COMPONENTS.find(c => c.id === componentId)
      return total + (component?.watts || 0)
    }, 0) + 50 // 50W for motherboard/headroom
  }, [selectedComponents])

  const selectedPSU = PC_COMPONENTS.find(c => c.id === selectedComponents.psu)
  const isCompatible = !selectedPSU || totalWatts <= selectedPSU.watts! * 0.8

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
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
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

  return (
    <section id="pc-builder" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Custom PC Builder</h2>
        <div className="text-sm text-gray-400">Build your dream PC</div>
      </div>
      
      <div className="bg-card border border-gray-800 rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Component Selection */}
          <div className="grid gap-3">
            {Object.entries(componentsByCategory).map(([category, components]) => (
              <div key={category} className="grid gap-2">
                <label className="text-xs text-gray-400 capitalize">
                  {category === 'psu' ? 'Power Supply' : category}
                </label>
                <Select
                  value={selectedComponents[category] || ''}
                  onChange={(e) => handleComponentChange(category, e.target.value)}
                >
                  <option value="">Select {category}...</option>
                  {components.map(component => (
                    <option key={component.id} value={component.id}>
                      {component.name} — {formatPrice(component.price)}
                    </option>
                  ))}
                </Select>
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
              <div className={`mt-2 text-xs ${isCompatible ? 'text-green-400' : 'text-yellow-400'}`}>
                {isCompatible ? 'Looks compatible.' : `Recommended higher PSU. Need ≥ ${Math.ceil(totalWatts / 0.8)}W`}
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={totalPrice === 0}
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
