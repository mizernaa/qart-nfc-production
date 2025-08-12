const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    console.log('🚀 Initializing database for production...')

    // Check if database is already initialized
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      console.log('✅ Database already initialized with', userCount, 'users')
      return
    }

    // Create default theme first
    console.log('🎨 Creating default theme...')
    const defaultTheme = await prisma.theme.create({
      data: {
        id: 'default',
        name: 'Varsayılan',
        primaryColor: '#3B82F6',
        secondaryColor: '#EF4444',
        backgroundColor: '#FFFFFF',
        textColor: '#111827',
        font: 'Inter',
        layout: 'modern',
        isDefault: true
      }
    })

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12)
    const demoPassword = await bcrypt.hash('demo123', 12)

    // Create admin user
    console.log('👤 Creating admin user...')
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@qart.app',
        password: adminPassword,
        name: 'Admin User',
        isAdmin: true,
        isActive: true,
        profile: {
          create: {
            slug: 'admin-user',
            companyName: 'QART Team',
            title: 'Sistem Yöneticisi',
            bio: 'QART NFC sistemi yöneticisi',
            phone: '+90 555 000 0001',
            email: 'admin@qart.app',
            themeId: 'default'
          }
        }
      }
    })

    // Create demo user
    console.log('👤 Creating demo user...')
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@qart.app',
        password: demoPassword,
        name: 'Demo User',
        isAdmin: false,
        isActive: true,
        profile: {
          create: {
            slug: 'demo-user',
            companyName: 'Demo Şirket',
            title: 'Demo Kullanıcı',
            bio: 'QART demo kullanıcısı',
            phone: '+90 555 000 0002',
            email: 'demo@qart.app',
            themeId: 'default'
          }
        }
      }
    })

    console.log('✅ Database initialized successfully!')
    console.log('- Admin:', adminUser.email)
    console.log('- Demo:', demoUser.email)

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}

module.exports = { initDatabase }