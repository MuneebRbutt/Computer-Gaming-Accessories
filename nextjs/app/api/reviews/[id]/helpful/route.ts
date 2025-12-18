import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/reviews/[id]/helpful - Mark review as helpful
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        helpful: {
          increment: 1
        }
      }
    })
    
    return NextResponse.json(review)
  } catch (error) {
    console.error('Mark review helpful error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

