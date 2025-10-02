import { useEffect, useState } from 'react'
import { useCartStore as useCartStoreBase } from '@/lib/store'

export const useCartStore = () => {
  const cartStore = useCartStoreBase()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Rehydrate the persisted store after mounting
    useCartStoreBase.persist.rehydrate()
    setHydrated(true)
  }, [])

  return {
    ...cartStore,
    hydrated,
  }
}
