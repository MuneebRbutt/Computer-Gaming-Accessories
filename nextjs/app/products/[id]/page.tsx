import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'
import Header from '@/components/Header'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/ProductCard'

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
        <div className="mb-4">
          <Link href="/" className="text-sm text-brand hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-[4/3] bg-card border border-gray-800 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.gallery.map((image, index) => (
                  <div key={index} className="aspect-[4/3] bg-card border border-gray-800 rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              {product.availability && (
                <span className={`px-2 py-1 text-xs rounded-md border ${getAvailabilityColor(product.availability)}`}>
                  {product.availability}
                </span>
              )}
            </div>
            
            <div className="text-brand font-semibold text-xl mb-2">
              {formatPrice(product.price)}
            </div>
            
            <div className="text-sm text-gray-400 mb-4">
              {product.category}
              {product.subcategory && ` • ${product.subcategory}`}
              {` • ${product.brand}`}
            </div>
            
            <p className="text-gray-300 text-sm mb-6">
              {product.description}
            </p>
            
            <div className="flex gap-3 mb-8">
              <Button size="lg">
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Buy Now
              </Button>
            </div>

            {/* Technical Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Technical Specifications</h2>
                <div className="overflow-hidden rounded-lg border border-gray-800">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-black/20' : ''}>
                          <td className="px-4 py-2 w-40 text-gray-400">{key}</td>
                          <td className="px-4 py-2">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

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
