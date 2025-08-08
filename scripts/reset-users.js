const fs = require('fs');
const path = require('path');

// Reset users to only admin and demo
const resetData = {
  users: [
    {
      id: '1',
      email: 'admin@qart.app',
      password: '$2b$12$gGAbDTg.q9wBElTchW9CB.mUbQ880qTZlkp65KSwTcPJSLL8sYkPy', // admin123
      name: 'Admin User',
      isAdmin: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      email: 'demo@qart.app',
      password: '$2b$12$YR/Qq7LByMYjyVXrLrioA.qfjcgYqA20DnrkZS/EpuluUliQ.5mWO', // demo123
      name: 'Demo User',
      isAdmin: false,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};

// Update users-db.json
const dbPath = path.join(__dirname, '..', 'lib', 'users-db.json');
fs.writeFileSync(dbPath, JSON.stringify(resetData, null, 2));
console.log('✅ Users database reset. Only admin@qart.app and demo@qart.app remain.');
console.log('Total users: 2');