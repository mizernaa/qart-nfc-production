// Paylaşılan in-memory kullanıcı veritabanı
export const users = [
  {
    id: '1',
    email: 'admin@qart.app',
    password: '$2b$12$ytZ9fcLAUT6gxC5o5apJieamjQmhSGp0tm0tixm6YcPO6S6hDvQYy', // admin123
    name: 'Admin User',
    isAdmin: true,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'demo@qart.app',
    password: '$2b$12$mRqLcA5sPaXIXRj5Vi74LOvDC5ZpEC/pxvoUjLQxP28kCJmHi45dK', // demo123
    name: 'Demo User',
    isAdmin: false,
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
]