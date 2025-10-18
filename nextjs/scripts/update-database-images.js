const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Image mappings - products with ImageKit images (based on actual database slugs)
const imageUpdates = {
  // Laptop - FOUND IN DATABASE
  'msi-gaming-laptop-rtx4060': {
    images: [
      'https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-front.png',
      'https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-side.png'
    ]
  },
  
  // Headset - FOUND IN DATABASE
  'hyperx-cloud3-wireless': {
    images: ['https://ik.imagekit.io/rbo8xe5z6/products/hyperx-cloud3.jpg']
  }
}

async function updateDatabaseImages() {
  console.log('🚀 Starting database image update...\n')
  
  let updated = 0
  let notFound = 0
  let errors = 0
  
  for (const [slug, data] of Object.entries(imageUpdates)) {
    try {
      // Try to find product by slug
      const product = await prisma.product.findFirst({
        where: { slug: slug }
      })
      
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: data.images }
        })
        console.log(`✅ Updated: ${product.title || slug}`)
        console.log(`   Images: ${data.images.length} image(s)`)
        updated++
      } else {
        console.log(`⚠️  Not found in database: ${slug}`)
        notFound++
      }
    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error.message)
      errors++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Update Summary:')
  console.log(`   ✅ Successfully updated: ${updated} products`)
  console.log(`   ⚠️  Not found: ${notFound} products`)
  console.log(`   ❌ Errors: ${errors} products`)
  console.log('='.repeat(60))
  
  if (updated > 0) {
    console.log('\n✨ Database images updated successfully!')
    console.log('🔄 Refresh your browser to see the changes.\n')
  }
}

updateDatabaseImages()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
