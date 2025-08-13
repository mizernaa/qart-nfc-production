import { NextRequest, NextResponse } from "next/server"
import { CentralUserStore } from "@/lib/central-user-store"

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Unified: Fetching all users from central store...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Get users from central store
    const allUsers = search ? 
      CentralUserStore.searchUsers(search) : 
      CentralUserStore.getAllUsers()

    console.log(`✅ Central Store: Found ${allUsers.length} users`)

    return NextResponse.json({
      success: true,
      users: allUsers,
      pagination: {
        page: 1,
        limit: allUsers.length,
        total: allUsers.length,
        pages: 1
      }
    })

  } catch (error) {
    console.error('Admin unified users GET error:', error)
    
    // Return empty array on error
    return NextResponse.json({
      success: true,
      users: [],
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        pages: 1
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('➕ Unified: Creating user:', body)
    
    const { name, email, password, isAdmin = false } = body
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 }
      )
    }

    try {
      // Register using central store
      const newUser = await CentralUserStore.registerUser(email, password, name, isAdmin)
      
      if (!newUser) {
        return NextResponse.json(
          { success: false, message: "Kullanıcı oluşturulamadı" },
          { status: 500 }
        )
      }

      console.log("✅ Admin created user:", email)

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla oluşturuldu",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
          profile: {
            slug: newUser.profile.slug
          }
        }
      })
      
    } catch (error: any) {
      if (error.message === 'Bu email adresi zaten kullanılıyor') {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        )
      }
      
      throw error
    }

  } catch (error) {
    console.error('Admin unified users POST error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    console.log('🗑️ Unified: Deleting user:', userId)
    
    const success = CentralUserStore.deleteUser(userId)
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: "User not found or cannot be deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error('Admin unified users DELETE error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    if (action === 'toggle-status') {
      console.log('🔄 Unified: Toggling user status:', userId)
      
      const updatedUser = CentralUserStore.toggleUserStatus(userId)
      
      if (!updatedUser) {
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
      // Handle general user update
      const body = await request.json()
      console.log('📝 Unified: Updating user:', userId, body)
      
      const updatedUser = CentralUserStore.updateUser(userId, body)
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "User updated successfully"
      })
    }

  } catch (error) {
    console.error('Admin unified users PATCH error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}