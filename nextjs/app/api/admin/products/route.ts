import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, ProductService } from '@/lib/database'
import { z } from 'zod'

// GET /api/admin/products - List products with admin filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const brand = searchParams.get('brand') || undefined
    const status = searchParams.get('status') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined

    const result = await ProductService.getProducts({
      page,
      limit,
      search,
      category,
      brand,
      status: status as any,
      featured
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  comparePrice: z.number().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).default([]),
  quantity: z.number().int().min(0).default(0),
  weight: z.number().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'DISCONTINUED']).default('DRAFT'),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Received product data:', JSON.stringify(body, null, 2))
    
    const validatedData = createProductSchema.parse(body)

    // Prepare data for Prisma - remove categoryId and brandId from top level
    // as they will be set directly, not through connect
    const { categoryId, brandId, ...productData } = validatedData

    const product = await ProductService.createProduct({
      ...productData,
      categoryId,
      ...(brandId && { brandId })
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      console.error('Validation errors:', formattedErrors)
      
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: formattedErrors,
          message: formattedErrors.map(e => `${e.field}: ${e.message}`).join(', ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}