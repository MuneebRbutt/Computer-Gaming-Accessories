'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  _count?: {
    products: number
  }
  createdAt: string
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        image: editingCategory.image || ''
      })
      setShowForm(true)
    }
  }, [editingCategory])

  useEffect(() => {
    // Auto-generate slug from name
    if (formData.name && !editingCategory) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, editingCategory])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const response = await fetch(url, {
        method: editingCategory ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchCategories()
        resetForm()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Failed to save category')
    }
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '' })
    setEditingCategory(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Categories Management</h1>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-gaming-primary hover:bg-gaming-primary/80"
        >
          ➕ Add New Category
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gaming-muted mb-2">
                  Category Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gaming-muted mb-2">
                  URL Slug *
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-url-slug"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Category description"
                rows={3}
                className="w-full px-4 py-2 bg-gaming-dark border border-gaming-accent/20 rounded-lg text-white placeholder-gaming-muted focus:outline-none focus:ring-2 focus:ring-gaming-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gaming-muted mb-2">
                Image URL
              </label>
              <Input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/category-image.jpg"
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="border-gaming-accent/20 hover:border-gaming-accent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gaming-primary hover:bg-gaming-primary/80"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-primary"></div>
          </div>
        ) : (
          categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gaming-darker rounded-xl p-6 border border-gaming-accent/20 hover:border-gaming-primary/50 transition-all"
            >
              {category.image && (
                <div className="mb-4 rounded-lg overflow-hidden bg-gaming-dark h-32">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="text-sm text-gaming-muted">Slug: {category.slug}</p>
                {category.description && (
                  <p className="text-sm text-gaming-muted line-clamp-2">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-gaming-accent">
                  {category._count?.products || 0} products
                </p>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Button
                  onClick={() => setEditingCategory(category)}
                  variant="outline"
                  className="flex-1 text-sm border-gaming-accent/20 hover:border-gaming-primary"
                >
                  ✏️ Edit
                </Button>
                <Button
                  onClick={() => deleteCategory(category.id)}
                  variant="outline"
                  className="flex-1 text-sm border-gaming-accent/20 hover:border-red-400 text-red-400"
                >
                  🗑️ Delete
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
