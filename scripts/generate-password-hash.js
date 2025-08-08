const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = [
    { email: 'admin@qart.app', password: 'admin123' },
    { email: 'demo@qart.app', password: 'demo123' }
  ];

  for (const { email, password } of passwords) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`${email}: ${hash}`);
  }
}

generateHashes();