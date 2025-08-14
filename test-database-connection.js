const { PrismaClient } = require('@prisma/client')

// Direct connection string for testing
const connectionString = "postgresql://postgres.eketemhixkmvjrbiceym:mizerna5334@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=disable"

async function testDatabaseConnection() {
  console.log('🔗 Testing Prisma connection with direct URL...')
  console.log('Connection:', connectionString.replace(/:[^:@]*@/, ':***@'))
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  })
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Prisma connection successful!')
    
    // Count users
    const userCount = await prisma.user.count()
    console.log('👥 Total users in database:', userCount)
    
    // List users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isActive: true
      }
    })
    
    console.log('📊 Users in database:')
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name}) ${user.isAdmin ? '[ADMIN]' : ''} ${user.isActive ? '[ACTIVE]' : '[INACTIVE]'}`)
    })
    
    // Test admin user specifically
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@qart.app' },
      include: { profile: true }
    })
    
    if (admin) {
      console.log('🔑 Admin user found:', admin.name)
      console.log('📧 Email:', admin.email)
      console.log('🔐 Password hash exists:', !!admin.password)
    } else {
      console.log('❌ Admin user NOT found in database')
    }
    
    await prisma.$disconnect()
    return true
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    await prisma.$disconnect()
    return false
  }
}

testDatabaseConnection()