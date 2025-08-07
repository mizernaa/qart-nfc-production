import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating secure users...')

  // Admin kullanıcı
  const adminPassword = await hashPassword('SecureAdmin2025!')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@qart.app' },
    update: {},
    create: {
      email: 'admin@qart.app',
      password: adminPassword,
      name: 'Admin User',
      isAdmin: true,
      isActive: true,
      emailVerified: true,
    },
  })

  // Demo kullanıcı  
  const demoPassword = await hashPassword('DemoUser2025!')
  const demo = await prisma.user.upsert({
    where: { email: 'demo@qart.app' },
    update: {},
    create: {
      email: 'demo@qart.app',
      password: demoPassword,
      name: 'Demo User',
      isAdmin: false,
      isActive: true,
      emailVerified: true,
    },
  })

  // Test kullanıcı
  const userPassword = await hashPassword('TestUser2025!')
  const user = await prisma.user.upsert({
    where: { email: 'user@qart.app' },
    update: {},
    create: {
      email: 'user@qart.app',
      password: userPassword,
      name: 'Test User',
      isAdmin: false,
      isActive: true,
      emailVerified: true,
    },
  })

  // Default tema
  const defaultTheme = await prisma.theme.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Modern Dark',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      backgroundColor: '#111827',
      textColor: '#F9FAFB',
      font: 'Inter',
      layout: 'modern',
      isDefault: true,
    },
  })

  // Demo profil
  const demoProfile = await prisma.profile.upsert({
    where: { userId: demo.id },
    update: {},
    create: {
      userId: demo.id,
      slug: 'demo-user',
      companyName: 'Demo Şirketi',
      title: 'Demo Kullanıcı',
      bio: 'Bu bir demo profildir',
      phone: '+90 555 123 4567',
      email: 'demo@qart.app',
      website: 'https://demo.qart.app',
      themeId: defaultTheme.id,
      isPublic: true,
    },
  })

  console.log('✅ Secure seed completed!')
  console.log('👤 Admin:', { email: 'admin@qart.app', password: 'SecureAdmin2025!' })
  console.log('👤 Demo:', { email: 'demo@qart.app', password: 'DemoUser2025!' })
  console.log('👤 User:', { email: 'user@qart.app', password: 'TestUser2025!' })
  console.log('⚠️  IMPORTANT: Change these passwords in production!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })