import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, CategoryService } from '@/lib/database'
import { z } from 'zod'
import { CATEGORIES } from '@/lib/data'

// GET /api/admin/categories
export async function GET(request: NextRequest) {
  try {
    // Bypass auth/DB and return mock categories when auth is disabled
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      const mock = CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        createdAt: new Date().toISOString(),
        _count: { products: c.productCount ?? 0 }
      }))
      return NextResponse.json(mock)
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const categories = await CategoryService.getCategories()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories
const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Bypass and echo a mock created category when auth is disabled
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      const body = await request.json()
      const validated = createCategorySchema.parse(body)
      const created = {
        id: `mock-${Date.now()}`,
        ...validated,
        createdAt: new Date().toISOString(),
        _count: { products: 0 }
      }
      return NextResponse.json(created, { status: 201 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await CategoryService.createCategory(validatedData)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
