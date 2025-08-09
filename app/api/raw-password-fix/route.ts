import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 RAW SQL password fix - completely bypassing Prisma models...')
    
    // Generate new password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    
    console.log('🔐 Admin hash generated:', adminPasswordHash.substring(0, 20) + '...')
    console.log('🔐 Demo hash generated:', demoPasswordHash.substring(0, 20) + '...')
    
    // Update passwords using raw SQL only
    await prisma.$executeRaw`UPDATE "User" SET password = ${adminPasswordHash} WHERE email = 'admin@qart.app'`
    console.log('✅ Admin password updated via raw SQL')
    
    await prisma.$executeRaw`UPDATE "User" SET password = ${demoPasswordHash} WHERE email = 'demo@qart.app'`
    console.log('✅ Demo password updated via raw SQL')

    // Test passwords with raw SQL queries only
    const adminResult = await prisma.$queryRaw`SELECT email, password FROM "User" WHERE email = 'admin@qart.app'`
    const demoResult = await prisma.$queryRaw`SELECT email, password FROM "User" WHERE email = 'demo@qart.app'`
    
    const adminUser = Array.isArray(adminResult) ? adminResult[0] : null
    const demoUser = Array.isArray(demoResult) ? demoResult[0] : null
    
    if (!adminUser || !demoUser) {
      throw new Error('Users not found in database')
    }
    
    // Test password verification
    const adminTest = await bcrypt.compare('admin123', adminUser.password)
    const demoTest = await bcrypt.compare('demo123', demoUser.password)
    
    console.log('🧪 Password verification tests (RAW SQL):')
    console.log('   admin@qart.app + admin123 =', adminTest)
    console.log('   demo@qart.app + demo123 =', demoTest)

    return NextResponse.json({
      success: true,
      message: 'Passwords fixed successfully using PURE RAW SQL',
      tests: {
        adminLogin: adminTest,
        demoLogin: demoTest
      },
      credentials: {
        admin: { email: 'admin@qart.app', password: 'admin123', working: adminTest },
        demo: { email: 'demo@qart.app', password: 'demo123', working: demoTest }
      },
      nextStep: 'Try logging in now with admin@qart.app/admin123'
    })
    
  } catch (error) {
    console.error('❌ RAW SQL password fix error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'RAW SQL password fix failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}