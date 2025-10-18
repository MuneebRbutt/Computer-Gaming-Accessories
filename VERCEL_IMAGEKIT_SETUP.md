# 🚀 Vercel Environment Variables Setup

## ImageKit Configuration for Production

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: **nextjs**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Add each of these environment variables with the values below:

---

#### Variable 1: NEXT_PUBLIC_IMAGEKIT_ENDPOINT
```
Name: NEXT_PUBLIC_IMAGEKIT_ENDPOINT
Value: https://ik.imagekit.io/rbo8xe5z6
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### Variable 2: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
```
Name: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
Value: public_GSvFJmpaAJigfGPN3Xvewq7W9Ko=
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### Variable 3: IMAGEKIT_PRIVATE_KEY
```
Name: IMAGEKIT_PRIVATE_KEY
Value: private_xYRBc01/n84w+4OPMeSBN+sLClw=
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the **⋮** menu on the latest deployment
3. Click **Redeploy**
4. Your ImageKit integration will be live! 🎉

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Images load from `https://ik.imagekit.io/rbo8xe5z6/`
- [ ] Upload functionality works in admin panel
- [ ] Images are optimized to WebP/AVIF
- [ ] Page load times improved
- [ ] No console errors related to images

---

## 🔐 Security Notes

- ✅ Public key is safe to expose (starts with `public_`)
- ✅ Endpoint URL is public (it's in image URLs)
- ⚠️ Private key must be kept secret (only on server)
- ⚠️ Never commit private key to Git

---

## 📊 Current Configuration Summary

**Your ImageKit Setup:**
- Endpoint: https://ik.imagekit.io/rbo8xe5z6
- Status: ✅ Configured
- Package: ✅ Installed (imagekit@5.x)
- Local: ✅ Ready (.env.local configured)
- Vercel: ⏳ Pending (add env vars above)

---

## 🎯 Next Steps

1. **Add environment variables to Vercel** (follow steps above)
2. **Upload first product images** to ImageKit dashboard
3. **Test upload** using the admin panel
4. **Update products** with ImageKit URLs
5. **Monitor usage** in ImageKit dashboard

---

## 📞 Support

- ImageKit Dashboard: https://imagekit.io/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- ImageKit Docs: https://docs.imagekit.io/

**Need help?** Check the configuration test page at `/test/imagekit` after deployment.
