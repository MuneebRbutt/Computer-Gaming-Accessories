# VERCEL SETUP - COPY & PASTE GUIDE

## 🎯 STEP 1: SET ROOT DIRECTORY IN VERCEL

**THIS IS THE MOST IMPORTANT STEP - Without this, you'll get 404!**

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Click **Settings** tab
4. Scroll to **"Build & Development Settings"**
5. Click **Edit** next to "Root Directory"
6. Type: `nextjs`
7. Click **Save**

---

## 🎯 STEP 2: ADD ENVIRONMENT VARIABLES

Go to: **Settings** → **Environment Variables**

Click **Add New** and copy-paste each variable below:

### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: mongodb+srv://hasee193293b_db_user:admin123@ait.klm73vq.mongodb.net/gaming_store
Environment: Production, Preview, Development (check all)
```

### Variable 2: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://your-vercel-url.vercel.app
Environment: Production (check only Production)
```
⚠️ **IMPORTANT:** Replace `your-vercel-url.vercel.app` with your ACTUAL Vercel URL!
You can find it in the Deployments tab or Domains settings.

### Variable 3: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: SECi5IU+Y1oloPfdi3MBQKkAUmgymU/k3dxGIBaQiDI=
Environment: Production, Preview, Development (check all)
```

### Variable 4: NEXT_PUBLIC_IMAGEKIT_ENDPOINT
```
Name: NEXT_PUBLIC_IMAGEKIT_ENDPOINT
Value: https://ik.imagekit.io/rbo8xe5z6
Environment: Production, Preview, Development (check all)
```

### Variable 5: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
```
Name: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
Value: public_GSvFJmpaAJigfGPN3Xvewq7W9Ko=
Environment: Production, Preview, Development (check all)
```

### Variable 6: IMAGEKIT_URL_ENDPOINT
```
Name: IMAGEKIT_URL_ENDPOINT
Value: https://ik.imagekit.io/rbo8xe5z6
Environment: Production, Preview, Development (check all)
```

### Variable 7: IMAGEKIT_PUBLIC_KEY
```
Name: IMAGEKIT_PUBLIC_KEY
Value: public_GSvFJmpaAJigfGPN3Xvewq7W9Ko=
Environment: Production, Preview, Development (check all)
```

### Variable 8: IMAGEKIT_PRIVATE_KEY (OPTIONAL - for admin uploads)
```
Name: IMAGEKIT_PRIVATE_KEY
Value: [GET THIS FROM IMAGEKIT DASHBOARD]
Environment: Production, Preview, Development (check all)
```

To get ImageKit Private Key:
1. Go to: https://imagekit.io/dashboard
2. Click **Developer Options** (left sidebar)
3. Click **API Keys**
4. Copy the **Private Key** (starts with `private_`)
5. Paste it in Vercel

---

## 🎯 STEP 3: MONGODB ATLAS NETWORK ACCESS

1. Go to: https://cloud.mongodb.com
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address** button
4. Select **"Allow Access from Anywhere"**
5. Confirm IP: `0.0.0.0/0`
6. Click **Confirm**

This allows Vercel servers to connect to your database.

---

## 🎯 STEP 4: REDEPLOY

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **3 dots** menu (⋯)
4. Click **Redeploy**
5. Wait for deployment to finish

---

## ✅ VERIFICATION CHECKLIST

After deployment completes:

- [ ] Visit your Vercel URL - should see homepage (not 404)
- [ ] Homepage loads with proper layout
- [ ] Products page works: `/products`
- [ ] Images load from ImageKit
- [ ] No console errors in browser (F12)

---

## 🔴 IF YOU STILL SEE 404:

1. **Check Root Directory is set to `nextjs`**
   - Settings → Build & Development Settings → Root Directory
   
2. **Check Build Logs**
   - Deployments → Click on deployment → View Function Logs
   - Look for errors

3. **Verify Environment Variables**
   - Settings → Environment Variables
   - Make sure all 7-8 variables are added
   - Make sure NEXTAUTH_URL has your actual Vercel URL

---

## 📱 QUICK COPY-PASTE FOR ALL VARIABLES

If Vercel allows bulk import, use this format:

```
DATABASE_URL="mongodb+srv://hasee193293b_db_user:admin123@ait.klm73vq.mongodb.net/gaming_store"
NEXTAUTH_URL="https://your-vercel-url.vercel.app"
NEXTAUTH_SECRET="SECi5IU+Y1oloPfdi3MBQKkAUmgymU/k3dxGIBaQiDI="
NEXT_PUBLIC_IMAGEKIT_ENDPOINT="https://ik.imagekit.io/rbo8xe5z6"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_GSvFJmpaAJigfGPN3Xvewq7W9Ko="
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/rbo8xe5z6"
IMAGEKIT_PUBLIC_KEY="public_GSvFJmpaAJigfGPN3Xvewq7W9Ko="
```

---

**That's it! Your site should work after these steps.** 🚀

The 404 error will be fixed once you set the Root Directory to `nextjs`.
