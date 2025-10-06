import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserService } from '@/lib/database'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/settings
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

    // Get all settings
    const settings = await prisma.siteConfig.findMany()
    
    // Convert to object
    const config: any = {
      siteName: 'Gaming Store',
      siteDescription: 'Your gaming accessories store',
      contactEmail: 'contact@gaming-store.com',
      phone: '',
      address: '',
      shippingFee: 0,
      freeShippingThreshold: 0,
      taxRate: 0,
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true
    }

    settings.forEach(setting => {
      const value = setting.value
      if (value === 'true') config[setting.key] = true
      else if (value === 'false') config[setting.key] = false
      else if (!isNaN(Number(value))) config[setting.key] = Number(value)
      else config[setting.key] = value
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/settings
const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  shippingFee: z.number().optional(),
  freeShippingThreshold: z.number().optional(),
  taxRate: z.number().optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  emailNotifications: z.boolean().optional()
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserService.getUserByEmail(session.user.email)
    
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Super Admin only' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateSettingsSchema.parse(body)

    // Update each setting
    for (const [key, value] of Object.entries(validatedData)) {
      await prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    }

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Update settings error:', error)
    
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
