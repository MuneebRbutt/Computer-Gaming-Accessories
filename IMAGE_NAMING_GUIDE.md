# 📸 Product Image Naming Guide & Mapping

## Your 23 Images - Proper Names

### Format: `{brand}-{product}-{variant}.png`

---

## 🎮 Complete Image Mapping

| Current Name (ImageKit) | New Proper Name | Product ID | Product Title |
|-------------------------|-----------------|------------|---------------|
| **Laptops & PCs** |
| `image (22).png` | `msi-gaming-laptop-rtx4060-front.png` | gaming-laptop-rtx4060 | MSI Gaming Laptop 15.6" RTX 4060 |
| `image (23).png` | `msi-gaming-laptop-rtx4060-side.png` | gaming-laptop-rtx4060 | Gallery image 2 |
| `image (24).png` | `custom-pc-ryzen7-5800x-front.png` | custom-pc-ryzen7 | Custom Gaming PC AMD Ryzen 7 |
| `image (25).png` | `custom-pc-ryzen7-5800x-rgb.png` | custom-pc-ryzen7 | Gallery image 2 |
| `image (26).png` | `custom-pc-ryzen7-5800x-inside.png` | custom-pc-ryzen7 | Gallery image 3 |
| **Keyboards** |
| `image (27).png` | `razer-blackwidow-v4-rgb.png` | razer-keyboard-rgb | Razer BlackWidow V4 RGB |
| `image (28).png` | `corsair-k100-rgb-keyboard.png` | (new product) | Corsair K100 RGB |
| `image (29).png` | `logitech-g915-tkl-keyboard.png` | (new product) | Logitech G915 TKL |
| **Mice** |
| `image (30).png` | `logitech-gpro-superlight-white.png` | logitech-mouse-gpro | Logitech G Pro X Superlight |
| `image (31).png` | `razer-deathadder-v3-black.png` | (new product) | Razer DeathAdder V3 |
| `image (32).png` | `corsair-sabre-rgb-pro.png` | (new product) | Corsair Sabre RGB Pro |
| **Headsets** |
| `image (33).png` | `hyperx-cloud3-wireless-black.png` | hyperx-headset-cloud3 | HyperX Cloud III Wireless |
| `image (34).png` | `razer-blackshark-v2-pro.png` | (new product) | Razer BlackShark V2 Pro |
| `image (35).png` | `steelseries-arctis-nova-7.png` | (new product) | SteelSeries Arctis Nova 7 |
| **Monitors** |
| `image (36).png` | `dell-s2722dgm-27-curved.png` | dell-monitor-27-165hz | Dell S2722DGM 27" 165Hz |
| `image (37).png` | `asus-rog-swift-pg27-4k.png` | (new product) | ASUS ROG Swift PG27 4K |
| `image (38).png` | `lg-ultragear-34-ultrawide.png` | (new product) | LG UltraGear 34" Ultrawide |
| **Components** |
| `image (39).png` | `nvidia-rtx4070-gpu-front.png` | (new product) | NVIDIA RTX 4070 GPU |
| `image (40).png` | `amd-ryzen9-7900x-cpu.png` | (new product) | AMD Ryzen 9 7900X CPU |
| `image (41).png` | `corsair-vengeance-rgb-32gb.png` | (new product) | Corsair Vengeance RGB 32GB |
| `image (42).png` | `samsung-980pro-ssd-1tb.png` | samsung-ssd-1tb | Samsung 980 PRO NVMe 1TB |
| **Branding** |
| `banner.png` | `advance-it-traders-hero-banner.png` | - | Homepage Banner |
| `logo.png` | `advance-it-traders-logo.png` | - | Company Logo |

---

## 📝 Quick Rename Instructions for ImageKit

### Step 1: Open ImageKit Dashboard
Go to: https://imagekit.io/dashboard#media-library

### Step 2: Navigate to `/images/` folder

### Step 3: Rename Each Image

Click on each image → Edit → Rename using the table above.

**Example:**
- Old: `image (22).png`
- New: `msi-gaming-laptop-rtx4060-front.png`

---

## 🤖 Alternative: Bulk Rename Script

If you want to rename all at once, use the ImageKit API (requires their SDK):

```javascript
// This script would rename all images programmatically
// Run: node scripts/rename-imagekit-images.js
```

---

## 📊 Organized by Category

### Laptops (2 images)
- `msi-gaming-laptop-rtx4060-front.png`
- `msi-gaming-laptop-rtx4060-side.png`

### Desktop PCs (3 images)
- `custom-pc-ryzen7-5800x-front.png`
- `custom-pc-ryzen7-5800x-rgb.png`
- `custom-pc-ryzen7-5800x-inside.png`

### Keyboards (3 images)
- `razer-blackwidow-v4-rgb.png`
- `corsair-k100-rgb-keyboard.png`
- `logitech-g915-tkl-keyboard.png`

### Mice (3 images)
- `logitech-gpro-superlight-white.png`
- `razer-deathadder-v3-black.png`
- `corsair-sabre-rgb-pro.png`

### Headsets (3 images)
- `hyperx-cloud3-wireless-black.png`
- `razer-blackshark-v2-pro.png`
- `steelseries-arctis-nova-7.png`

### Monitors (3 images)
- `dell-s2722dgm-27-curved.png`
- `asus-rog-swift-pg27-4k.png`
- `lg-ultragear-34-ultrawide.png`

### Components (4 images)
- `nvidia-rtx4070-gpu-front.png`
- `amd-ryzen9-7900x-cpu.png`
- `corsair-vengeance-rgb-32gb.png`
- `samsung-980pro-ssd-1tb.png`

### Branding (2 images)
- `advance-it-traders-hero-banner.png`
- `advance-it-traders-logo.png`

---

## ✅ Checklist

After renaming in ImageKit:

- [ ] All images renamed with proper names
- [ ] Images organized in `/images/` folder
- [ ] Test URLs work: `https://ik.imagekit.io/rbo8xe5z6/images/[filename]`
- [ ] Update product URLs in code
- [ ] Verify images load on website
- [ ] Deploy to Vercel

---

## 🔗 Final URLs After Rename

```
https://ik.imagekit.io/rbo8xe5z6/images/msi-gaming-laptop-rtx4060-front.png
https://ik.imagekit.io/rbo8xe5z6/images/custom-pc-ryzen7-5800x-front.png
https://ik.imagekit.io/rbo8xe5z6/images/razer-blackwidow-v4-rgb.png
https://ik.imagekit.io/rbo8xe5z6/images/logitech-gpro-superlight-white.png
https://ik.imagekit.io/rbo8xe5z6/images/hyperx-cloud3-wireless-black.png
https://ik.imagekit.io/rbo8xe5z6/images/dell-s2722dgm-27-curved.png
https://ik.imagekit.io/rbo8xe5z6/images/samsung-980pro-ssd-1tb.png
... and 16 more
```

---

Ready to proceed? I can update the code with these new names once you rename them in ImageKit!
