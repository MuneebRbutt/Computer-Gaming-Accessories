import Header from '@/components/Header'
import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { PRODUCTS } from '@/lib/data'

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const queryRaw = (searchParams?.query || '') as string
  const query = queryRaw.trim().toLowerCase()
  const filtered = query
    ? PRODUCTS.filter(p =>
        [p.title, p.category, p.subcategory, p.brand]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(query))
      )
    : PRODUCTS
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
        </div>
        <ProductFilters products={filtered} />
        <ProductGrid products={filtered} />
      </main>
    </div>
  )
}
