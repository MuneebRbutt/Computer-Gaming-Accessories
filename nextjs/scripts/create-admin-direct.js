const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createAdminDirectly() {
  const client = new MongoClient('mongodb://localhost:27017/gaming_ecommerce')
  
  try {
    console.log('🚀 Connecting to MongoDB...')
    await client.connect()
    
    const db = client.db('gaming_ecommerce')
    const usersCollection = db.collection('User')
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ 
      email: 'admin@yourdomain.com' 
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('Email:', existingAdmin.email)
      console.log('Role:', existingAdmin.role)
      return existingAdmin
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user directly in MongoDB
    const adminUser = {
      id: new Date().getTime().toString(),
      email: 'admin@yourdomain.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      password: hashedPassword,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await usersCollection.insertOne(adminUser)
    console.log('✅ Admin user created successfully!')
    console.log('ID:', result.insertedId)
    console.log('Email: admin@yourdomain.com')
    console.log('Password: admin123')
    console.log('Role: SUPER_ADMIN')
    
    return adminUser
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    await client.close()
  }
}

createAdminDirectly()
  .then(() => {
    console.log('\n🎉 SUCCESS! Admin panel is ready!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🌐 Admin Panel: http://localhost:3000/admin')
    console.log('📧 Email: admin@yourdomain.com')
    console.log('🔑 Password: admin123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })