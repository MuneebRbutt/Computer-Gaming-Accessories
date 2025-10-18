# 🎯 COMPLETE IMAGE SETUP - Step by Step Guide

## ✅ What You Need To Do

### **Step 1: Rename Images in ImageKit Dashboard** (5-10 minutes)

Go to: https://imagekit.io/dashboard#media-library

Rename your 23 images according to this table:

| Old Name | → | New Name |
|----------|---|----------|
| `image (22).png` | → | `msi-gaming-laptop-rtx4060-front.png` |
| `image (23).png` | → | `msi-gaming-laptop-rtx4060-side.png` |
| `image (24).png` | → | `custom-pc-ryzen7-5800x-front.png` |
| `image (25).png` | → | `custom-pc-ryzen7-5800x-rgb.png` |
| `image (26).png` | → | `custom-pc-ryzen7-5800x-inside.png` |
| `image (27).png` | → | `razer-blackwidow-v4-rgb.png` |
| `image (28).png` | → | `corsair-k100-rgb-keyboard.png` |
| `image (29).png` | → | `logitech-g915-tkl-keyboard.png` |
| `image (30).png` | → | `logitech-gpro-superlight-white.png` |
| `image (31).png` | → | `razer-deathadder-v3-black.png` |
| `image (32).png` | → | `corsair-sabre-rgb-pro.png` |
| `image (33).png` | → | `hyperx-cloud3-wireless-black.png` |
| `image (34).png` | → | `razer-blackshark-v2-pro.png` |
| `image (35).png` | → | `steelseries-arctis-nova-7.png` |
| `image (36).png` | → | `dell-s2722dgm-27-curved.png` |
| `image (37).png` | → | `asus-rog-swift-pg27-4k.png` |
| `image (38).png` | → | `lg-ultragear-34-ultrawide.png` |
| `image (39).png` | → | `nvidia-rtx4070-gpu-front.png` |
| `image (40).png` | → | `amd-ryzen9-7900x-cpu.png` |
| `image (41).png` | → | `corsair-vengeance-rgb-32gb.png` |
| `image (42).png` | → | `samsung-980pro-ssd-1tb.png` |
| `banner.png` | → | `advance-it-traders-hero-banner.png` |
| `logo.png` | → | `advance-it-traders-logo.png` |

---

### **Step 2: Update Product URLs in Code** (Copy-Paste)

Open `lib/data.ts` and update these products:

#### **Product 1: gaming-laptop-rtx4060**
Find this line:
```typescript
id: 'gaming-laptop-rtx4060',
```

Replace the `image` and `gallery` with:
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-front.png',
gallery: [
  'https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-front.png',
  'https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-side.png'
],
```

---

#### **Product 2: custom-pc-ryzen7**
Find this line:
```typescript
id: 'custom-pc-ryzen7',
```

Replace with:
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-front.png',
gallery: [
  'https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-front.png',
  'https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-rgb.png',
  'https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-inside.png'
],
```

---

#### **Product 3: razer-keyboard-rgb**
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/razer-blackwidow-v4-rgb.png',
```

---

#### **Product 4: hyperx-headset-cloud3**
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/hyperx-cloud3-wireless-black.png',
```

---

#### **Product 5: logitech-mouse-gpro**
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/logitech-gpro-superlight-white.png',
```

---

#### **Product 6: dell-monitor-27-165hz**
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/dell-s2722dgm-27-curved.png',
```

---

#### **Product 7: samsung-ssd-1tb**
```typescript
image: 'https://ik.imagekit.io/rbo8xe5z6/images/samsung-980pro-ssd-1tb.png',
```

---

### **Step 3: Test Image URLs** (2 minutes)

Test each URL in your browser. They should all display images:

```
https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-front.png
https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-front.png
https://ik.imagekit.io/rbo8xe5z6/images/razer-blackwidow-v4-rgb.png
https://ik.imagekit.io/rbo8xe5z6/images/hyperx-cloud3-wireless-black.png
https://ik.imagekit.io/rbo8xe5z6/images/logitech-gpro-superlight-white.png
https://ik.imagekit.io/rbo8xe5z6/images/dell-s2722dgm-27-curved.png
https://ik.imagekit.io/rbo8xe5z6/images/samsung-980pro-ssd-1tb.png
```

**If any URL returns 404:**
- Go back to ImageKit dashboard
- Check spelling and file extension (.png vs .jpg)
- Make sure image is in `/images/` folder

---

### **Step 4: Test Locally** (1 minute)

```bash
cd nextjs
npm run dev
```

Visit: http://localhost:3000

Check if product images load correctly!

---

### **Step 5: Update Banner & Logo** (Optional)

Find these in your code and update:

**Hero Banner:**
```typescript
// In Hero component
backgroundImage: 'https://ik.imagekit.io/rbo8xe5z6/images/advance-it-traders-hero-banner.png'
```

**Logo:**
```typescript
// In Header component
src="/images/logo.png"  // Already works locally
// OR use ImageKit:
src="https://ik.imagekit.io/rbo8xe5z6/images/advance-it-traders-logo.png"
```

---

### **Step 6: Deploy to Vercel** (2 minutes)

```bash
git add .
git commit -m "Update all product images to ImageKit with proper names"
git push origin main
```

Vercel will auto-deploy! 🚀

---

## 📊 Summary

**Total images:** 23  
**Products updated:** 7  
**Branding images:** 2  

**Endpoint:** `https://ik.imagekit.io/rbo8xe5z6/images/`

**Status:**
- ✅ ImageKit configured
- ✅ Proper names generated
- ✅ URLs ready
- ⏳ Waiting for images to be renamed in ImageKit
- ⏳ Waiting for code to be updated

---

## 🎯 Quick Actions

### I'm ready! What should I do?

**Option 1: Rename manually** (Recommended for learning)
1. Open ImageKit dashboard
2. Rename 23 images one by one
3. Update code with snippets above
4. Test and deploy

**Option 2: I need help with renaming**
Tell me which images you can't find or rename, and I'll help!

**Option 3: Update code first, rename later**
I can update the code now, and you rename images in ImageKit at your own pace.

---

## ❓ FAQ

**Q: Do I need to rename ALL 23 images at once?**
A: No! Start with the 7 products that are currently in your code. Do the rest later.

**Q: What if I make a typo in the ImageKit name?**
A: No problem! Just update the URL in the code to match what you actually named it.

**Q: Can I use different names?**
A: Yes! Use any names you want, just make sure they match in both ImageKit and your code.

**Q: What about the remaining 16 images?**
A: Those are for future products. We can add them to your product list later.

---

## 🚀 Ready to Proceed?

Tell me:
1. **"I renamed images in ImageKit"** - I'll verify they work
2. **"Update the code for me"** - I'll update lib/data.ts automatically
3. **"I need help with [specific image]"** - I'll assist you
4. **"Show me a different naming convention"** - I'll suggest alternatives

What would you like to do? 🎮
