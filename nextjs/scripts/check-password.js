const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email: 'admin@yourdomain.com' } });
    if (!user) {
      console.log('Admin user not found');
      process.exit(1);
    }
    console.log('Found admin user. Verifying password...');
    const ok = await bcrypt.compare('admin123', user.password || '');
    console.log('Password match for admin@yourdomain.com:', ok);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
