#!/usr/bin/env node
/*
  Simple script to create an admin user for testing the admin panel
*/

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Creating admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('You can use this email to login to the admin panel.');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@gamingstore.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@gamingstore.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');
    console.log('');
    console.log('You can now login to the admin panel at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
