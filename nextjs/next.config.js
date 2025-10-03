/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'placehold.co','ui-avatars.com'],
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app',
  },
}

module.exports = nextConfig
