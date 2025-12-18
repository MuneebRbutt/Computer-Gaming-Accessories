import { useEffect, useState } from 'react'
import { useCartStore as useCartStoreBase } from '@/lib/store'

// Overloaded wrapper: with selector -> returns selected slice; without -> returns full store + hydrated flag
export function useCartStore<T>(selector: (state: ReturnType<typeof useCartStoreBase>) => T): T
export function useCartStore(): ReturnType<typeof useCartStoreBase> & { hydrated: boolean }
export function useCartStore(selector?: (state: ReturnType<typeof useCartStoreBase>) => any) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const anyStore = useCartStoreBase as any
    try {
      if (anyStore?.persist?.rehydrate) {
        anyStore.persist.rehydrate().finally(() => setHydrated(true))
        return
      }
    } catch {}
    // Fallback: mark hydrated
    setHydrated(true)
  }, [])

  if (selector) {
    return useCartStoreBase(selector)
  }

  const cartStore = useCartStoreBase()
  return {
    ...cartStore,
    hydrated,
  }
}
