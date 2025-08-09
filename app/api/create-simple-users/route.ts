import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('👤 Creating users with MINIMAL schema requirements...')
    
    // Create password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    
    console.log('🔐 Password hashes created')
    
    // Try creating users with ONLY required fields using raw SQL
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, "isAdmin", "isActive", "createdAt", "updatedAt")
      VALUES 
      ('admin-1', 'admin@qart.app', ${adminPasswordHash}, 'Admin User', true, true, NOW(), NOW()),
      ('demo-1', 'demo@qart.app', ${demoPasswordHash}, 'Demo User', false, true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET 
      password = EXCLUDED.password,
      "updatedAt" = NOW()
    `
    
    console.log('✅ Users created/updated with raw SQL')
    
    // Test passwords
    const adminUser = await prisma.$queryRaw`SELECT email, password FROM "User" WHERE email = 'admin@qart.app'`
    const demoUser = await prisma.$queryRaw`SELECT email, password FROM "User" WHERE email = 'demo@qart.app'`
    
    const admin = Array.isArray(adminUser) ? adminUser[0] : null
    const demo = Array.isArray(demoUser) ? demoUser[0] : null
    
    const adminTest = admin ? await bcrypt.compare('admin123', admin.password) : false
    const demoTest = demo ? await bcrypt.compare('demo123', demo.password) : false
    
    console.log('🧪 Password tests:')
    console.log('   admin@qart.app + admin123 =', adminTest)
    console.log('   demo@qart.app + demo123 =', demoTest)

    return NextResponse.json({
      success: true,
      message: 'Users created with minimal schema using raw SQL',
      tests: {
        adminLogin: adminTest,
        demoLogin: demoTest
      },
      credentials: {
        admin: { email: 'admin@qart.app', password: 'admin123', working: adminTest },
        demo: { email: 'demo@qart.app', password: 'demo123', working: demoTest }
      },
      instruction: 'Now try logging in with admin@qart.app/admin123'
    })
    
  } catch (error) {
    console.error('❌ Simple user creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Simple user creation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}