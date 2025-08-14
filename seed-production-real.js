const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use ACTUAL PRODUCTION DATABASE_URL (the one Vercel is using)
const PRODUCTION_DATABASE_URL = "postgresql://postgres.eketemhixkmvjrbiceym:1wGBjApQjGVxwRG6@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=disable"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: PRODUCTION_DATABASE_URL
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

async function seedActualProductionDatabase() {
  console.log('🎯 Seeding ACTUAL PRODUCTION Supabase database (port 6543)...')
  console.log('🔗 Database URL:', PRODUCTION_DATABASE_URL.substring(0, 50) + '...')
  
  try {
    // Test connection first
    console.log('🔌 Testing connection...')
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    // Check if database has schema
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'User'
    `
    console.log('📊 User table exists:', tableCount[0].count > 0)
    
    if (tableCount[0].count === '0') {
      console.log('❌ Database schema missing! Need to push schema first.')
      return
    }
    
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
      console.log('✅ Created default theme in ACTUAL PRODUCTION')
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
        
        console.log(`✅ ACTUAL PRODUCTION user created: ${user.email}`)
        
        // Test password immediately
        const isValid = await bcrypt.compare(userData.password, user.password)
        console.log(`✅ Password "${userData.password}" valid: ${isValid}`)
        
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message)
      }
    }
    
    // Show final user count
    const userCount = await prisma.user.count()
    console.log(`📊 Total ACTUAL PRODUCTION users: ${userCount}`)
    
    // List all users for verification
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        isAdmin: true,
        isActive: true
      }
    })
    
    console.log('📋 ACTUAL PRODUCTION Users:')
    allUsers.forEach(user => console.log(`  📧 ${user.email} (admin: ${user.isAdmin})`))
    
  } catch (error) {
    console.error('❌ Connection or seeding error:', error.message)
    
    if (error.message.includes('schema')) {
      console.log('💡 Solution: Push schema first with correct URL')
      console.log(`TEMPORARY_DATABASE_URL="${PRODUCTION_DATABASE_URL}" npx prisma db push`)
    }
  } finally {
    await prisma.$disconnect()
  }
}

seedActualProductionDatabase()