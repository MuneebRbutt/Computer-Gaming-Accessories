const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapping of product titles/patterns to local image paths
const imageMapping = {
  'dell-x2721q-27-curved.png': '/images/categories/desktop-pcs/dell-desktop-pc-ryzen7-5800x.png',
  'hp-omen-x24f-24-flat.png': '/images/categories/desktop-pcs/hp-omen-desktop-pc-i7-12700k.png',
  'msi-optix-g27cq4-27-curved.png': '/images/categories/desktop-pcs/msi-optix-desktop-pc-ryzen5-5600x.png',
  'lg-ultragear-32gn63t-32-flat.png': '/images/categories/desktop-pcs/lg-ultragear-desktop-pc-i5-12400f.png',
  'aoc-agon-ag273qz-27-flat.png': '/images/categories/desktop-pcs/aoc-agon-desktop-pc-ryzen7-7700x.png',
  'acer-nitro-vg252q-25-flat.png': '/images/categories/desktop-pcs/acer-nitro-desktop-pc-i5-11400f.png',
};

async function updateToLocalImages() {
  try {
    console.log('Fetching products from database...');
    const products = await prisma.product.findMany();
    
    console.log(`Found ${products.length} products in database\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updatedImages = product.images;
      
      // Check if any image needs updating to local path
      if (Array.isArray(product.images)) {
        updatedImages = product.images.map(imagePath => {
          // Check if this is an ImageKit URL that needs to be replaced with local
          for (const [oldName, localPath] of Object.entries(imageMapping)) {
            if (imagePath.includes(oldName)) {
              needsUpdate = true;
              console.log(`  ${product.title}:`);
              console.log(`    Old: ${imagePath}`);
              console.log(`    New: ${localPath}`);
              return localPath;
            }
          }
          return imagePath;
        });
      }
      
      // Update the product if needed
      if (needsUpdate) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: updatedImages }
        });
        updatedCount++;
        console.log(`  ✓ Updated\n`);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total products: ${products.length}`);
    console.log(`- Updated products: ${updatedCount}`);
    
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateToLocalImages();
