import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching users list...')
    
    const prisma = new PrismaClient()
    
    try {
      // Simple user query without relations
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isActive: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log(`✅ Found ${users.length} users`)
      
      // Format for frontend
      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        emailVerified: true,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.createdAt.toISOString(),
        profile: {
          slug: user.name.toLowerCase().replace(/\s+/g, '-'),
          title: user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
          bio: `${user.name} - QART dijital kartvizit kullanıcısı`,
          phone: '+90 555 000 0000'
        },
        subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: 0,
          profile: 1
        }
      }))
      
      return NextResponse.json({
        success: true,
        users: formattedUsers,
        pagination: {
          page: 1,
          limit: formattedUsers.length,
          total: formattedUsers.length,
          pages: 1
        }
      })
      
    } catch (queryError: any) {
      console.error('❌ Query error:', queryError)
      return NextResponse.json({
        success: false,
        message: 'Database query failed',
        error: queryError.message
      }, { status: 500 })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error('❌ Users list error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    }, { status: 500 })
  }
}