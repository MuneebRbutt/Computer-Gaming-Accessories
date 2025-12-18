import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/database'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

// POST /api/newsletter/subscribe - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = subscribeSchema.parse(body)

    const subscriber = await NewsletterService.subscribe(email, firstName, lastName)
    
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter', subscriber },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    
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

