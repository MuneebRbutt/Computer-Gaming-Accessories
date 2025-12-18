const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSimpleAdmin() {
  try {
    console.log('Creating simple admin user...')
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@yourdomain.com' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      console.log('Email:', existingAdmin.email)
      console.log('Role:', existingAdmin.role)
      return existingAdmin
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user using upsert instead of create (avoids transaction)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@yourdomain.com' },
      update: {},
      create: {
        email: 'admin@yourdomain.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        password: hashedPassword,
        emailVerified: new Date()
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('Email:', adminUser.email)
    console.log('Role:', adminUser.role)
    console.log('Password: admin123')
    
    return adminUser
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSimpleAdmin()
  .then(() => {
    console.log('\n🎉 Admin setup complete!')
    console.log('You can now login to the admin panel at: http://localhost:3000/admin')
    console.log('Email: admin@yourdomain.com')
    console.log('Password: admin123')
  })
  .catch((error) => {
    console.error('Setup failed:', error)
    process.exit(1)
  })