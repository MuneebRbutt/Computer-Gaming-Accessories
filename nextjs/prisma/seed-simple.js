const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seed (No-Transaction Mode)...')

  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gaming-store.com'
    const adminPassword = await bcrypt.hash('admin123', 12)

    console.log('Creating admin user...')
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        password: adminPassword,
        emailVerified: new Date()
      }
    })
    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    const categories = [
      {
        name: 'Gaming Laptops',
        slug: 'gaming-laptops',
        description: 'High-performance gaming laptops',
        icon: '💻',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Desktop PCs',
        slug: 'desktop-pcs',
        description: 'Custom and pre-built gaming PCs',
        icon: '🖥️',
        featured: true,
        sortOrder: 2
      },
      {
        name: 'Gaming Keyboards',
        slug: 'gaming-keyboards',
        description: 'Mechanical and gaming keyboards',
        icon: '⌨️',
        featured: true,
        sortOrder: 3
      },
      {
        name: 'Gaming Mice',
        slug: 'gaming-mice',
        description: 'Precision gaming mice',
        icon: '🖱️',
        featured: true,
        sortOrder: 4
      },
      {
        name: 'Headsets',
        slug: 'headsets',
        description: 'Gaming headsets and audio',
        icon: '🎧',
        featured: true,
        sortOrder: 5
      }
    ]

    console.log('Creating categories...')
    for (const category of categories) {
      await prisma.category.create({ data: category })
    }
    console.log('✅ Categories created')

    // Create brands
    const brands = [
      { name: 'MSI', slug: 'msi', featured: true },
      { name: 'Razer', slug: 'razer', featured: true },
      { name: 'Logitech', slug: 'logitech', featured: true },
      { name: 'HyperX', slug: 'hyperx', featured: true },
      { name: 'Samsung', slug: 'samsung', featured: true }
    ]

    console.log('Creating brands...')
    for (const brand of brands) {
      await prisma.brand.create({ data: brand })
    }
    console.log('✅ Brands created')

    // Get category and brand IDs for products
    const laptopCategory = await prisma.category.findUnique({ where: { slug: 'gaming-laptops' } })
    const keyboardCategory = await prisma.category.findUnique({ where: { slug: 'gaming-keyboards' } })
    const mouseCategory = await prisma.category.findUnique({ where: { slug: 'gaming-mice' } })
    const headsetCategory = await prisma.category.findUnique({ where: { slug: 'headsets' } })

    const msiBrand = await prisma.brand.findUnique({ where: { slug: 'msi' } })
    const razerBrand = await prisma.brand.findUnique({ where: { slug: 'razer' } })
    const logitechBrand = await prisma.brand.findUnique({ where: { slug: 'logitech' } })
    const hyperxBrand = await prisma.brand.findUnique({ where: { slug: 'hyperx' } })

    // Create sample products
    const products = [
      {
        title: 'MSI Gaming Laptop 15.6" RTX 4060',
        slug: 'msi-gaming-laptop-rtx4060',
        description: 'Unleash your gaming potential with this powerhouse MSI laptop featuring RTX 4060 graphics.',
        price: 345000,
        comparePrice: 380000,
        categoryId: laptopCategory?.id,
        brandId: msiBrand?.id,
        sku: 'MSI-GL66-RTX4060',
        images: [
          'https://ik.imagekit.io/advanceit/products/msi-gaming-laptop.jpg'
        ],
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
        featured: true,
        metaTitle: 'MSI Gaming Laptop RTX 4060 - Best Price Pakistan',
        metaDescription: 'Buy MSI Gaming Laptop with RTX 4060 at best price in Pakistan.'
      },
      {
        title: 'Razer BlackWidow V4 RGB Mechanical Keyboard',
        slug: 'razer-blackwidow-v4-rgb',
        description: 'Premium mechanical gaming keyboard with Razer Green switches and RGB lighting.',
        price: 12500,
        comparePrice: 15000,
        categoryId: keyboardCategory?.id,
        brandId: razerBrand?.id,
        sku: 'RZ03-BWID-RGB',
        images: [
          'https://ik.imagekit.io/advanceit/products/razer-blackwidow.jpg'
        ],
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
        categoryId: mouseCategory?.id,
        brandId: logitechBrand?.id,
        sku: 'LOG-GPRO-SL',
        images: [
          'https://ik.imagekit.io/advanceit/products/logitech-gpro.jpg'
        ],
        specifications: {
          'Sensor': 'HERO 25K',
          'DPI': '100-25,600',
          'Weight': '<63g',
          'Battery': '70+ hours'
        },
        tags: ['mouse', 'wireless', 'lightweight', 'competitive'],
        quantity: 30,
        weight: 63,
        status: 'ACTIVE',
        featured: true
      }
    ]

    console.log('Creating products...')
    for (const product of products) {
      if (product.categoryId && product.brandId) {
        await prisma.product.create({ data: product })
      }
    }
    console.log('✅ Products created')

    // Create site configuration
    const configs = [
      { key: 'site_name', value: 'Gaming Store Pro', type: 'STRING' },
      { key: 'site_description', value: 'Your ultimate gaming equipment destination', type: 'STRING' },
      { key: 'contact_email', value: 'contact@gaming-store.com', type: 'STRING' },
      { key: 'shipping_fee', value: '200', type: 'NUMBER' },
      { key: 'free_shipping_threshold', value: '5000', type: 'NUMBER' },
      { key: 'maintenance_mode', value: 'false', type: 'BOOLEAN' }
    ]

    console.log('Creating site configuration...')
    for (const config of configs) {
      await prisma.siteConfig.create({ data: config })
    }
    console.log('✅ Site configuration created')

    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('🔑 Admin Login Details:')
    console.log('Email: admin@gaming-store.com')
    console.log('Password: admin123')
    console.log('')
    console.log('🌐 Access Admin Panel:')
    console.log('URL: http://localhost:3000/admin')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Data already exists, skipping duplicates...')
      console.log('🎉 Database is ready!')
      console.log('')
      console.log('🔑 Admin Login Details:')
      console.log('Email: admin@gaming-store.com')
      console.log('Password: admin123')
      console.log('')
      console.log('🌐 Access Admin Panel:')
      console.log('URL: http://localhost:3000/admin')
    } else {
      throw error
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message)
    if (e.code === 'P2031') {
      console.log('')
      console.log('💡 MongoDB Replica Set Solution:')
      console.log('1. Stop MongoDB service')
      console.log('2. Edit mongod.cfg file and add:')
      console.log('   replication:')
      console.log('     replSetName: "rs0"')
      console.log('3. Restart MongoDB')
      console.log('4. Run: rs.initiate() in mongo shell')
      console.log('')
      console.log('Or use MongoDB Atlas for easier setup!')
    }
  })
  .finally(async () => {
    await prisma.$disconnect()
  })