const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use PRODUCTION database URL from Vercel environment
const DATABASE_URL = "postgresql://postgres.eketemhixkmvjrbiceym:mizerna5334@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=disable"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

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
    companyName: 'QART Team'
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
    companyName: ''
  }
]

async function seedProductionUsers() {
  console.log('🚀 Seeding PRODUCTION Supabase PostgreSQL database...')
  console.log('🔗 Database URL:', DATABASE_URL.substring(0, 50) + '...')
  
  // First, ensure default theme exists
  let defaultTheme = await prisma.theme.findFirst({
    where: { id: 'default' }
  })
  
  if (!defaultTheme) {
    defaultTheme = await prisma.theme.create({
      data: {
        id: 'default',
        name: 'Default Theme',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        font: 'Inter',
        layout: 'modern',
        isDefault: true
      }
    })
    console.log('✅ Created default theme in PRODUCTION')
  }
  
  // Clear existing users to prevent conflicts
  console.log('🧹 Clearing existing users...')
  await prisma.profile.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('✅ Users cleared')
  
  for (const userData of DEFAULT_USERS) {
    try {
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
      
      console.log(`✅ PRODUCTION user created: ${user.email} (${user.name})`)
      console.log(`🔐 Password hash: ${user.password.substring(0, 20)}...`)
      
      // Test password immediately
      const isValid = await bcrypt.compare(userData.password, user.password)
      console.log(`✅ Password "${userData.password}" valid: ${isValid}`)
      
    } catch (error) {
      console.error(`❌ Failed to create PRODUCTION user ${userData.email}:`, error.message)
    }
  }
  
  // Show final user count
  const userCount = await prisma.user.count()
  console.log(`📊 Total PRODUCTION users: ${userCount}`)
  
  // List all users for verification
  const allUsers = await prisma.user.findMany({
    select: {
      email: true,
      isAdmin: true,
      isActive: true
    }
  })
  
  console.log('📋 PRODUCTION Users:')
  allUsers.forEach(user => console.log(`  📧 ${user.email} (admin: ${user.isAdmin}, active: ${user.isActive})`))
  
  await prisma.$disconnect()
}

seedProductionUsers().catch((error) => {
  console.error('❌ PRODUCTION seeding failed:', error)
  process.exit(1)
})