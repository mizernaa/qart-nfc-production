import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing admin account...')
    
    // Create password hash for admin123
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    
    // Delete existing admin account if exists
    await prisma.$executeRaw`DELETE FROM "User" WHERE email = 'admin@qart.app'`
    console.log('🗑️ Old admin account removed')
    
    // Create new admin account with correct password
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, "isAdmin", "isActive", "createdAt")
      VALUES ('admin-fixed', 'admin@qart.app', ${adminPasswordHash}, 'Admin User', true, true, NOW())
    `
    
    console.log('✅ Admin account created successfully!')
    
    // Test the password
    const adminUsers = await prisma.$queryRaw`
      SELECT id, email, password, name, "isAdmin", "isActive" 
      FROM "User" 
      WHERE email = 'admin@qart.app'
    ` as any[]
    
    if (adminUsers.length > 0) {
      const admin = adminUsers[0]
      const passwordWorks = await bcrypt.compare('admin123', admin.password)
      
      console.log('🔐 Admin password test:', passwordWorks ? 'SUCCESS' : 'FAILED')
      
      return NextResponse.json({
        success: true,
        message: 'Admin account fixed successfully!',
        admin: {
          email: 'admin@qart.app',
          password: 'admin123',
          isAdmin: admin.isAdmin,
          passwordWorks
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Admin account created but verification failed'
    })
    
  } catch (error) {
    console.error('❌ Fix admin error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix admin account',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}