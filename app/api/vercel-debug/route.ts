import { NextRequest, NextResponse } from 'next/server'
import { vercelUserStore } from '@/lib/vercel-user-store'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Vercel Debug API called')
    
    // Force get all users to trigger initialization
    const users = await vercelUserStore.getAllUsers()
    
    // Test finding admin user
    const adminUser = await vercelUserStore.findByEmail('admin@qart.app')
    
    return NextResponse.json({
      success: true,
      environment: process.env.VERCEL ? 'VERCEL' : 'LOCAL',
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      users: {
        count: users.length,
        emails: users.map(u => u.email),
        admin: adminUser ? { email: adminUser.email, id: adminUser.id, isAdmin: adminUser.isAdmin } : null
      },
      message: 'Debug info retrieved successfully'
    })
    
  } catch (error) {
    console.error('❌ Vercel debug error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Debug failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.VERCEL ? 'VERCEL' : 'LOCAL'
      },
      { status: 500 }
    )
  }
}