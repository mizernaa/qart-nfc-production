import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all users from database...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Get all users from database with raw SQL
    let allUsers
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`
      allUsers = await prisma.$queryRaw`
        SELECT id, email, name, "isAdmin", "isActive", "createdAt"
        FROM "User" 
        WHERE LOWER(email) LIKE ${searchLower} OR LOWER(name) LIKE ${searchLower}
        ORDER BY "createdAt" DESC
      ` as any[]
    } else {
      allUsers = await prisma.$queryRaw`
        SELECT id, email, name, "isAdmin", "isActive", "createdAt"
        FROM "User" 
        ORDER BY "createdAt" DESC
      ` as any[]
    }

    console.log(`👥 Found ${allUsers.length} users in database`)

    // Transform to match frontend expectations
    const users = allUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: true, // Default
      createdAt: user.createdAt,
      lastLoginAt: user.createdAt, // Use createdAt as fallback
      profile: {
        slug: user.name.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-'),
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

    const total = users.length

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page: 1,
        limit: total,
        total,
        pages: 1
      }
    })

  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    // Delete user from database
    console.log('🗑️ Deleting user:', userId)
    
    // Check if user exists and is not admin
    const userCheck = await prisma.$queryRaw`
      SELECT id, email, "isAdmin" FROM "User" WHERE id = ${userId}
    ` as any[]
    
    if (userCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }
    
    const user = userCheck[0]
    if (user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Cannot delete admin user" },
        { status: 403 }
      )
    }
    
    // Delete user
    await prisma.$executeRaw`DELETE FROM "User" WHERE id = ${userId}`
    console.log('✅ User deleted successfully:', user.email)
    const success = true

    if (!success) {
      return NextResponse.json(
        { success: false, message: "User not found or cannot be deleted (admin user)" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error('Admin users DELETE error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const action = searchParams.get('action')

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: "User ID and action are required" },
        { status: 400 }
      )
    }

    if (action === 'toggle-status') {
      console.log('🔄 Toggling user status:', userId)
      
      // Get current user status
      const userCheck = await prisma.$queryRaw`
        SELECT id, "isActive" FROM "User" WHERE id = ${userId}
      ` as any[]
      
      if (userCheck.length === 0) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }
      
      const currentStatus = userCheck[0].isActive
      const newStatus = !currentStatus
      
      // Update user status
      await prisma.$executeRaw`
        UPDATE "User" SET "isActive" = ${newStatus} WHERE id = ${userId}
      `
      
      console.log(`✅ User status changed: ${currentStatus} → ${newStatus}`)
      const success = true
      
      if (!success) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "User status updated successfully"
      })
    } else {
      // Handle user update
      const body = await request.json()
      const { name, email, phone, isAdmin, isActive } = body
      
      console.log('📝 Updating user:', userId, body)
      
      // Update user with raw SQL
      await prisma.$executeRaw`
        UPDATE "User" 
        SET name = ${name}, 
            email = ${email}, 
            "isAdmin" = ${isAdmin}, 
            "isActive" = ${isActive}
        WHERE id = ${userId}
      `
      
      console.log('✅ User updated successfully')
      
      return NextResponse.json({
        success: true,
        message: "User updated successfully"
      })
    }

  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}