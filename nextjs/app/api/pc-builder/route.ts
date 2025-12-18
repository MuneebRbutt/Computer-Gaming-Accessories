import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, PCBuildService } from '@/lib/database'
import { z } from 'zod'

const createBuildSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  public: z.boolean().default(false)
})

// GET /api/pc-builder - Get user's PC builds
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const builds = await PCBuildService.getBuilds(user.id)
    
    return NextResponse.json(builds)
  } catch (error) {
    console.error('Get PC builds error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/pc-builder - Create new PC build
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
    const buildData = createBuildSchema.parse(body)

    const build = await PCBuildService.createBuild({
      ...buildData,
      userId: user.id,
      totalPrice: 0,
      totalWatts: 0
    })
    
    return NextResponse.json(build, { status: 201 })
  } catch (error) {
    console.error('Create PC build error:', error)
    
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

