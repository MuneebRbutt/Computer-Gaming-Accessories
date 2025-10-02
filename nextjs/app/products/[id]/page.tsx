import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'
import Header from '@/components/Header'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/ProductCard'
import ProductGallery from '@/components/ProductGallery'
import Tabs from '@/components/Tabs'
import Reviews from '@/components/Reviews'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = PRODUCTS.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString('en-PK')}`
  }

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'In Stock':
        return 'text-green-400 border-green-600'
      case 'Limited Stock':
        return 'text-yellow-400 border-yellow-600'
      case 'Preorder':
        return 'text-blue-400 border-blue-600'
      default:
        return 'text-gray-400 border-gray-600'
    }
  }

  const relatedProducts = PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-400 mb-3">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/shop" className="hover:text-brand">Shop</Link>
          <span className="mx-1">/</span>
          <span className="text-white">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery images={[product.image, ...(product.gallery || [])]} />

          {/* Product Info */}
          <div>
            <div className="mb-1 text-xs text-brand">Best Computer Store In Pakistan</div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              {product.availability && (
                <span className={`px-2 py-1 text-xs rounded-md border ${getAvailabilityColor(product.availability)}`}>
                  {product.availability}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-brand font-semibold text-2xl">{formatPrice(product.price)}</div>
              {/* example discount badge */}
              <span className="px-2 py-0.5 text-xs rounded-md border border-yellow-600 text-yellow-400">Save 10%</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              {product.category}
              {product.subcategory && ` • ${product.subcategory}`}
              {` • ${product.brand}`}
            </div>

            {/* Key specs */}
            <ul className="text-sm text-gray-300 list-disc pl-5 mb-4 space-y-1">
              {Object.entries(product.specs || {}).slice(0,4).map(([k,v]) => (
                <li key={k}><span className="text-gray-400">{k}:</span> {v}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button size="lg">Add to Cart</Button>
              <Button size="lg" variant="outline">Buy Now</Button>
              <Button size="sm" variant="outline">Wishlist</Button>
              <Button size="sm" variant="outline">Compare</Button>
            </div>

            {/* Trust elements */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="border border-gray-800 rounded-md p-3">Warranty & Returns</div>
              <div className="border border-gray-800 rounded-md p-3">Secure Payments</div>
            </div>
          </div>
        </div>

        {/* Tabs: Overview, Specifications, Reviews */}
        <section className="mt-10">
          <Tabs
            items={[
              { key: 'overview', label: 'Overview', content: (
                <div className="text-sm text-gray-300">
                  {product.description}
                </div>
              ) },
              { key: 'specs', label: 'Specifications', content: (
                <div className="overflow-hidden rounded-lg border border-gray-800">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs || {}).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-black/20' : ''}>
                          <td className="px-4 py-2 w-40 text-gray-400">{key}</td>
                          <td className="px-4 py-2">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) },
              { key: 'reviews', label: 'Reviews', content: (
                <Reviews sku={product.id} />
              ) }
            ]}
          />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
