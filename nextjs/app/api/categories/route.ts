import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
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