#!/usr/bin/env node
/*
  One-time helper script to promote a user to ADMIN or SUPER_ADMIN in MongoDB (Prisma).

  Usage (PowerShell on Windows):
    # Ensure DATABASE_URL points to your Production DB before running
    # Example of loading from Vercel pulled file:
    #   cd nextjs
    #   vercel env pull .vercel/.env.production.local
    #   Get-Content .vercel/.env.production.local | ForEach-Object { if ($_ -match '^DATABASE_URL=(.*)$') { $env:DATABASE_URL=$matches[1] } }

    # Promote
    #   node scripts/promote-admin.js --email="admin@gaming-store.com" --role=SUPER_ADMIN

  Notes:
    - Valid roles: ADMIN, SUPER_ADMIN
    - Exits with non-zero code on failure
*/

const { PrismaClient } = require('@prisma/client');

function parseArgs(argv) {
  const args = {};
  for (const part of argv.slice(2)) {
    const m = part.match(/^--([^=]+)=(.*)$/);
    if (m) {
      args[m[1]] = m[2];
    } else if (part.startsWith('--')) {
      const key = part.slice(2);
      args[key] = true;
    }
  }
  return args;
}

function assertEnv() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set.');
    console.error('Set it to your Production MongoDB URL, or load it from .vercel/.env.production.local');
    process.exit(1);
  }
}

async function main() {
  assertEnv();

  const args = parseArgs(process.argv);
  const email = (args.email || args.e || '').trim();
  const role = ((args.role || args.r || 'SUPER_ADMIN') + '').trim().toUpperCase();

  if (!email) {
    console.error('Usage: node scripts/promote-admin.js --email="user@example.com" [--role=ADMIN|SUPER_ADMIN]');
    process.exit(1);
  }

  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    console.error('ERROR: role must be ADMIN or SUPER_ADMIN');
    process.exit(1);
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('ERROR: Invalid email format:', email);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    console.log('Connecting to database...');
    // Test a simple query to surface connection issues early
    await prisma.$queryRaw`db.runCommand({ ping: 1 })`;

    console.log(`Looking up user by email: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('ERROR: No user found with that email.');
      process.exit(1);
    }

    if (user.role === role) {
      console.log(`User already has role ${role}. Nothing to do.`);
      process.exit(0);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role, emailVerified: user.emailVerified ?? new Date() },
      select: { id: true, email: true, role: true, emailVerified: true }
    });

    console.log('SUCCESS: User promoted:', updated);
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
