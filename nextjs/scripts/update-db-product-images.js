const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapping of old monitor image names to new desktop PC names
const imageMapping = {
  'hp-omen-x24f-24-flat.png': 'hp-omen-desktop-pc-i7-12700k.png',
  'dell-x2721q-27-curved.png': 'dell-desktop-pc-ryzen7-5800x.png',
  'msi-optix-g27cq4-27-curved.png': 'msi-optix-desktop-pc-ryzen5-5600x.png',
  'lg-ultragear-32gn63t-32-flat.png': 'lg-ultragear-desktop-pc-i5-12400f.png',
  'aoc-agon-ag273qz-27-flat.png': 'aoc-agon-desktop-pc-ryzen7-7700x.png',
  'acer-nitro-vg252q-25-flat.png': 'acer-nitro-desktop-pc-i5-11400f.png',
  'asus-rog-swift-pg27aqn-27-flat.png': 'asus-rog-desktop-pc-i9-13900k.png',
  'benq-zowie-xl2546k-25-flat.png': 'benq-zowie-desktop-pc-i7-11700k.png',
  'gigabyte-m27q-27-flat.png': 'gigabyte-desktop-pc-ryzen5-3600.png',
  'samsung-odyssey-g7-32-curved.png': 'samsung-odyssey-desktop-pc-i9-12900k.png',
  'alienware-aw3423dwf-34-curved.png': 'alienware-desktop-pc-i9-13900kf.png',
  'aoc-cu34g2x-34-curved.png': 'aoc-cu34g2x-desktop-pc-ryzen7-3700x.png',
  'asus-tuf-vg27aq-27-flat.png': 'asus-tuf-desktop-pc-ryzen5-5600g.png',
  'lg-27gp850-b-27-flat.png': 'lg-27gp850-b-desktop-pc-i5-10400f.png',
  'msi-modern-md272q-27-flat.png': 'msi-desktop-pc-ryzen7-5700g.png',
  'philips-345e2ae-34-curved.png': 'custom-desktop-pc-amd-ryzen5.png',
  'samsung-smart-m8-32-flat.png': 'custom-desktop-pc-intel-i7.png',
  'viewsonic-elite-xg270-27-flat.png': 'viewsonic-desktop-pc-ryzen9-5900x.png',
  'zowie-xl2566k-25-flat.png': 'custom-gaming-desktop-pc-i5-13600k.png'
};

async function updateProductImages() {
  try {
    console.log('Fetching products from database...');
    const products = await prisma.product.findMany();
    
    console.log(`Found ${products.length} products in database\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updatedImages = product.images;
      
      // Check if any image needs updating
      if (Array.isArray(product.images)) {
        updatedImages = product.images.map(imagePath => {
          // Check if this is a local image path that needs updating
          for (const [oldName, newName] of Object.entries(imageMapping)) {
            if (imagePath.includes(oldName)) {
              needsUpdate = true;
              const updatedPath = imagePath.replace(oldName, newName);
              console.log(`  ${product.title}:`);
              console.log(`    Old: ${imagePath}`);
              console.log(`    New: ${updatedPath}`);
              return updatedPath;
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

updateProductImages();
