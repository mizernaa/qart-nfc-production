import { NextRequest, NextResponse } from "next/server"
import { hybridUserStore } from "@/lib/hybrid-user-store"

export async function GET(request: NextRequest) {
  try {
    // Get all users from hybrid store
    const allUsers = await hybridUserStore.getAllUsers()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Filter users based on search
    let filteredUsers = allUsers
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = allUsers.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower)
      )
    }

    // Transform to match frontend expectations with real database data
    const users = filteredUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: user.profile,
      subscription: user.subscription,
      _count: {
        cards: user.cards?.length || 0,
        profile: user.profile ? 1 : 0
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

    // Delete user from hybrid store
    const success = await hybridUserStore.deleteUser(userId)

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
      const success = await hybridUserStore.toggleUserStatus(userId)
      
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
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}