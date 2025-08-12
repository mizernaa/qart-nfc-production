const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with test users...')

  // First create default theme
  const defaultTheme = await prisma.theme.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@qart.app' },
    update: {},
    create: {
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
    },
    include: {
      profile: true
    }
  })

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@qart.app' },
    update: {},
    create: {
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
    },
    include: {
      profile: true
    }
  })

  console.log('✅ Test users created:')
  console.log('- Admin:', adminUser.email, '/ admin123')
  console.log('- Demo:', demoUser.email, '/ demo123')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })