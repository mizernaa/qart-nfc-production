import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Manual user initialization started')
    
    // Check if users already exist
    const userCount = await prisma.user.count()
    
    if (userCount > 0) {
      const existingUsers = await prisma.user.findMany({
        select: { email: true, isAdmin: true }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Users already exist',
        userCount,
        existingUsers
      })
    }
    
    console.log('📦 Creating admin and demo users...')
    
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@qart.app',
        password: adminPasswordHash,
        name: 'Admin User',
        isAdmin: true,
        isActive: true,
        emailVerified: true
      }
    })

    // Create demo user  
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@qart.app',
        password: demoPasswordHash,
        name: 'Demo User',
        isAdmin: false,
        isActive: true,
        emailVerified: true
      }
    })

    // Create profiles
    await prisma.profile.create({
      data: {
        userId: adminUser.id,
        slug: 'admin-user',
        companyName: 'QART Team',
        title: 'Sistem Yöneticisi',
        bio: 'QART NFC sistemi yöneticisi',
        email: 'admin@qart.app',
        phone: '+90 555 000 0001',
        website: 'https://qart.app'
      }
    })

    await prisma.profile.create({
      data: {
        userId: demoUser.id,
        slug: 'demo-user', 
        companyName: 'Demo Şirket',
        title: 'Demo Kullanıcı',
        bio: 'QART demo kullanıcısı',
        email: 'demo@qart.app',
        phone: '+90 555 000 0002'
      }
    })

    console.log('✅ Users created successfully')

    return NextResponse.json({
      success: true,
      message: 'Users initialized successfully',
      users: [
        { email: adminUser.email, isAdmin: true },
        { email: demoUser.email, isAdmin: false }
      ]
    })
    
  } catch (error) {
    console.error('❌ User initialization error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'User initialization failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}