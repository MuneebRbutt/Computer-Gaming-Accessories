/**
 * ImageKit Upload Script
 * Upload local images to ImageKit CDN
 * 
 * Usage:
 * node scripts/upload-to-imagekit.js
 */

const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
});

/**
 * Upload a single file to ImageKit
 */
async function uploadFile(filePath, folder = 'products') {
  try {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    
    console.log(`Uploading: ${fileName}...`);
    
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: false, // Keep original name
      tags: ['product', 'gaming'],
      transformation: {
        pre: 'l-text,i-Gaming Store,fs-20,co-white,pa-10,l-end',
      }
    });
    
    console.log(`✅ Success: ${result.url}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Upload all images from a directory
 */
async function uploadDirectory(dirPath, folder = 'products') {
  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );
  
  console.log(`\nFound ${imageFiles.length} images in ${dirPath}`);
  console.log('Starting upload...\n');
  
  const results = [];
  
  for (const file of imageFiles) {
    const filePath = path.join(dirPath, file);
    const result = await uploadFile(filePath, folder);
    
    if (result) {
      results.push({
        original: filePath,
        url: result.url,
        fileId: result.fileId
      });
    }
    
    // Wait 500ms between uploads to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

/**
 * Generate mapping file for database update
 */
function generateMapping(results) {
  const mapping = {};
  
  results.forEach(result => {
    const fileName = path.basename(result.original);
    mapping[fileName] = result.url;
  });
  
  const outputPath = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  
  console.log(`\n✅ Mapping saved to: ${outputPath}`);
  return mapping;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 ImageKit Upload Script\n');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
      !process.env.IMAGEKIT_PRIVATE_KEY || 
      !process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT) {
    console.error('❌ Error: ImageKit credentials not found in environment variables');
    console.error('Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_ENDPOINT');
    process.exit(1);
  }
  
  // Upload from public/images directory
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Error: Directory not found: ${imagesDir}`);
    process.exit(1);
  }
  
  const results = await uploadDirectory(imagesDir, 'products');
  
  console.log(`\n✅ Upload complete!`);
  console.log(`Successfully uploaded: ${results.length} images`);
  
  // Generate mapping file
  const mapping = generateMapping(results);
  
  console.log('\n📋 Next steps:');
  console.log('1. Review image-mapping.json');
  console.log('2. Update product URLs in database');
  console.log('3. Test images on website');
  console.log('4. Delete local images after verification\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { uploadFile, uploadDirectory };
