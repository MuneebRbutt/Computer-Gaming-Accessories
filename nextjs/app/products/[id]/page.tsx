'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, GitCompare, MessageCircle, Share2, CheckCircle, Truck, Package, Star, ShoppingCart, Minus, Plus } from 'lucide-react'
import Header from '@/components/Header'
import { PRODUCTS } from '@/lib/data'
import { FALLBACK_IMAGE_DATA_URI } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params?.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          const staticProduct = PRODUCTS.find(p => p.id === productId)
          if (staticProduct) setProduct(staticProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        const staticProduct = PRODUCTS.find(p => p.id === productId)
        if (staticProduct) setProduct(staticProduct)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link href="/products" className="text-pink-500 hover:underline">Back to products</Link>
          </div>
        </div>
      </div>
    )
  }

  const images = [product.image, product.image, product.image, product.image].filter(Boolean)
  const relatedProducts = PRODUCTS.filter(p => p.id !== productId && p.category === product.category).slice(0, 4)
  const comparisonProducts = PRODUCTS.slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-500">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-pink-500">Shop</Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${selectedImage === idx ? 'border-pink-500' : 'border-gray-200'}`}>
                  <Image src={img || FALLBACK_IMAGE_DATA_URI} alt={`${product.title} view ${idx + 1}`} width={80} height={80} className="w-full h-full object-contain p-1" unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-gray-50 rounded-lg p-8 aspect-square flex items-center justify-center">
              <Image src={images[selectedImage] || FALLBACK_IMAGE_DATA_URI} alt={product.title} width={500} height={500} className="max-w-full max-h-full object-contain" unoptimized />
            </div>
          </div>

          <div className="lg:col-span-6 order-3">
            <span className="text-sm text-pink-500 font-semibold mb-2 block">Best Computer Store In Pakistan</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-pink-500">${(product.price / 1000).toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">${(product.originalPrice / 1000).toFixed(2)}</span>
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded text-sm font-semibold">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                </>
              )}
            </div>

            <div className="mb-6">
              <span className="text-gray-600">{product.category}</span>
              {product.brand && <><span className="mx-2">•</span><span className="text-gray-600">{product.brand}</span></>}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
            </div>

            {product.description && <p className="text-gray-600 mb-6 leading-relaxed">{product.description.slice(0, 200)}...</p>}

            {product.specs && (
              <div className="mb-6 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Key Specifications:</h3>
                <ul className="space-y-2">
                  {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2 text-gray-700">
                      <span className="text-pink-500 mt-1">●</span>
                      <span><strong>{key}:</strong> {value as string}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none" min="1" max="10" />
                  <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="p-3 hover:bg-gray-100 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">Max: 10</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <button className="flex-1 bg-gray-800 text-white py-4 px-6 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-semibold">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold text-lg mb-6">
              Buy It Now
            </button>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                <GitCompare className="w-5 h-5" />
                <span className="text-sm">Compare</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">Ask a Question</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">Social Share</span>
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Guarantee safe & secure checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">MC</div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">PP</div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">STRIPE</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Estimated Delivery:</p>
                  <p className="text-sm text-gray-600">3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab('description')} className={`pb-4 font-semibold transition-colors relative ${activeTab === 'description' ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'}`}>
                Description
                {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>}
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`pb-4 font-semibold transition-colors relative ${activeTab === 'reviews' ? 'text-pink-500' : 'text-gray-600 hover:text-gray-900'}`}>
                Reviews ({product.reviewCount || 0})
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>}
              </button>
            </div>
          </div>

          {activeTab === 'description' ? (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{product.description || 'No description available for this product.'}</p>
              {product.specs && (
                <>
                  <h4 className="text-lg font-semibold mb-3 mt-6">Item Specifics:</h4>
                  <ul className="space-y-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <li key={key} className="flex items-start gap-2 text-gray-700">
                        <span className="text-pink-500 mt-1">●</span>
                        <span><strong>{key}:</strong> {value as string}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                <button className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors">Write a Review</button>
              </div>
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/products/${relProduct.id}`} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-50 p-4 relative overflow-hidden">
                    <Image src={relProduct.image || FALLBACK_IMAGE_DATA_URI} alt={relProduct.title} fill className="object-contain group-hover:scale-110 transition-transform duration-300" unoptimized />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">{relProduct.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(relProduct.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">${(relProduct.price / 1000).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-4 text-left font-semibold">Product</th>
                  <th className="border border-gray-200 p-4 text-left font-semibold">Price</th>
                  <th className="border border-gray-200 p-4 text-left font-semibold">Rating</th>
                  <th className="border border-gray-200 p-4 text-left font-semibold">Category</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {comparisonProducts.map((compProduct) => (
                  <tr key={compProduct.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        <Image src={compProduct.image || FALLBACK_IMAGE_DATA_URI} alt={compProduct.title} width={60} height={60} className="object-contain" unoptimized />
                        <Link href={`/products/${compProduct.id}`} className="font-semibold text-gray-900 hover:text-pink-500 line-clamp-2">{compProduct.title}</Link>
                      </div>
                    </td>
                    <td className="border border-gray-200 p-4">
                      <span className="font-bold text-gray-900">${(compProduct.price / 1000).toFixed(2)}</span>
                    </td>
                    <td className="border border-gray-200 p-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(compProduct.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-200 p-4">
                      <span className="text-gray-600">{compProduct.category}</span>
                    </td>
                    <td className="border border-gray-200 p-4 text-center">
                      <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-semibold">Add to Cart</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
