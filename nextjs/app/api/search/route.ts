
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } }
                ]
            },
            include: {
                category: true,
                brand: true
            },
            take: limit
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}
