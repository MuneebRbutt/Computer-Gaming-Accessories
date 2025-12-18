import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, ReviewService } from '@/lib/database'
import { z } from 'zod'

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  comment: z.string().min(1).max(2000),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([])
})

// GET /api/reviews/product/[productId] - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await ReviewService.getProductReviews(productId)
    
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Submit a review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const reviewData = createReviewSchema.parse(body)

    // Check if user already reviewed this product
    const { prisma } = await import('@/lib/prisma')
    
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: reviewData.productId,
        userId: user.id
      }
    })
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    const review = await ReviewService.createReview({
      ...reviewData,
      userId: user.id,
      status: 'PENDING' // Reviews need admin approval
    })
    
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    
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

