/**
 * Update Product Images to use ImageKit CDN
 * This script updates all product image URLs in data.ts to use your ImageKit endpoint
 */

const fs = require('fs');
const path = require('path');

// Your ImageKit endpoint
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/rbo8xe5z6';

// Image mapping - map your uploaded images to product names
const IMAGE_MAPPING = {
  // Gaming PCs & Laptops
  'image (22).png': 'gaming-laptop-1.png',
  'image (23).png': 'gaming-laptop-2.png',
  'image (24).png': 'gaming-pc-1.png',
  'image (25).png': 'gaming-pc-2.png',
  'image (26).png': 'custom-pc-1.png',
  
  // Keyboards
  'image (27).png': 'keyboard-razer-1.png',
  'image (28).png': 'keyboard-corsair-1.png',
  'image (29).png': 'keyboard-logitech-1.png',
  
  // Mice
  'image (30).png': 'mouse-logitech-1.png',
  'image (31).png': 'mouse-razer-1.png',
  'image (32).png': 'mouse-corsair-1.png',
  
  // Headsets
  'image (33).png': 'headset-hyperx-1.png',
  'image (34).png': 'headset-razer-1.png',
  'image (35).png': 'headset-steelseries-1.png',
  
  // Monitors
  'image (36).png': 'monitor-dell-1.png',
  'image (37).png': 'monitor-asus-1.png',
  'image (38).png': 'monitor-lg-1.png',
  
  // Components
  'image (39).png': 'gpu-rtx4070-1.png',
  'image (40).png': 'cpu-ryzen-1.png',
  'image (41).png': 'ram-corsair-1.png',
  'image (42).png': 'ssd-samsung-1.png',
  
  // Branding
  'banner.png': 'banner.png',
  'logo.png': 'logo.png'
};

// Product to image mapping
const PRODUCT_IMAGES = {
  'gaming-laptop-rtx4060': ['image (22).png', 'image (23).png'],
  'custom-pc-ryzen7': ['image (24).png', 'image (25).png', 'image (26).png'],
  'razer-keyboard-rgb': ['image (27).png'],
  'hyperx-headset-cloud3': ['image (33).png'],
  'logitech-mouse-gpro': ['image (30).png'],
  'dell-monitor-27-165hz': ['image (36).png'],
  'samsung-ssd-1tb': ['image (42).png'],
  'corsair-ram-32gb': ['image (41).png'],
  'ryzen9-cpu': ['image (40).png'],
  'rtx4070-gpu': ['image (39).png'],
  'asus-monitor-4k': ['image (37).png'],
  'lg-ultrawide-34': ['image (38).png'],
  'steelseries-headset': ['image (35).png'],
  'razer-deathadder': ['image (31).png'],
  'corsair-mouse': ['image (32).png'],
  'corsair-keyboard': ['image (28).png'],
  'logitech-keyboard': ['image (29).png'],
  'razer-headset': ['image (34).png']
};

/**
 * Generate ImageKit URL from filename
 */
function getImageKitUrl(filename) {
  // Clean filename
  const cleanName = IMAGE_MAPPING[filename] || filename;
  // Return full ImageKit URL
  return `${IMAGEKIT_ENDPOINT}/images/${encodeURIComponent(cleanName)}`;
}

/**
 * Generate product image URLs
 */
function generateProductImageUrls(productId) {
  const imageFiles = PRODUCT_IMAGES[productId] || [];
  
  if (imageFiles.length === 0) {
    // Default placeholder
    return {
      image: `${IMAGEKIT_ENDPOINT}/images/placeholder-product.png`,
      gallery: []
    };
  }
  
  const urls = imageFiles.map(getImageKitUrl);
  
  return {
    image: urls[0], // First image as main
    gallery: urls   // All images for gallery
  };
}

/**
 * Generate JSON mapping for easy copy-paste
 */
function generateMapping() {
  console.log('\n🎨 ImageKit URL Mapping Generated!\n');
  console.log('Copy these URLs into your data.ts file:\n');
  console.log('─'.repeat(80));
  
  Object.keys(PRODUCT_IMAGES).forEach(productId => {
    const { image, gallery } = generateProductImageUrls(productId);
    
    console.log(`\n${productId}:`);
    console.log(`  image: '${image}'`);
    
    if (gallery.length > 1) {
      console.log(`  gallery: [`);
      gallery.forEach((url, index) => {
        console.log(`    '${url}'${index < gallery.length - 1 ? ',' : ''}`);
      });
      console.log(`  ]`);
    }
  });
  
  console.log('\n' + '─'.repeat(80));
  console.log('\n📸 All Images:');
  console.log('─'.repeat(80));
  
  Object.keys(IMAGE_MAPPING).forEach(originalName => {
    const url = getImageKitUrl(originalName);
    console.log(`${originalName.padEnd(30)} → ${url}`);
  });
  
  console.log('\n✅ Done! Copy the URLs above into your data.ts file.');
  console.log('\n💡 Tip: Use find & replace to update old ImageKit URLs:');
  console.log('   Find:    https://ik.imagekit.io/advanceit');
  console.log('   Replace: https://ik.imagekit.io/rbo8xe5z6');
}

/**
 * Export as JSON file
 */
function exportToJson() {
  const mapping = {};
  
  Object.keys(PRODUCT_IMAGES).forEach(productId => {
    mapping[productId] = generateProductImageUrls(productId);
  });
  
  const outputPath = path.join(__dirname, 'imagekit-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  
  console.log(`\n📁 Mapping saved to: ${outputPath}`);
}

// Run the script
console.log('🖼️  ImageKit URL Generator for Gaming Store\n');
console.log(`Endpoint: ${IMAGEKIT_ENDPOINT}`);
console.log(`Images folder: /images/`);
console.log(`Total products: ${Object.keys(PRODUCT_IMAGES).length}`);

generateMapping();
exportToJson();

console.log('\n🚀 Next Steps:');
console.log('1. Verify images are uploaded to ImageKit at: /images/ folder');
console.log('2. Copy the URLs above into your data.ts file');
console.log('3. Test the images load correctly on your website');
console.log('4. Commit and deploy to Vercel\n');
