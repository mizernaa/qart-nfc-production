const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = {
    admin: 'SecureAdmin2025!',
    demo: 'DemoUser2025!',
    user: 'TestUser2025!'
  };

  console.log('-- Bcrypt hash\'lenmiş şifreler:');
  console.log('-- Bu SQL\'i Supabase SQL Editor\'de çalıştır:\n');
  
  for (const [user, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`-- ${user}: ${password}`);
    console.log(`-- Hash: ${hash}\n`);
  }

  console.log('-- SQL Update komutları:');
  const adminHash = await bcrypt.hash(passwords.admin, 12);
  const demoHash = await bcrypt.hash(passwords.demo, 12);
  const userHash = await bcrypt.hash(passwords.user, 12);

  console.log(`
UPDATE "User" SET password = '${adminHash}' WHERE email = 'admin@qart.app';
UPDATE "User" SET password = '${demoHash}' WHERE email = 'demo@qart.app';
UPDATE "User" SET password = '${userHash}' WHERE email = 'user@qart.app';
  `);
}

generateHashes();