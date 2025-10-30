const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllMonitorProducts() {
  try {
    console.log('Fetching ALL products from database (no limit)...\n');
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        status: true
      }
    });
    
    console.log(`Found ${products.length} total products:\n`);
    console.log('='.repeat(100));
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Images:`);
      product.images.forEach(img => console.log(`     - ${img}`));
    });
    
    console.log('\n' + '='.repeat(100));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listAllMonitorProducts();
