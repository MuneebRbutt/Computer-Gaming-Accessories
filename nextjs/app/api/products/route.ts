
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/products
 * Fetch all products with filters (category, search, status)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'ACTIVE';

    const where: any = {
      status: status === 'all' ? undefined : status
    };

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
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
    });

    // Transform to match frontend Product interface
    const transformedProducts = products.map(product => ({
      id: product.id, // Use actual ID for admin management
      slug: product.slug,
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
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product (Admin only)
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Basic validation
    if (!body.title || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Generate SKU if not provided
    const sku = body.sku || `SKU-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        sku,
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        costPrice: body.costPrice ? parseFloat(body.costPrice) : null,
        images: body.images || [],
        categoryId: body.categoryId,
        brandId: body.brandId,
        tags: body.tags || [],
        quantity: parseInt(body.quantity) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        featured: body.featured || false,
        status: body.status || 'DRAFT',
        specifications: body.specifications || {},
        variants: body.variants || {},
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: (error as Error).message },
      { status: 500 }
    );
  }
}
