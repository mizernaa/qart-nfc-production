import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    console.log('🚂 Testing Railway PostgreSQL direct connection...')
    console.log('🔗 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔗 DATABASE_URL length:', process.env.DATABASE_URL?.length || 0)
    console.log('🔗 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30) || 'undefined')
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    console.log('🔄 Initializing Prisma client...')
    
    // Test connection
    const userCount = await prisma.user.count()
    console.log('👥 User count:', userCount)
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isActive: true
      }
    })
    
    console.log('📊 Users found:', users.length)
    users.forEach(user => console.log(`📧 ${user.email} (admin: ${user.isAdmin})`))
    
    return NextResponse.json({
      success: true,
      message: 'Railway PostgreSQL connection successful',
      userCount,
      users,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    })
    
  } catch (error: any) {
    console.error('❌ Railway PostgreSQL test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Railway PostgreSQL connection failed',
      error: error.message,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...'
    }, { status: 500 })
  }
}