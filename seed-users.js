const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const DEFAULT_USERS = [
  {
    id: 'admin-001',
    email: 'admin@qart.app',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true,
    slug: 'admin-user',
    title: 'Sistem Yöneticisi',
    bio: 'QART Sistem Yöneticisi',
    phone: '+90 555 000 0001',
    companyName: 'QART Team',
    subscription: 'QART Lifetime'
  },
  {
    id: 'demo-001', 
    email: 'demo@qart.app',
    password: 'demo123',
    name: 'Demo User',
    isAdmin: false,
    slug: 'demo-user',
    title: 'Demo Kullanıcısı',
    bio: 'QART Demo Kullanıcısı',
    phone: '+90 555 000 0002',
    companyName: '',
    subscription: 'Free'
  }
]

async function seedUsers() {
  console.log('🌱 Seeding PostgreSQL database with default users...')
  
  for (const userData of DEFAULT_USERS) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (existingUser) {
        console.log(`👤 User ${userData.email} already exists, skipping...`)
        continue
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      // Create user with profile
      const user = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          isAdmin: userData.isAdmin,
          isActive: true,
          emailVerified: true,
          createdAt: new Date('2025-01-01T00:00:00.000Z'),
          profile: {
            create: {
              slug: userData.slug,
              title: userData.title,
              bio: userData.bio,
              phone: userData.phone,
              companyName: userData.companyName
            }
          }
        },
        include: {
          profile: true
        }
      })
      
      console.log(`✅ Created user: ${user.email} (${user.name})`)
      
    } catch (error) {
      console.error(`❌ Failed to create user ${userData.email}:`, error.message)
    }
  }
  
  // Show final user count
  const userCount = await prisma.user.count()
  console.log(`📊 Total users in database: ${userCount}`)
  
  await prisma.$disconnect()
}

seedUsers().catch((error) => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})