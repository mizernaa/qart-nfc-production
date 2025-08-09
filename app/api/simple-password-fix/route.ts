import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Simple password fix - using raw SQL to avoid schema issues...')
    
    // Create new password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    
    console.log('🔐 Admin hash generated:', adminPasswordHash.substring(0, 20) + '...')
    console.log('🔐 Demo hash generated:', demoPasswordHash.substring(0, 20) + '...')
    
    // Update passwords using raw SQL
    await prisma.$executeRaw`UPDATE "User" SET password = ${adminPasswordHash} WHERE email = 'admin@qart.app'`
    console.log('✅ Admin password updated via raw SQL')
    
    await prisma.$executeRaw`UPDATE "User" SET password = ${demoPasswordHash} WHERE email = 'demo@qart.app'`
    console.log('✅ Demo password updated via raw SQL')

    // Test the passwords
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@qart.app' } })
    const demoUser = await prisma.user.findUnique({ where: { email: 'demo@qart.app' } })
    
    if (!adminUser || !demoUser) {
      throw new Error('Users not found after update')
    }
    
    const adminTest = await bcrypt.compare('admin123', adminUser.password)
    const demoTest = await bcrypt.compare('demo123', demoUser.password)
    
    console.log('🧪 Password verification tests:')
    console.log('   admin@qart.app + admin123 =', adminTest)
    console.log('   demo@qart.app + demo123 =', demoTest)

    return NextResponse.json({
      success: true,
      message: 'Passwords fixed successfully using raw SQL',
      tests: {
        adminLogin: adminTest,
        demoLogin: demoTest
      },
      instructions: {
        admin: { email: 'admin@qart.app', password: 'admin123' },
        demo: { email: 'demo@qart.app', password: 'demo123' }
      }
    })
    
  } catch (error) {
    console.error('❌ Simple password fix error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Simple password fix failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}