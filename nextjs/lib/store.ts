import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './data'

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
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
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
)

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
