import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/database'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email()
})

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = unsubscribeSchema.parse(body)

    await NewsletterService.unsubscribe(email)
    
    return NextResponse.json({ message: 'Successfully unsubscribed from newsletter' })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    
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

