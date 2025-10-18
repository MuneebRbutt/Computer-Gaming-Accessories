# ImageKit Setup Guide for Gaming Store

## Step 1: Create ImageKit Account (5 minutes)

1. Go to https://imagekit.io/registration
2. Sign up with your email (or GitHub)
3. Create a new project: "Gaming-Store"
4. Get your credentials from Dashboard → Settings → API Keys

## Step 2: Get Your Credentials

You'll need these 3 values:

```
URL Endpoint: https://ik.imagekit.io/YOUR_ID/
Public Key: public_xxxxxxxxxxx
Private Key: private_xxxxxxxxxxx
```

## Step 3: Add to Environment Variables

### Local Development (.env.local)
```bash
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/YOUR_ID
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxx
```

### Vercel Production
1. Go to Vercel Dashboard
2. Select your project: nextjs
3. Settings → Environment Variables
4. Add these 3 variables (mark as Production, Preview, Development)

## Step 4: Folder Structure in ImageKit

Create these folders in ImageKit Media Library:

```
/products/
  /gaming-pcs/
  /laptops/
  /keyboards/
  /mice/
  /headsets/
  /monitors/
  /components/
  /accessories/
/brands/
/categories/
/banners/
/users/
```

## Step 5: Image Naming Convention

**Format:** `{category}-{brand}-{sku}-{variant}.{ext}`

Examples:
```
gaming-pc-alienware-AW2023-front.webp
keyboard-razer-BW-V3-rgb.webp
mouse-logitech-G502-top.jpg
```

## Step 6: Upload Methods

### Method 1: ImageKit Dashboard (Manual Upload)
1. Open Media Library
2. Click "Upload"
3. Drag & drop images
4. Organize into folders

### Method 2: API Upload (Programmatic)
See: `scripts/upload-to-imagekit.js`

### Method 3: Bulk Upload
Use ImageKit CLI or our custom script

## Free Tier Limits

- ✅ 20 GB Media Storage
- ✅ 20 GB Bandwidth per month
- ✅ Unlimited transformations
- ✅ Unlimited requests

**Estimate:** 
- 2000 images at 10KB each = 20MB
- 200 images at 100KB each = 20MB
- You can store ~2000-5000 product images

## Image Optimization Best Practices

1. **Upload Format:** Upload PNG or JPEG (ImageKit auto-converts)
2. **Recommended Size:** 1200x1200px for product images
3. **Max File Size:** Keep under 500KB before upload
4. **Quality:** Upload at 90-95% quality (ImageKit optimizes further)
5. **Naming:** Use descriptive, SEO-friendly names

## Current vs Optimized

### Without ImageKit:
```jsx
<Image 
  src="/images/product.png" 
  alt="Product"
  width={600}
  height={600}
/>
```
- File size: 500KB
- Format: PNG
- Load time: 3-5 seconds

### With ImageKit:
```jsx
<Image 
  src="https://ik.imagekit.io/gaming-store/products/product.png" 
  alt="Product"
  width={600}
  height={600}
/>
```
- File size: 50KB (10x smaller)
- Format: WebP (auto)
- Load time: 0.3-0.5 seconds (10x faster)

## Next Steps

1. ✅ Sign up for ImageKit
2. ✅ Get credentials and add to .env.local
3. ✅ Create folder structure
4. ✅ Upload first 10 test images
5. ✅ Test with one product
6. ✅ Migrate all existing images
7. ✅ Deploy to Vercel with env vars

## Support

- ImageKit Docs: https://docs.imagekit.io/
- Dashboard: https://imagekit.io/dashboard
- Support: support@imagekit.io
