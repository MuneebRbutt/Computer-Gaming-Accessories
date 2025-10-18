@echo off
echo ========================================
echo Setting up Vercel Environment Variables
echo ========================================
echo.

REM Navigate to nextjs directory
cd /d "C:\Users\Abdul Haseeb\Documents\GitHub\Computer-Gaming-Accessories\nextjs"

echo Adding NEXT_PUBLIC_IMAGEKIT_ENDPOINT...
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add NEXT_PUBLIC_IMAGEKIT_ENDPOINT production
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add NEXT_PUBLIC_IMAGEKIT_ENDPOINT preview
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add NEXT_PUBLIC_IMAGEKIT_ENDPOINT development

echo.
echo Adding NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY...
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY production
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY preview
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY development

echo.
echo Adding IMAGEKIT_URL_ENDPOINT...
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add IMAGEKIT_URL_ENDPOINT production
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add IMAGEKIT_URL_ENDPOINT preview
echo https://ik.imagekit.io/rbo8xe5z6 | vercel env add IMAGEKIT_URL_ENDPOINT development

echo.
echo Adding IMAGEKIT_PUBLIC_KEY...
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add IMAGEKIT_PUBLIC_KEY production
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add IMAGEKIT_PUBLIC_KEY preview
echo public_GSvFJmpaAJigfGPN3Xvewq7W9Ko= | vercel env add IMAGEKIT_PUBLIC_KEY development

echo.
echo ========================================
echo Environment Variables Setup Complete!
echo ========================================
echo.
echo Note: DATABASE_URL, NEXTAUTH_URL, and NEXTAUTH_SECRET already exist.
echo To update them, use: vercel env rm [name] production
echo Then add them again with: vercel env add [name] production
echo.
pause
