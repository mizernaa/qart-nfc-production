import { NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all users from file system...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let allUsers = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      allUsers = JSON.parse(usersData)
    } catch (error) {
      console.log('❌ Users file not found, returning empty array')
      allUsers = []
    }

    // Search filtreleme
    if (search) {
      const searchLower = search.toLowerCase()
      allUsers = allUsers.filter(user => 
        user.email.toLowerCase().includes(searchLower) || 
        user.name.toLowerCase().includes(searchLower)
      )
    }

    // Tarihe göre sırala (en yeni önce)
    allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log(`👥 Found ${allUsers.length} users in file system`)

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
        slug: user.profile?.slug || user.name.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-'),
        title: user.profile?.title || (user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'),
        bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
        phone: user.profile?.phone || '+90 555 000 0000'
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

    console.log('🗑️ Deleting user:', userId)
    
    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Users file not found" },
        { status: 404 }
      )
    }
    
    // Check if user exists and is not admin
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }
    
    const user = users[userIndex]
    if (user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Cannot delete admin user" },
        { status: 403 }
      )
    }
    
    // Delete user from array
    users.splice(userIndex, 1)
    
    // Save updated users
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    
    console.log('✅ User deleted successfully:', user.email)

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

    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Users file not found" },
        { status: 404 }
      )
    }

    if (action === 'toggle-status') {
      console.log('🔄 Toggling user status:', userId)
      
      // Get current user
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }
      
      const user = users[userIndex]
      const newStatus = !user.isActive
      
      // Update user status
      users[userIndex].isActive = newStatus
      
      // Save updated users
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
      
      console.log(`✅ User status changed: ${user.isActive} → ${newStatus}`)

      return NextResponse.json({
        success: true,
        message: "User status updated successfully"
      })
    } else {
      // Handle user update
      const body = await request.json()
      const { name, email, phone, isAdmin, isActive } = body
      
      console.log('📝 Updating user:', userId, body)
      
      // Get current user
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }
      
      // Update user
      users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        isAdmin: isAdmin !== undefined ? isAdmin : users[userIndex].isAdmin,
        isActive: isActive !== undefined ? isActive : users[userIndex].isActive,
        profile: {
          ...users[userIndex].profile,
          phone: phone || users[userIndex].profile?.phone
        }
      }
      
      // Save updated users
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
      
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
  }
}