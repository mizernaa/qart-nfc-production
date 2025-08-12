import { NextRequest, NextResponse } from 'next/server'
import { prismaUserStore } from '@/lib/prisma-user-store'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Database Debug API called')
    
    // Database connection test
    const diagnosticInfo = await prismaUserStore.getDiagnosticInfo()
    
    // Get all users
    const users = await prismaUserStore.getAllUsers()
    
    // Try to find admin user specifically
    const adminUser = await prismaUserStore.findByEmail('admin@qart.app')
    
    return NextResponse.json({
      success: true,
      environment: process.env.VERCEL ? 'VERCEL PRODUCTION' : 'LOCAL',
      database: {
        connection: 'SUCCESS',
        url: process.env.DATABASE_URL ? 'CONFIGURED' : 'MISSING',
        diagnostic: diagnosticInfo
      },
      users: {
        total: users.length,
        userList: users.map(u => ({ 
          id: u.id, 
          email: u.email, 
          name: u.name, 
          isAdmin: u.isAdmin,
          isActive: u.isActive,
          hasPassword: !!u.password
        }))
      },
      adminUser: adminUser ? {
        found: true,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
        isActive: adminUser.isActive,
        hasPassword: !!adminUser.password
      } : {
        found: false
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database debug error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.VERCEL ? 'VERCEL PRODUCTION' : 'LOCAL',
        databaseUrl: process.env.DATABASE_URL ? 'CONFIGURED' : 'MISSING'
      },
      { status: 500 }
    )
  }
}