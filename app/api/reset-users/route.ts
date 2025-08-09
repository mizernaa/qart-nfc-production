import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Resetting all users and recreating with correct passwords...')
    
    // Delete all existing users (cascade will delete profiles)
    await prisma.user.deleteMany({})
    console.log('🗑️ All users deleted')
    
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    console.log('🔐 Admin password hashed:', adminPasswordHash.substring(0, 20) + '...')
    
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
    console.log('✅ Admin user created:', adminUser.email)

    // Create demo user  
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    console.log('🔐 Demo password hashed:', demoPasswordHash.substring(0, 20) + '...')
    
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
    console.log('✅ Demo user created:', demoUser.email)

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

    console.log('✅ Profiles created successfully')

    // Test password verification
    const testAdmin = await prisma.user.findUnique({ where: { email: 'admin@qart.app' } })
    const testDemo = await prisma.user.findUnique({ where: { email: 'demo@qart.app' } })
    
    const adminPasswordTest = await bcrypt.compare('admin123', testAdmin!.password)
    const demoPasswordTest = await bcrypt.compare('demo123', testDemo!.password)
    
    console.log('🧪 Password test results:')
    console.log('   Admin password verify:', adminPasswordTest)
    console.log('   Demo password verify:', demoPasswordTest)

    return NextResponse.json({
      success: true,
      message: 'Users reset and recreated successfully',
      users: [
        { 
          email: adminUser.email, 
          isAdmin: true,
          passwordTest: adminPasswordTest
        },
        { 
          email: demoUser.email, 
          isAdmin: false,
          passwordTest: demoPasswordTest
        }
      ],
      passwordHashes: {
        admin: adminPasswordHash,
        demo: demoPasswordHash
      }
    })
    
  } catch (error) {
    console.error('❌ User reset error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'User reset failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}