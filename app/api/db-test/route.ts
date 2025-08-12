import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Is Vercel:', !!process.env.VERCEL)
    
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
    
    try {
      // Test connection with a simple query
      const userCount = await prisma.user.count()
      console.log(`✅ Database connected! User count: ${userCount}`)
      
      // Get user list
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isActive: true,
          createdAt: true
        },
        take: 10
      })
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        stats: {
          userCount,
          environment: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL,
          databaseUrlExists: !!process.env.DATABASE_URL
        },
        users
      })
      
    } catch (queryError: any) {
      console.error('❌ Query error:', queryError)
      return NextResponse.json({
        success: false,
        message: 'Database query failed',
        error: queryError.message,
        code: queryError.code,
        meta: queryError.meta
      }, { status: 500 })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error('❌ Connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        meta: error.meta
      }
    }, { status: 500 })
  }
}