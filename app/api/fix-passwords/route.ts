import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Fixing user passwords with correct bcrypt hashes...')
    
    // Update admin user password
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    console.log('🔐 Admin password hashed:', adminPasswordHash.substring(0, 20) + '...')
    
    const adminUpdate = await prisma.user.update({
      where: { email: 'admin@qart.app' },
      data: { password: adminPasswordHash }
    })
    console.log('✅ Admin password updated:', adminUpdate.email)
    
    // Update demo user password
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    console.log('🔐 Demo password hashed:', demoPasswordHash.substring(0, 20) + '...')
    
    const demoUpdate = await prisma.user.update({
      where: { email: 'demo@qart.app' },
      data: { password: demoPasswordHash }
    })
    console.log('✅ Demo password updated:', demoUpdate.email)

    // Test password verification
    const testAdmin = await prisma.user.findUnique({ where: { email: 'admin@qart.app' } })
    const testDemo = await prisma.user.findUnique({ where: { email: 'demo@qart.app' } })
    
    const adminPasswordTest = await bcrypt.compare('admin123', testAdmin!.password)
    const demoPasswordTest = await bcrypt.compare('demo123', testDemo!.password)
    
    console.log('🧪 Password verification test results:')
    console.log('   Admin (admin@qart.app + admin123):', adminPasswordTest)
    console.log('   Demo (demo@qart.app + demo123):', demoPasswordTest)

    return NextResponse.json({
      success: true,
      message: 'User passwords fixed successfully',
      passwordTests: {
        admin: {
          email: 'admin@qart.app',
          password: 'admin123',
          verified: adminPasswordTest,
          hash: adminPasswordHash
        },
        demo: {
          email: 'demo@qart.app', 
          password: 'demo123',
          verified: demoPasswordTest,
          hash: demoPasswordHash
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Password fix error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Password fix failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}