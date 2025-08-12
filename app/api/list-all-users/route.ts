import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Listing all users from database...')
    
    // Get all users with raw SQL
    const users = await prisma.$queryRaw`
      SELECT id, email, name, "isAdmin", "isActive", "createdAt"
      FROM "User"
      ORDER BY "createdAt" DESC
    ` as any[]
    
    console.log(`👥 Found ${users.length} users`)
    
    return NextResponse.json({
      success: true,
      userCount: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isAdmin: u.isAdmin,
        isActive: u.isActive,
        createdAt: u.createdAt
      }))
    })
    
  } catch (error) {
    console.error('❌ List users error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to list users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}