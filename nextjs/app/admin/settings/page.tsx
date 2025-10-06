'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface SiteConfig {
  siteName: string
  siteDescription: string
  contactEmail: string
  phone: string
  address: string
  shippingFee: number
  freeShippingThreshold: number
  taxRate: number
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<SiteConfig>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    phone: '',
    address: '',
    shippingFee: 0,
    freeShippingThreshold: 0,
    taxRate: 0,
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="text-gaming-muted mt-2">Manage your website configuration and preferences</p>
      </div>

      {/* Settings Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* General Settings */}
        <div className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20 space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gaming-accent/20 pb-2">
            General Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Site Name
              </label>
              <Input
                type="text"
                value={config.siteName}
                onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                placeholder="Gaming Store"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Contact Email
              </label>
              <Input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@gaming-store.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gaming-muted mb-2">
              Site Description
            </label>
            <textarea
              value={config.siteDescription}
              onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
              placeholder="Your gaming store description"
              rows={3}
              className="w-full px-4 py-2 bg-gaming-dark border border-gaming-accent/20 rounded-lg text-white placeholder-gaming-muted focus:outline-none focus:ring-2 focus:ring-gaming-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={config.phone}
                onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+92 300 1234567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Business Address
              </label>
              <Input
                type="text"
                value={config.address}
                onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Gaming Street, Lahore"
              />
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20 space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gaming-accent/20 pb-2">
            Pricing & Shipping
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Shipping Fee (Rs)
              </label>
              <Input
                type="number"
                value={config.shippingFee}
                onChange={(e) => setConfig(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Free Shipping Threshold (Rs)
              </label>
              <Input
                type="number"
                value={config.freeShippingThreshold}
                onChange={(e) => setConfig(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Tax Rate (%)
              </label>
              <Input
                type="number"
                value={config.taxRate}
                onChange={(e) => setConfig(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20 space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gaming-accent/20 pb-2">
            System Settings
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-gaming-dark/50 rounded-lg cursor-pointer hover:bg-gaming-dark transition-colors">
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="rounded border-gaming-accent/20 text-gaming-primary focus:ring-gaming-primary"
              />
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-gaming-muted">Temporarily disable the website for maintenance</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-gaming-dark/50 rounded-lg cursor-pointer hover:bg-gaming-dark transition-colors">
              <input
                type="checkbox"
                checked={config.allowRegistration}
                onChange={(e) => setConfig(prev => ({ ...prev, allowRegistration: e.target.checked }))}
                className="rounded border-gaming-accent/20 text-gaming-primary focus:ring-gaming-primary"
              />
              <div>
                <p className="text-white font-medium">Allow User Registration</p>
                <p className="text-sm text-gaming-muted">Enable new users to register accounts</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-gaming-dark/50 rounded-lg cursor-pointer hover:bg-gaming-dark transition-colors">
              <input
                type="checkbox"
                checked={config.emailNotifications}
                onChange={(e) => setConfig(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="rounded border-gaming-accent/20 text-gaming-primary focus:ring-gaming-primary"
              />
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gaming-muted">Send email notifications for orders and updates</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            onClick={fetchSettings}
            variant="outline"
            className="border-gaming-accent/20 hover:border-gaming-accent"
          >
            Reset Changes
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gaming-primary hover:bg-gaming-primary/80 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
