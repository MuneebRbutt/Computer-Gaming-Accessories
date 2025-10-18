const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listAllProducts() {
  console.log('📦 Fetching all products from database...\n')
  
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        status: true
      },
      take: 20 // Only get first 20
    })
    
    console.log(`Found ${products.length} products:\n`)
    console.log('='.repeat(80))
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   Status: ${product.status}`)
      console.log(`   Images: ${product.images.length > 0 ? product.images[0] : 'No images'}`)
      if (product.images.length > 1) {
        console.log(`           + ${product.images.length - 1} more image(s)`)
      }
    })
    
    console.log('\n' + '='.repeat(80))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

listAllProducts()
  .finally(async () => {
    await prisma.$disconnect()
  })
