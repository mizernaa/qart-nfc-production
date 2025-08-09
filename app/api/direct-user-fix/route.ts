import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 DIRECT USER FIX - Bypassing schema issues...')
    
    // Create password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    
    console.log('🔐 Password hashes created')
    
    // Delete existing users first to avoid conflicts
    await prisma.$executeRaw`DELETE FROM "User" WHERE email IN ('admin@qart.app', 'demo@qart.app')`
    console.log('🗑️ Existing users removed')
    
    // Insert with ONLY the columns that exist in database
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, "isAdmin", "isActive", "createdAt")
      VALUES 
      ('admin-direct', 'admin@qart.app', ${adminPasswordHash}, 'Admin User', true, true, NOW()),
      ('demo-direct', 'demo@qart.app', ${demoPasswordHash}, 'Demo User', false, true, NOW())
    `
    
    console.log('✅ Users created successfully!')
    
    // Verify users and passwords
    const users = await prisma.$queryRaw`
      SELECT id, email, password, name, "isAdmin", "isActive" 
      FROM "User" 
      WHERE email IN ('admin@qart.app', 'demo@qart.app')
    ` as any[]
    
    console.log('📋 Users in database:', users.length)
    
    const results = []
    for (const user of users) {
      const passwordWorks = await bcrypt.compare(
        user.email === 'admin@qart.app' ? 'admin123' : 'demo123',
        user.password
      )
      results.push({
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        passwordWorks
      })
    }

    return NextResponse.json({
      success: true,
      message: '✅ DIRECT FIX SUCCESSFUL! Database users fixed.',
      users: results,
      loginInfo: {
        admin: {
          email: 'admin@qart.app',
          password: 'admin123',
          working: results.find(u => u.email === 'admin@qart.app')?.passwordWorks
        },
        demo: {
          email: 'demo@qart.app', 
          password: 'demo123',
          working: results.find(u => u.email === 'demo@qart.app')?.passwordWorks
        }
      },
      instruction: '🎉 Now login at: https://qart-nfc-production.vercel.app/login'
    })
    
  } catch (error) {
    console.error('❌ Direct fix error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Direct fix failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}