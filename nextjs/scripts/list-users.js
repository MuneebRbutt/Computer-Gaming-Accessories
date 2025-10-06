const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, password: true, role: true, firstName: true, lastName: true, username: true } });
    console.log('Found users:', users.length);
    users.forEach(u => {
      console.log(JSON.stringify(u, null, 2));
    });
  } catch (err) {
    console.error('Error querying users:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
