import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Initializing clean database...')

    // Clear all existing data
    await prisma.user.deleteMany({})
    console.log('✅ Cleared all existing users')

    // Create admin user
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@qart.app' }
    })

    if (!adminExists) {
      await prisma.user.create({
        data: {
          id: 'admin-001',
          email: 'admin@qart.app',
          password: '$2b$12$SSoUv/jalgW.AkrG65S1cunTu6ySwmgk2KAtgFoLqvl0.D//7FdKG', // admin123
          name: 'Admin User',
          isAdmin: true,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          profile: {
            create: {
              slug: 'admin-user',
              companyName: 'QART Team',
              title: 'Sistem Yöneticisi',
              bio: 'QART Sistem Yöneticisi',
              phone: '+90 555 000 0001',
              themeId: 'default'
            }
          }
        }
      })
      console.log('✅ Created admin user')
    }

    // Create demo user
    const demoExists = await prisma.user.findUnique({
      where: { email: 'demo@qart.app' }
    })

    if (!demoExists) {
      await prisma.user.create({
        data: {
          id: 'demo-001',
          email: 'demo@qart.app',
          password: '$2b$12$3G.uzJPIEdrQMqs5o3f69unNBFZ0n1YQLxUph0VXgkmemE34umQza', // demo123
          name: 'Demo User',
          isAdmin: false,
          isActive: true,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          profile: {
            create: {
              slug: 'demo-user',
              companyName: 'Demo Şirketi',
              title: 'Demo Kullanıcısı',
              bio: 'QART Demo Kullanıcısı',
              phone: '+90 555 000 0002',
              themeId: 'default'
            }
          }
        }
      })
      console.log('✅ Created demo user')
    }

    // Get final user count
    const totalUsers = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        isAdmin: true,
        isActive: true
      }
    })

    console.log(`🎉 Database initialized with ${totalUsers} users`)

    return NextResponse.json({
      success: true,
      message: 'Database successfully initialized with clean data',
      totalUsers,
      users
    })

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}