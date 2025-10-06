const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Configure Prisma to work without transactions
const prisma = new PrismaClient({
  // Disable transactions for MongoDB standalone
  transactionOptions: {
    maxWait: 2000,
    timeout: 5000,
  },
})

async function createWithRetry(model, data, identifier) {
  try {
    // Try to find existing record first
    const existing = await model.findUnique({ where: identifier })
    if (existing) {
      console.log(`✅ ${existing.name || existing.title || existing.email || existing.key} already exists`)
      return existing
    }
    
    // Create new record
    const created = await model.create({ data })
    console.log(`✅ Created: ${created.name || created.title || created.email || created.key}`)
    return created
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`⚠️  ${data.name || data.title || data.email || data.key} already exists (duplicate key)`)
      return await model.findUnique({ where: identifier })
    }
    throw error
  }
}

async function main() {
  console.log('🚀 Starting database seed (Standalone MongoDB Mode)...')
  console.log('')

  try {
    // 1. Create admin user
    console.log('👤 Creating admin user...')
    const adminEmail = 'admin@gaming-store.com'
    const adminPassword = await bcrypt.hash('admin123', 12)

    const adminUser = await createWithRetry(
      prisma.user,
      {
        email: adminEmail,
        firstName: 'Gaming',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        password: adminPassword,
        emailVerified: new Date()
      },
      { email: adminEmail }
    )

    // 2. Create categories
    console.log('')
    console.log('📁 Creating categories...')
    const categoryData = [
      { name: 'Gaming Laptops', slug: 'gaming-laptops', icon: '💻', featured: true, sortOrder: 1 },
      { name: 'Desktop PCs', slug: 'desktop-pcs', icon: '🖥️', featured: true, sortOrder: 2 },
      { name: 'Gaming Keyboards', slug: 'gaming-keyboards', icon: '⌨️', featured: true, sortOrder: 3 },
      { name: 'Gaming Mice', slug: 'gaming-mice', icon: '🖱️', featured: true, sortOrder: 4 },
      { name: 'Headsets', slug: 'headsets', icon: '🎧', featured: true, sortOrder: 5 }
    ]

    const categories = {}
    for (const cat of categoryData) {
      categories[cat.slug] = await createWithRetry(
        prisma.category,
        cat,
        { slug: cat.slug }
      )
    }

    // 3. Create brands
    console.log('')
    console.log('🏷️  Creating brands...')
    const brandData = [
      { name: 'MSI', slug: 'msi', featured: true },
      { name: 'Razer', slug: 'razer', featured: true },
      { name: 'Logitech', slug: 'logitech', featured: true },
      { name: 'HyperX', slug: 'hyperx', featured: true },
      { name: 'Samsung', slug: 'samsung', featured: true }
    ]

    const brands = {}
    for (const brand of brandData) {
      brands[brand.slug] = await createWithRetry(
        prisma.brand,
        brand,
        { slug: brand.slug }
      )
    }

    // 4. Create products
    console.log('')
    console.log('🎮 Creating products...')
    const productData = [
      {
        title: 'MSI Gaming Laptop 15.6" RTX 4060',
        slug: 'msi-gaming-laptop-rtx4060',
        description: 'Unleash your gaming potential with this powerhouse MSI laptop featuring RTX 4060 graphics.',
        price: 345000,
        comparePrice: 380000,
        categoryId: categories['gaming-laptops']?.id,
        brandId: brands['msi']?.id,
        sku: 'MSI-GL66-RTX4060',
        images: ['https://ik.imagekit.io/advanceit/products/msi-gaming-laptop.jpg'],
        specifications: {
          'Processor': 'Intel Core i7-13700H',
          'Graphics': 'NVIDIA GeForce RTX 4060 8GB',
          'Memory': '16GB DDR5-4800',
          'Storage': '1TB NVMe PCIe 4.0 SSD',
          'Display': '15.6" FHD 144Hz IPS'
        },
        tags: ['gaming', 'laptop', 'rtx', 'msi'],
        quantity: 15,
        weight: 2400,
        status: 'ACTIVE',
        featured: true
      },
      {
        title: 'Razer BlackWidow V4 RGB Mechanical Keyboard',
        slug: 'razer-blackwidow-v4-rgb',
        description: 'Premium mechanical gaming keyboard with Razer Green switches and RGB lighting.',
        price: 12500,
        comparePrice: 15000,
        categoryId: categories['gaming-keyboards']?.id,
        brandId: brands['razer']?.id,
        sku: 'RZ03-BWID-RGB',
        images: ['https://ik.imagekit.io/advanceit/products/razer-blackwidow.jpg'],
        specifications: {
          'Switches': 'Razer Green Tactile',
          'Layout': 'Full-size (104 keys)',
          'Lighting': 'Razer Chroma RGB',
          'Connection': 'USB-C Detachable'
        },
        tags: ['keyboard', 'rgb', 'mechanical', 'razer'],
        quantity: 25,
        weight: 1200,
        status: 'ACTIVE',
        featured: true
      },
      {
        title: 'Logitech G Pro X Superlight Wireless Gaming Mouse',
        slug: 'logitech-gpro-superlight',
        description: 'Ultra-lightweight wireless gaming mouse with HERO 25K sensor.',
        price: 6500,
        categoryId: categories['gaming-mice']?.id,
        brandId: brands['logitech']?.id,
        sku: 'LOG-GPRO-SL',
        images: ['https://ik.imagekit.io/advanceit/products/logitech-gpro.jpg'],
        specifications: {
          'Sensor': 'HERO 25K',
          'DPI': '100-25,600',
          'Weight': '<63g',
          'Battery': '70+ hours'
        },
        tags: ['mouse', 'wireless', 'lightweight'],
        quantity: 30,
        weight: 63,
        status: 'ACTIVE',
        featured: true
      }
    ]

    for (const product of productData) {
      if (product.categoryId && product.brandId) {
        await createWithRetry(
          prisma.product,
          product,
          { slug: product.slug }
        )
      }
    }

    // 5. Create site configuration
    console.log('')
    console.log('⚙️  Creating site configuration...')
    const configData = [
      { key: 'site_name', value: 'Gaming Store Pro', type: 'STRING' },
      { key: 'site_description', value: 'Your ultimate gaming equipment destination', type: 'STRING' },
      { key: 'contact_email', value: 'contact@gaming-store.com', type: 'STRING' },
      { key: 'shipping_fee', value: '200', type: 'NUMBER' },
      { key: 'free_shipping_threshold', value: '5000', type: 'NUMBER' },
      { key: 'maintenance_mode', value: 'false', type: 'BOOLEAN' }
    ]

    for (const config of configData) {
      await createWithRetry(
        prisma.siteConfig,
        config,
        { key: config.key }
      )
    }

    console.log('')
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎯 ADMIN PANEL ACCESS:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🌐 URL: http://localhost:3000/admin')
    console.log('📧 Email: admin@gaming-store.com')
    console.log('🔑 Password: admin123')
    console.log('')
    console.log('🚀 Next Steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Open browser: http://localhost:3000/admin')
    console.log('3. Login with the credentials above')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (error) {
    console.error('❌ Seed failed:', error.message)
    
    if (error.message.includes('Server selection timeout')) {
      console.log('')
      console.log('💡 MongoDB Connection Issue:')
      console.log('1. Make sure MongoDB service is running: net start MongoDB')
      console.log('2. Check if port 27017 is accessible')
      console.log('3. Try restarting MongoDB service')
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })