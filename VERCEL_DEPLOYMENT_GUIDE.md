# Vercel Deployment Guide

## 🚀 Complete Setup Instructions

### Step 1: Vercel Project Settings

1. **Go to Vercel Dashboard** → Select your project → Settings

2. **Build & Development Settings:**
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `nextjs` ⚠️ **IMPORTANT!**
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Step 2: Environment Variables

Go to **Settings → Environment Variables** and add the following:

#### Database Configuration
```
DATABASE_URL=mongodb+srv://hasee193293b_db_user:admin123@ait.klm73vq.mongodb.net/gaming_store
```

#### NextAuth Configuration
```
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=SECi5IU+Y1oloPfdi3MBQKkAUmgymU/k3dxGIBaQiDI=
```
⚠️ **Replace `your-project-name.vercel.app` with your actual Vercel URL!**

#### ImageKit Configuration
```
NEXT_PUBLIC_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/rbo8xe5z6
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_GSvFJmpaAJigfGPN3Xvewq7W9Ko=
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key-here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/rbo8xe5z6
IMAGEKIT_PUBLIC_KEY=public_GSvFJmpaAJigfGPN3Xvewq7W9Ko=
```
⚠️ **Get IMAGEKIT_PRIVATE_KEY from ImageKit Dashboard → Developer Options → API Keys**

### Step 3: MongoDB Atlas Network Access

1. Go to **MongoDB Atlas Dashboard**
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

⚠️ This allows Vercel's dynamic IPs to connect to your database.

### Step 4: Deploy

1. **Commit and Push Changes:**
   ```bash
   cd "C:\Users\Abdul Haseeb\Documents\GitHub\Computer-Gaming-Accessories"
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **Trigger Deployment:**
   - Vercel will automatically deploy when you push to GitHub
   - OR click "Redeploy" in Vercel Dashboard → Deployments → Three dots menu

### Step 5: Verify Deployment

After deployment completes:

1. ✅ Visit your site: `https://your-project-name.vercel.app`
2. ✅ Check homepage loads
3. ✅ Check products page: `/products`
4. ✅ Check images are loading from ImageKit
5. ✅ Check login/signup works

---

## 🔧 Troubleshooting

### Problem: 404 Error on Root URL

**Solution:** 
- Verify **Root Directory** is set to `nextjs` in Vercel settings
- Redeploy the project

### Problem: Database Connection Error

**Solution:**
- Check `DATABASE_URL` environment variable is correct
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB Atlas user has read/write permissions

### Problem: Images Not Loading

**Solution:**
- Verify ImageKit environment variables are set
- Check CORS settings in ImageKit Dashboard
- Make sure images exist in ImageKit media library

### Problem: NextAuth Error

**Solution:**
- Verify `NEXTAUTH_URL` matches your Vercel deployment URL
- Verify `NEXTAUTH_SECRET` is set
- Check all auth environment variables are added

---

## 📋 Environment Variables Checklist

Copy this checklist to Vercel Dashboard → Settings → Environment Variables:

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXT_PUBLIC_IMAGEKIT_ENDPOINT`
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- [ ] `IMAGEKIT_PRIVATE_KEY`
- [ ] `IMAGEKIT_URL_ENDPOINT`
- [ ] `IMAGEKIT_PUBLIC_KEY`

---

## 🎯 Quick Fix Summary

**The main issue:** Your Next.js app is in the `nextjs` folder, but Vercel was deploying from the root directory.

**The solution:** Set Root Directory to `nextjs` in Vercel project settings.

---

## 📞 Need Help?

If you're still seeing 404:
1. Check Vercel deployment logs for errors
2. Verify all environment variables are set
3. Make sure MongoDB Atlas network access allows 0.0.0.0/0
4. Try a fresh deployment after setting Root Directory

---

Generated on: October 18, 2025
