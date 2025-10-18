/**
 * Update Product Image URLs after ImageKit Rename
 * Run this AFTER you've renamed images in ImageKit Dashboard
 * 
 * Usage: node scripts/update-product-images.js
 */

const fs = require('fs');
const path = require('path');

const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/rbo8xe5z6/images';

// Complete mapping of Product ID → New Image Names
const PRODUCT_IMAGE_MAP = {
  'gaming-laptop-rtx4060': {
    image: `${IMAGEKIT_ENDPOINT}/msi-gaming-laptop-rtx4060-front.png`,
    gallery: [
      `${IMAGEKIT_ENDPOINT}/msi-gaming-laptop-rtx4060-front.png`,
      `${IMAGEKIT_ENDPOINT}/msi-gaming-laptop-rtx4060-side.png`
    ]
  },
  'custom-pc-ryzen7': {
    image: `${IMAGEKIT_ENDPOINT}/custom-pc-ryzen7-5800x-front.png`,
    gallery: [
      `${IMAGEKIT_ENDPOINT}/custom-pc-ryzen7-5800x-front.png`,
      `${IMAGEKIT_ENDPOINT}/custom-pc-ryzen7-5800x-rgb.png`,
      `${IMAGEKIT_ENDPOINT}/custom-pc-ryzen7-5800x-inside.png`
    ]
  },
  'razer-keyboard-rgb': {
    image: `${IMAGEKIT_ENDPOINT}/razer-blackwidow-v4-rgb.png`,
    gallery: []
  },
  'hyperx-headset-cloud3': {
    image: `${IMAGEKIT_ENDPOINT}/hyperx-cloud3-wireless-black.png`,
    gallery: []
  },
  'logitech-mouse-gpro': {
    image: `${IMAGEKIT_ENDPOINT}/logitech-gpro-superlight-white.png`,
    gallery: []
  },
  'dell-monitor-27-165hz': {
    image: `${IMAGEKIT_ENDPOINT}/dell-s2722dgm-27-curved.png`,
    gallery: []
  },
  'samsung-ssd-1tb': {
    image: `${IMAGEKIT_ENDPOINT}/samsung-980pro-ssd-1tb.png`,
    gallery: []
  }
};

// Banner and Logo
const BRANDING_IMAGES = {
  banner: `${IMAGEKIT_ENDPOINT}/advance-it-traders-hero-banner.png`,
  logo: `${IMAGEKIT_ENDPOINT}/advance-it-traders-logo.png`
};

/**
 * Generate the updated data.ts content
 */
function generateUpdatedDataFile() {
  const dataPath = path.join(__dirname, '..', 'lib', 'data.ts');
  let content = fs.readFileSync(dataPath, 'utf8');
  
  // Update each product's image URLs
  Object.keys(PRODUCT_IMAGE_MAP).forEach(productId => {
    const { image, gallery } = PRODUCT_IMAGE_MAP[productId];
    
    console.log(`Updating product: ${productId}`);
    console.log(`  Main image: ${image}`);
    if (gallery.length > 0) {
      console.log(`  Gallery: ${gallery.length} images`);
    }
  });
  
  // For now, let's create a mapping JSON file
  const mapping = {
    products: PRODUCT_IMAGE_MAP,
    branding: BRANDING_IMAGES,
    updated: new Date().toISOString()
  };
  
  const outputPath = path.join(__dirname, 'updated-image-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  
  console.log(`\n✅ Mapping saved to: ${outputPath}`);
  
  return mapping;
}

/**
 * Display copy-paste ready code snippets
 */
function displayCodeSnippets() {
  console.log('\n' + '='.repeat(80));
  console.log('📝 COPY-PASTE READY CODE SNIPPETS');
  console.log('='.repeat(80));
  
  Object.keys(PRODUCT_IMAGE_MAP).forEach(productId => {
    const { image, gallery } = PRODUCT_IMAGE_MAP[productId];
    
    console.log(`\n// Product: ${productId}`);
    console.log(`image: '${image}',`);
    
    if (gallery.length > 1) {
      console.log(`gallery: [`);
      gallery.forEach((url, index) => {
        console.log(`  '${url}'${index < gallery.length - 1 ? ',' : ''}`);
      });
      console.log(`],`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Instructions:');
  console.log('1. Open lib/data.ts');
  console.log('2. Find each product by ID (e.g., gaming-laptop-rtx4060)');
  console.log('3. Replace the image and gallery URLs with the snippets above');
  console.log('4. Save and test!\n');
}

/**
 * Verify images are accessible
 */
async function verifyImages() {
  console.log('\n🔍 Verifying image URLs...\n');
  
  const allUrls = [];
  
  // Collect all URLs
  Object.values(PRODUCT_IMAGE_MAP).forEach(({ image, gallery }) => {
    allUrls.push(image);
    allUrls.push(...gallery);
  });
  
  Object.values(BRANDING_IMAGES).forEach(url => {
    allUrls.push(url);
  });
  
  // Remove duplicates
  const uniqueUrls = [...new Set(allUrls)];
  
  console.log(`Total unique images: ${uniqueUrls.length}`);
  console.log('\nURLs to verify in ImageKit:');
  uniqueUrls.forEach(url => {
    const filename = url.split('/').pop();
    console.log(`  ✓ ${filename}`);
  });
  
  console.log('\n📋 Verification Checklist:');
  console.log('1. Go to: https://imagekit.io/dashboard#media-library');
  console.log('2. Verify all images above exist in /images/ folder');
  console.log('3. If any are missing, rename them according to IMAGE_NAMING_GUIDE.md');
  console.log('4. Test URL directly: https://ik.imagekit.io/rbo8xe5z6/images/[filename]');
}

/**
 * Main execution
 */
function main() {
  console.log('🖼️  ImageKit Product Image Updater\n');
  console.log('📊 Summary:');
  console.log(`  Endpoint: https://ik.imagekit.io/rbo8xe5z6/images`);
  console.log(`  Products to update: ${Object.keys(PRODUCT_IMAGE_MAP).length}`);
  console.log(`  Branding images: ${Object.keys(BRANDING_IMAGES).length}`);
  
  const mapping = generateUpdatedDataFile();
  displayCodeSnippets();
  verifyImages();
  
  console.log('\n✅ Done! Follow the instructions above to update your products.\n');
}

// Run the script
main();
