import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService, SupportTicketService } from '@/lib/database'
import { z } from 'zod'

const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM')
})

// GET /api/support - Get user's support tickets
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

    const tickets = await SupportTicketService.getTickets(user.id)
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Get support tickets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/support - Create support ticket
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
    const ticketData = createTicketSchema.parse(body)

    const ticket = await SupportTicketService.createTicket({
      ...ticketData,
      userId: user.id,
      status: 'OPEN'
    })
    
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Create support ticket error:', error)
    
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

