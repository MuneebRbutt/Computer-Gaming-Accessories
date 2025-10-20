#!/usr/bin/env node
/*
  Simple script to update user role directly in MongoDB
*/

const { PrismaClient } = require('@prisma/client');

async function updateUserRole() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating user role...');
    
    // Update the user role directly
    const result = await prisma.user.updateMany({
      where: { 
        email: 'bmuneeb882@gmail.com' 
      },
      data: { 
        role: 'SUPER_ADMIN' 
      }
    });
    
    console.log('✅ User role updated successfully!');
    console.log(`Updated ${result.count} user(s)`);
    console.log('Email: bmuneeb882@gmail.com');
    console.log('Role: SUPER_ADMIN');
    console.log('');
    console.log('You can now access the admin panel at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
