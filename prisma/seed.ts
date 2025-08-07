import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default themes
  const themes = [
    {
      id: 'default',
      name: 'Modern',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      font: 'Inter',
      layout: 'modern',
      isDefault: true
    },
    {
      id: 'dark',
      name: 'Dark',
      primaryColor: '#6366F1',
      secondaryColor: '#EC4899',
      backgroundColor: '#1F2937',
      textColor: '#F9FAFB',
      font: 'Inter',
      layout: 'modern',
      isDefault: false
    },
    {
      id: 'minimal',
      name: 'Minimal',
      primaryColor: '#000000',
      secondaryColor: '#6B7280',
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      font: 'Arial',
      layout: 'minimal',
      isDefault: false
    },
    {
      id: 'gradient',
      name: 'Gradient',
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      backgroundColor: '#F3F4F6',
      textColor: '#1F2937',
      font: 'Inter',
      layout: 'gradient',
      isDefault: false
    },
    {
      id: 'corporate',
      name: 'Corporate',
      primaryColor: '#1E40AF',
      secondaryColor: '#059669',
      backgroundColor: '#F8FAFC',
      textColor: '#0F172A',
      font: 'Arial',
      layout: 'classic',
      isDefault: false
    }
  ]

  console.log('Creating themes...')
  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { id: theme.id },
      update: theme,
      create: theme
    })
  }

  // Create admin user
  console.log('Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@qart.app' },
    update: {},
    create: {
      email: 'admin@qart.app',
      name: 'Admin',
      password: adminPassword,
      isAdmin: true,
      emailVerified: true,
    }
  })

  // Create admin profile
  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      slug: 'admin-profile',
      themeId: 'default',
      companyName: 'QART Admin',
      title: 'System Administrator',
      bio: 'QART dijital kartvizit sistemi yöneticisi',
      isPublic: false
    }
  })

  // Create admin subscription
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      plan: 'business',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }
  })

  // Create demo user
  console.log('Creating demo user...')
  const demoPassword = await bcrypt.hash('demo123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@qart.app' },
    update: {},
    create: {
      email: 'demo@qart.app',
      name: 'Ahmet Yılmaz',
      password: demoPassword,
      isAdmin: false,
      emailVerified: true,
    }
  })

  // Create demo profile
  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      slug: 'ahmet-yilmaz',
      themeId: 'gradient',
      companyName: 'ABC Teknoloji',
      title: 'Yazılım Geliştirici',
      bio: 'Modern web teknolojileri konusunda uzman yazılım geliştirici. React, Node.js ve cloud teknolojileri ile çalışıyorum.',
      phone: '+90 555 123 4567',
      email: 'ahmet@abcteknoloji.com',
      website: 'https://ahmetyilmaz.dev',
      address: 'İstanbul, Türkiye',
      isPublic: true,
      enableLeadCapture: true,
      enableAnalytics: true
    }
  })

  // Create demo subscription
  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  })

  // Add sample social links for demo user
  const socialLinks = [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ahmetyilmaz', order: 1 },
    { platform: 'GitHub', url: 'https://github.com/ahmetyilmaz', order: 2 },
    { platform: 'Twitter', url: 'https://twitter.com/ahmetyilmaz', order: 3 },
    { platform: 'Instagram', url: 'https://instagram.com/ahmetyilmaz', order: 4 }
  ]

  const profile = await prisma.profile.findUnique({ where: { userId: demoUser.id } })
  if (profile) {
    for (const link of socialLinks) {
      await prisma.socialLink.create({
        data: {
          profileId: profile.id,
          platform: link.platform,
          url: link.url,
          order: link.order,
          isVisible: true,
          clickCount: Math.floor(Math.random() * 50)
        }
      })
    }

    // Add sample analytics data
    const analyticsData = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
        analyticsData.push({
          profileId: profile.id,
          viewedAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          viewerCountry: ['Turkey', 'Germany', 'USA', 'UK'][Math.floor(Math.random() * 4)],
          viewerCity: ['Istanbul', 'Berlin', 'New York', 'London'][Math.floor(Math.random() * 4)],
          viewerDevice: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
          viewerBrowser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)]
        })
      }
    }

    await prisma.analytics.createMany({ data: analyticsData })
  }

  console.log('Seed completed successfully!')
  console.log('')
  console.log('🔑 LOGIN CREDENTIALS:')
  console.log('===================')
  console.log('👑 ADMIN LOGIN:')
  console.log('Email: admin@qart.app')
  console.log('Password: admin123')
  console.log('')
  console.log('👤 DEMO USER LOGIN:')
  console.log('Email: demo@qart.app') 
  console.log('Password: demo123')
  console.log('')
  console.log('🌐 Demo Profile: http://localhost:3003/ahmet-yilmaz')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })