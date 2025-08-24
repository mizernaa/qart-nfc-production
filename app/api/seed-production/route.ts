import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    console.log('🌱 Seeding production database...')
    
    // Create default themes
    const themes = [
      { id: 'default', name: 'Default Theme', colors: { primary: '#3B82F6', secondary: '#1F2937' }, isPremium: false },
      { id: 'modern', name: 'Modern Theme', colors: { primary: '#8B5CF6', secondary: '#4C1D95' }, isPremium: false },
      { id: 'dark', name: 'Dark Theme', colors: { primary: '#EF4444', secondary: '#991B1B' }, isPremium: false }
    ]
    
    for (const theme of themes) {
      await prisma.theme.upsert({
        where: { id: theme.id },
        update: theme,
        create: theme
      })
    }
    console.log('✅ Themes created')
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
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
            title: 'Sistem Yöneticisi',
            bio: 'QART Admin',
            phone: '+90 555 000 0000',
            isPublic: true
          }
        },
        subscription: {
          create: {
            plan: 'QART Lifetime',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        }
      }
    })
    console.log('✅ Admin user created')
    
    // Create Omer user
    const omerPassword = await bcrypt.hash('omer123', 12)
    const omerUser = await prisma.user.upsert({
      where: { email: 'omeraytac@gmail.com' },
      update: { password: omerPassword },
      create: {
        email: 'omeraytac@gmail.com',
        password: omerPassword,
        name: 'Ömer Aytaç',
        isAdmin: false,
        isActive: true,
        profile: {
          create: {
            slug: 'omer-aytac',
            title: 'CEO & Founder',
            bio: 'QART Digital kullanıcısı',
            phone: '+90 555 123 4567',
            companyName: 'QART Digital',
            isPublic: true
          }
        },
        subscription: {
          create: {
            plan: 'QART Lifetime',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        }
      }
    })
    console.log('✅ Omer user created/updated')
    
    // Get all users to verify
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        isAdmin: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully',
      users: users
    })
    
  } catch (error: any) {
    console.error('❌ Seed error:', error)
    return NextResponse.json({
      success: false,
      message: 'Seed failed',
      error: error.message
    }, { status: 500 })
  }
}