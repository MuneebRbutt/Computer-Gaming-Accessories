import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './data'

export interface CartItem {
  product: Product
  quantity: number
  addedAt: Date
  customOptions?: Record<string, string> // For customizable products
  warranty?: {
    type: string
    duration: string
    price: number
  }
  accessories?: Product[] // Bundled accessories
}

export interface CartDiscount {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  description: string
  minimumOrder?: number
  expiresAt?: Date
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
  description: string
  icon?: string
}

export interface CartStore {
  items: CartItem[]
  savedForLater: CartItem[]
  appliedDiscounts: CartDiscount[]
  selectedShipping?: ShippingOption
  checkoutStep: 'cart' | 'shipping' | 'payment' | 'review'

  // Compatibility aliases expected by some components
  discounts?: CartDiscount[]
  shippingOption?: ShippingOption

  // Cart Actions
  addItem: (product: Product, options?: Partial<CartItem>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateItemOptions: (productId: string, options: Partial<CartItem>) => void
  clearCart: () => void

  // Save for Later
  saveForLater: (productId: string) => void
  moveToCart: (productId: string) => void
  removeSavedItem: (productId: string) => void

  // Discounts
  applyDiscount: (discount: CartDiscount | string) => void
  removeDiscount: (discountId: string) => void

  // Shipping
  setShipping: (shipping: ShippingOption) => void
  setShippingOption?: (shipping: ShippingOption | string) => void

  // Compatibility helpers
  toggleSaveForLater?: (productId: string) => void

  // Checkout
  setCheckoutStep: (step: CartStore['checkoutStep']) => void

  // Calculations
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscountAmount: () => number
  getShippingCost: () => number
  getTaxAmount: () => number
  getTotalPrice: () => number

  // Validation
  validateCart: () => { isValid: boolean; errors: string[] }
  getEstimatedDelivery: () => string
  // Compatibility naming
  estimateDelivery?: () => string
  getFinalTotal?: () => number
  getCartWeight?: () => number
  getTotalSavings?: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],
      appliedDiscounts: [],
      checkoutStep: 'cart',

      addItem: (product, options = {}) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + (options.quantity || 1) }
                : item
            )
          })
        } else {
          const newItem: CartItem = {
            product,
            quantity: options.quantity || 1,
            addedAt: new Date(),
            ...options
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      updateItemOptions: (productId, options) => {
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, ...options }
              : item
          )
        })
      },

      clearCart: () => set({ items: [], appliedDiscounts: [], selectedShipping: undefined }),

      saveForLater: (productId: string) => {
        const item = get().items.find(item => item.product.id === productId)
        if (item) {
          set({
            items: get().items.filter(item => item.product.id !== productId),
            savedForLater: [...get().savedForLater, item]
          })
        }
      },

      moveToCart: (productId) => {
        const item = get().savedForLater.find(item => item.product.id === productId)
        if (item) {
          set({
            savedForLater: get().savedForLater.filter(item => item.product.id !== productId),
            items: [...get().items, item]
          })
        }
      },

      removeSavedItem: (productId) => {
        set({
          savedForLater: get().savedForLater.filter(item => item.product.id !== productId)
        })
      },

      applyDiscount: (discount) => {
        // Accept either a CartDiscount object or a discount code string
        if (typeof discount === 'string') {
          const code = discount.trim()
          if (!code) return
          const newDiscount: CartDiscount = {
            id: code,
            code,
            type: 'fixed',
            value: 0,
            description: `Code ${code}`
          }
          const existing = get().appliedDiscounts.find(d => d.id === newDiscount.id)
          if (!existing) set({ appliedDiscounts: [...get().appliedDiscounts, newDiscount] })
          return
        }

        const existing = get().appliedDiscounts.find(d => d.id === discount.id)
        if (!existing) {
          set({ appliedDiscounts: [...get().appliedDiscounts, discount] })
        }
      },

      removeDiscount: (discountId) => {
        set({
          appliedDiscounts: get().appliedDiscounts.filter(d => d.id !== discountId)
        })
      },

      setShipping: (shipping) => set({ selectedShipping: shipping }),
      // Accept either a ShippingOption or an id string
      setShippingOption: (shipping) => {
        if (!shipping) return
        if (typeof shipping === 'string') {
          // Create a basic shipping object for compatibility
          set({ selectedShipping: { id: shipping, name: shipping, price: 0, estimatedDays: '3-5', description: '' } })
        } else {
          set({ selectedShipping: shipping })
        }
      },

      setCheckoutStep: (step) => set({ checkoutStep: step }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          let itemPrice = item.product.price * item.quantity

          // Add warranty cost
          if (item.warranty) {
            itemPrice += item.warranty.price
          }

          // Add accessories cost
          if (item.accessories) {
            itemPrice += item.accessories.reduce((acc, accessory) => acc + accessory.price, 0)
          }

          return total + itemPrice
        }, 0)
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal()
        return get().appliedDiscounts.reduce((total, discount) => {
          if (discount.type === 'percentage') {
            return total + (subtotal * (discount.value / 100))
          } else if (discount.type === 'fixed') {
            return total + discount.value
          }
          return total
        }, 0)
      },

      getShippingCost: () => {
        const shippingDiscounts = get().appliedDiscounts.filter(d => d.type === 'shipping')
        const baseShipping = get().selectedShipping?.price || 0

        const shippingDiscount = shippingDiscounts.reduce((total, discount) => {
          return total + (discount.type === 'shipping' ? discount.value : 0)
        }, 0)

        return Math.max(0, baseShipping - shippingDiscount)
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal()
        const discountAmount = get().getDiscountAmount()
        const taxableAmount = subtotal - discountAmount
        return taxableAmount * 0.08 // 8% tax rate
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal()
        const discountAmount = get().getDiscountAmount()
        const shippingCost = get().getShippingCost()
        const taxAmount = get().getTaxAmount()

        return subtotal - discountAmount + shippingCost + taxAmount
      },

      // Compatibility helpers
      getFinalTotal: () => get().getTotalPrice(),
      estimateDelivery: () => get().getEstimatedDelivery(),
      getCartWeight: () => {
        return get().items.reduce((total, item) => {
          // product may have weight property
          const wt = (item as any).product?.weight || (item as any).weight || 0
          return total + (wt * (item.quantity || 1))
        }, 0)
      },
      getTotalSavings: () => get().getDiscountAmount(),

      validateCart: () => {
        const errors: string[] = []
        const items = get().items

        // Check stock availability
        items.forEach(item => {
          if (item.product.availability === 'Out of Stock') {
            errors.push(`${item.product.title} is out of stock`)
          }
          if (item.quantity > 10) { // Assume max quantity limit
            errors.push(`Maximum quantity for ${item.product.title} is 10`)
          }
        })

        // Check minimum order
        const appliedDiscounts = get().appliedDiscounts
        appliedDiscounts.forEach(discount => {
          if (discount.minimumOrder && get().getSubtotal() < discount.minimumOrder) {
            errors.push(`Minimum order of Rs ${discount.minimumOrder} required for ${discount.description}`)
          }
        })

        return {
          isValid: errors.length === 0,
          errors
        }
      },

      getEstimatedDelivery: () => {
        const shipping = get().selectedShipping
        if (!shipping) return 'Select shipping method'

        const today = new Date()
        const deliveryDate = new Date(today)

        // Parse estimated days (e.g., "3-5 days" -> take max value)
        const daysMatch = shipping.estimatedDays.match(/(\d+)-?(\d+)?/)
        const maxDays = daysMatch ? parseInt(daysMatch[2] || daysMatch[1]) : 7

        deliveryDate.setDate(today.getDate() + maxDays)

        return deliveryDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
)

// Wishlist Store
export interface WishlistItem {
  product: Product
  addedAt: Date
  priceAtAdd: number
  notes?: string
  priority: 'low' | 'medium' | 'high'
  notifyOnSale: boolean
  notifyOnStock: boolean
}

interface WishlistStore {
  items: WishlistItem[]
  collections: { id: string; name: string; items: string[] }[]

  // Wishlist Actions
  addItem: (product: Product, options?: Partial<WishlistItem>) => void
  addToWishlist: (productId: string, collectionId?: string) => void
  removeItem: (productId: string) => void
  updateItem: (productId: string, updates: Partial<WishlistItem>) => void
  clearWishlist: () => void

  // Collections
  createCollection: (name: string) => string
  addToCollection: (collectionId: string, productId: string) => void
  removeFromCollection: (collectionId: string, productId: string) => void
  deleteCollection: (collectionId: string) => void

  // Utilities
  isInWishlist: (productId: string) => boolean
  getTotalItems: () => number
  getPriceDropItems: () => WishlistItem[]
  getBackInStockItems: () => WishlistItem[]
  moveToCart: (productId: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      collections: [],

      addItem: (product, options = {}) => {
        const existing = get().items.find(item => item.product.id === product.id)
        if (!existing) {
          const newItem: WishlistItem = {
            product,
            addedAt: new Date(),
            priceAtAdd: product.price,
            priority: 'medium',
            notifyOnSale: false,
            notifyOnStock: false,
            ...options
          }
          set({ items: [...get().items, newItem] })
        }
      },

      addToWishlist: (productId, collectionId = 'main') => {
        // This is a simplified version - in real app you'd fetch product by ID
        const mockProduct = { id: productId, title: 'Product', price: 99.99, category: 'Misc', brand: 'Brand', image: '/placeholder.png' } as Product
        get().addItem(mockProduct)
        if (collectionId !== 'main') {
          get().addToCollection(collectionId, productId)
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId),
          collections: get().collections.map(collection => ({
            ...collection,
            items: collection.items.filter(id => id !== productId)
          }))
        })
      },

      updateItem: (productId, updates) => {
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, ...updates }
              : item
          )
        })
      },

      clearWishlist: () => set({ items: [], collections: [] }),

      createCollection: (name) => {
        const id = `collection-${Date.now()}`
        set({
          collections: [...get().collections, { id, name, items: [] }]
        })
        return id
      },

      addToCollection: (collectionId, productId) => {
        set({
          collections: get().collections.map(collection =>
            collection.id === collectionId
              ? { ...collection, items: Array.from(new Set([...collection.items, productId])) }
              : collection
          )
        })
      },

      removeFromCollection: (collectionId, productId) => {
        set({
          collections: get().collections.map(collection =>
            collection.id === collectionId
              ? { ...collection, items: collection.items.filter(id => id !== productId) }
              : collection
          )
        })
      },

      deleteCollection: (collectionId) => {
        set({
          collections: get().collections.filter(collection => collection.id !== collectionId)
        })
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product.id === productId)
      },

      getTotalItems: () => get().items.length,

      getPriceDropItems: () => {
        return get().items.filter(item =>
          item.product.price < item.priceAtAdd && item.notifyOnSale
        )
      },

      getBackInStockItems: () => {
        return get().items.filter(item =>
          item.product.availability === 'In Stock' && item.notifyOnStock
        )
      },

      moveToCart: (productId) => {
        const item = get().items.find(item => item.product.id === productId)
        if (item) {
          // This would integrate with cart store
          // For now, just remove from wishlist
          get().removeItem(productId)
        }
      }
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
    }
  )
)

// User Authentication Store
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  preferences: {
    currency: string
    language: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    gaming: {
      favoriteGenres: string[]
      platforms: string[]
      experienceLevel: 'beginner' | 'intermediate' | 'expert'
    }
  }
  addresses: Array<{
    id: string
    type: 'billing' | 'shipping'
    name: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
  }>
  paymentMethods: Array<{
    id: string
    type: 'card' | 'paypal' | 'bank'
    name: string
    last4?: string
    expiryMonth?: number
    expiryYear?: number
    isDefault: boolean
  }>
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  updateProfile: (updates: Partial<User>) => Promise<boolean>

  // Address Management
  addAddress: (address: Omit<User['addresses'][0], 'id'>) => void
  updateAddress: (addressId: string, updates: Partial<User['addresses'][0]>) => void
  deleteAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string, type: 'billing' | 'shipping') => void

  // Payment Methods
  addPaymentMethod: (method: Omit<User['paymentMethods'][0], 'id'>) => void
  updatePaymentMethod: (methodId: string, updates: Partial<User['paymentMethods'][0]>) => void
  deletePaymentMethod: (methodId: string) => void
  setDefaultPaymentMethod: (methodId: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock successful login
        const mockUser: User = {
          id: 'user-123',
          email,
          name: 'Gaming Enthusiast',
          role: 'user',
          preferences: {
            currency: 'PKR',
            language: 'en',
            notifications: {
              email: true,
              sms: false,
              push: true
            },
            gaming: {
              favoriteGenres: ['FPS', 'RPG'],
              platforms: ['PC', 'PlayStation'],
              experienceLevel: 'intermediate'
            }
          },
          addresses: [],
          paymentMethods: []
        }

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        })

        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      signup: async (userData) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock successful signup
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: userData.email!,
          name: userData.name!,
          role: 'user',
          preferences: {
            currency: 'PKR',
            language: 'en',
            notifications: {
              email: true,
              sms: false,
              push: true
            },
            gaming: {
              favoriteGenres: [],
              platforms: [],
              experienceLevel: 'beginner'
            }
          },
          addresses: [],
          paymentMethods: []
        }

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false
        })

        return true
      },

      updateProfile: async (updates) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
            isLoading: false
          })
        }

        return true
      },

      addAddress: (address) => {
        const currentUser = get().user
        if (currentUser) {
          const newAddress = {
            ...address,
            id: `addr-${Date.now()}`
          }
          set({
            user: {
              ...currentUser,
              addresses: [...currentUser.addresses, newAddress]
            }
          })
        }
      },

      updateAddress: (addressId, updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...updates } : addr
              )
            }
          })
        }
      },

      deleteAddress: (addressId) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.filter(addr => addr.id !== addressId)
            }
          })
        }
      },

      setDefaultAddress: (addressId, type) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId && addr.type === type
              }))
            }
          })
        }
      },

      addPaymentMethod: (method) => {
        const currentUser = get().user
        if (currentUser) {
          const newMethod = {
            ...method,
            id: `pm-${Date.now()}`
          }
          set({
            user: {
              ...currentUser,
              paymentMethods: [...currentUser.paymentMethods, newMethod]
            }
          })
        }
      },

      updatePaymentMethod: (methodId, updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              paymentMethods: currentUser.paymentMethods.map(method =>
                method.id === methodId ? { ...method, ...updates } : method
              )
            }
          })
        }
      },

      deletePaymentMethod: (methodId) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              paymentMethods: currentUser.paymentMethods.filter(method => method.id !== methodId)
            }
          })
        }
      },

      setDefaultPaymentMethod: (methodId) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              paymentMethods: currentUser.paymentMethods.map(method => ({
                ...method,
                isDefault: method.id === methodId
              }))
            }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)

// Filter Store
interface FilterStore {
  search: string
  category: string
  subcategory: string
  brand: string
  minPrice: number
  maxPrice: number
  sortBy: string
  view: 'grid' | 'list'
  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setSubcategory: (subcategory: string) => void
  setBrand: (brand: string) => void
  setMinPrice: (minPrice: number) => void
  setMaxPrice: (maxPrice: number) => void
  setSortBy: (sortBy: string) => void
  setView: (view: 'grid' | 'list') => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: '',
  category: '',
  subcategory: '',
  brand: '',
  minPrice: 0,
  maxPrice: 0,
  sortBy: 'default',
  view: 'grid',
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category, subcategory: '' }),
  setSubcategory: (subcategory) => set({ subcategory }),
  setBrand: (brand) => set({ brand }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setSortBy: (sortBy) => set({ sortBy }),
  setView: (view) => set({ view }),
  resetFilters: () => set({
    search: '',
    category: '',
    subcategory: '',
    brand: '',
    minPrice: 0,
    maxPrice: 0,
    sortBy: 'default',
    view: 'grid'
  })
}))
