'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    brandId: '',
    sku: '',
    images: [''],
    specifications: {} as Record<string, string>,
    tags: [''],
    quantity: '0',
    weight: '',
    status: 'DRAFT',
    featured: false,
    metaTitle: '',
    metaDescription: ''
  })

  const [specifications, setSpecifications] = useState([{ key: '', value: '' }])

  useEffect(() => {
    fetchProduct()
    fetchCategories()
    fetchBrands()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${params.id}`)
      const product = await response.json()
      
      setFormData({
        title: product.title || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: String(product.price || 0),
        comparePrice: String(product.comparePrice || ''),
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        sku: product.sku || '',
        images: product.images?.length > 0 ? product.images : [''],
        specifications: product.specifications || {},
        tags: product.tags?.length > 0 ? product.tags : [''],
        quantity: String(product.quantity || 0),
        weight: String(product.weight || ''),
        status: product.status || 'DRAFT',
        featured: product.featured || false,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || ''
      })
      
      // Convert specifications object to array
      const specsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }))
      setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }])
    } catch (error) {
      console.error('Failed to fetch product:', error)
      alert('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData(prev => ({ ...prev, tags: newTags }))
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }))
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
    
    const specsObj = newSpecs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value
      }
      return acc
    }, {} as Record<string, string>)
    
    setFormData(prev => ({ ...prev, specifications: specsObj }))
  }

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        quantity: parseInt(formData.quantity),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert('Error updating product: ' + error.error)
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border-gray-700 hover:border-primary"
        >
          ← Back
        </Button>
      </div>

      {/* Form - Reuse the same form structure as new product page */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-xl p-6 border border-gray-700 space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Product Title *
              </label>
              <Input
                variant="dark"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                URL Slug *
              </label>
              <Input
                variant="dark"
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="product-url-slug"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed product description"
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Pricing & Inventory
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Price (Rs) *
              </label>
              <Input
                variant="dark"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Compare Price (Rs)
              </label>
              <Input
                variant="dark"
                type="number"
                value={formData.comparePrice}
                onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Quantity *
              </label>
              <Input
                variant="dark"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                SKU *
              </label>
              <Input
                variant="dark"
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="PRODUCT-SKU-001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Weight (grams)
              </label>
              <Input
                variant="dark"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Categorization
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Brand
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => handleInputChange('brandId', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Product Images
          </h2>
          
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  variant="dark"
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formData.images.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeImage(index)}
                  variant="outline"
                  className="text-red-400 border-red-400/20 hover:border-red-400"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            onClick={addImage}
            variant="outline"
            className="border-gray-700 hover:border-primary"
          >
            + Add Image
          </Button>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Tags
          </h2>
          
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  variant="dark"
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="gaming, laptop, high-performance"
                />
              </div>
              {formData.tags.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTag(index)}
                  variant="outline"
                  className="text-red-400 border-red-400/20 hover:border-red-400"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="border-gray-700 hover:border-primary"
          >
            + Add Tag
          </Button>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Specifications
          </h2>
          
          {specifications.map((spec, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input
                variant="dark"
                type="text"
                value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                placeholder="Specification name (e.g., Processor)"
              />
              <div className="flex items-center space-x-2">
                <Input
                  variant="dark"
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Specification value (e.g., Intel Core i7)"
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    variant="outline"
                    className="text-red-400 border-red-400/20 hover:border-red-400"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={addSpecification}
            variant="outline"
            className="border-gray-700 hover:border-primary"
          >
            + Add Specification
          </Button>
        </div>

        {/* Status & SEO */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
            Status & SEO
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-gray-700 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-400">
                Featured Product
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Meta Title
              </label>
              <Input
                variant="dark"
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title for search engines"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Meta Description
              </label>
              <Input
                variant="dark"
                type="text"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for search engines"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-700 hover:border-primary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/80 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Product'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
