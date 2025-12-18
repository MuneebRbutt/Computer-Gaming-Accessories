import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, PCBuildService } from '@/lib/database'
import { z } from 'zod'

const addItemSchema = z.object({
  productId: z.string(),
  category: z.string().min(1),
  quantity: z.number().int().positive().default(1)
})

// POST /api/pc-builder/[id]/items - Add component to build
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const itemData = addItemSchema.parse(body)

    const item = await PCBuildService.addItemToBuild(
      params.id,
      itemData.productId,
      itemData.category,
      itemData.quantity
    )
    
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Add item to build error:', error)
    
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

