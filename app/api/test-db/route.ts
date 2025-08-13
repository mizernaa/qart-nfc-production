import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    const prisma = new PrismaClient()
    
    try {
      // Test connection
      const userCount = await prisma.user.count()
      
      // Get database URL (hide sensitive parts)
      const dbUrl = process.env.DATABASE_URL || 'Not set'
      const dbProvider = dbUrl.includes('postgresql') ? 'PostgreSQL' : 
                        dbUrl.includes('file:') ? 'SQLite' : 'Unknown'
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: {
          provider: dbProvider,
          userCount,
          environment: process.env.NODE_ENV || 'development',
          vercel: process.env.VERCEL || 'false',
          timestamp: new Date().toISOString()
        }
      })
      
    } catch (dbError: any) {
      await prisma.$disconnect()
      throw dbError
    }
    
  } catch (error: any) {
    console.error('❌ Database test error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      environment: process.env.NODE_ENV || 'development',
      vercel: process.env.VERCEL || 'false',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}