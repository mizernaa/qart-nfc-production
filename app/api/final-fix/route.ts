import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 FINAL FIX - Creating users with exact database schema...')
    
    // Create password hashes
    const adminPasswordHash = await bcrypt.hash('admin123', 12)
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    
    console.log('🔐 Password hashes created')
    
    // Use ONLY the columns that exist: id, email, password, name, isActive, isAdmin, createdAt
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, "isAdmin", "isActive", "createdAt")
      VALUES 
      ('admin-final', 'admin@qart.app', ${adminPasswordHash}, 'Admin User', true, true, NOW()),
      ('demo-final', 'demo@qart.app', ${demoPasswordHash}, 'Demo User', false, true, NOW())
      ON CONFLICT (email) DO UPDATE SET 
      password = EXCLUDED.password,
      name = EXCLUDED.name,
      "isAdmin" = EXCLUDED."isAdmin",
      "isActive" = EXCLUDED."isActive"
    `
    
    console.log('✅ Users created/updated successfully!')
    
    // Verify users exist and test passwords
    const adminUser = await prisma.$queryRaw`SELECT email, password, "isAdmin" FROM "User" WHERE email = 'admin@qart.app'`
    const demoUser = await prisma.$queryRaw`SELECT email, password, "isAdmin" FROM "User" WHERE email = 'demo@qart.app'`
    
    const admin = Array.isArray(adminUser) ? adminUser[0] : null
    const demo = Array.isArray(demoUser) ? demoUser[0] : null
    
    const adminTest = admin ? await bcrypt.compare('admin123', admin.password) : false
    const demoTest = demo ? await bcrypt.compare('demo123', demo.password) : false
    
    console.log('🧪 Final password verification:')
    console.log('   admin@qart.app + admin123 =', adminTest)
    console.log('   demo@qart.app + demo123 =', demoTest)

    return NextResponse.json({
      success: true,
      message: 'FINAL FIX SUCCESSFUL! Users created with correct schema.',
      verification: {
        adminPasswordWorks: adminTest,
        demoPasswordWorks: demoTest,
        adminIsAdmin: admin?.isAdmin || false,
        demoIsAdmin: demo?.isAdmin || false
      },
      instruction: '🎉 Now try logging in with admin@qart.app/admin123 or demo@qart.app/demo123',
      loginUrl: 'https://qart-nfc-production.vercel.app/login'
    })
    
  } catch (error) {
    console.error('❌ Final fix error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Final fix failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check database schema and column names'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}