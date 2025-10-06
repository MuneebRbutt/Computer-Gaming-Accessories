import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'ACTIVE'

    const where: any = {
      status: status === 'all' ? undefined : status
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend Product interface
    const transformedProducts = products.map(product => ({
      id: product.slug,
      title: product.title,
      price: product.price,
      originalPrice: product.comparePrice || undefined,
      category: product.category?.name || '',
      subcategory: undefined,
      brand: product.brand?.name || '',
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
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
