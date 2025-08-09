import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking database schema...')
    
    // Check table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position
    `
    
    console.log('📋 User table columns:', tableInfo)
    
    // Check existing users
    const users = await prisma.$queryRaw`SELECT email, "isAdmin" FROM "User"`
    
    console.log('👥 Existing users:', users)
    
    return NextResponse.json({
      success: true,
      message: 'Database schema checked',
      tableInfo,
      existingUsers: users,
      userCount: Array.isArray(users) ? users.length : 0
    })
    
  } catch (error) {
    console.error('❌ Schema check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Schema check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}