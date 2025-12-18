import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PRODUCTS } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slug = params.id

    // Mock mode: return from static PRODUCTS array
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      const staticProduct = PRODUCTS.find(p => p.id === slug)
      if (!staticProduct) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json(staticProduct)
    }

    // DB mode: fetch via prisma by slug OR id
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug }
        ]
      },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const transformed = {
      id: product.slug,
      title: product.title,
      price: product.price,
      originalPrice: product.comparePrice || undefined,
      category: product.category?.name || 'Misc',
      brand: product.brand?.name || 'Unknown',
      image: product.images[0] || '/images/placeholder.png',
      gallery: product.images.slice(1),
      description: product.description || '',
      availability: product.quantity > 0 ? 'In Stock' : 'Out of Stock',
      specs: product.specifications as Record<string, string>,
      tags: product.tags,
      featured: product.featured,
      rating: undefined,
      reviewCount: undefined,
      discount: product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : undefined,
      weight: product.weight || undefined,
      warranty: undefined,
      sku: product.sku,
      metaTitle: product.metaTitle || undefined,
      metaDescription: product.metaDescription || undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}