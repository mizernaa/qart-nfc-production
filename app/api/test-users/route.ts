import { NextRequest, NextResponse } from "next/server"

// Simple hardcoded users for production
const HARDCODED_USERS = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    name: "Admin User",
    isAdmin: true,
    isActive: true,
    createdAt: "2025-08-11T11:35:00.000Z",
    profile: {
      slug: "admin-user",
      title: "Sistem Yöneticisi",
      bio: "QART Sistem Yöneticisi",
      phone: "+90 555 000 0001"
    }
  },
  {
    id: "demo-001",
    email: "demo@qart.app",
    name: "Demo User",
    isAdmin: false,
    isActive: true,
    createdAt: "2025-08-11T11:35:00.000Z",
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı",
      bio: "QART Demo Kullanıcısı",
      phone: "+90 555 000 0002"
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching hardcoded users for production...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Apply search filter
    let filteredUsers = HARDCODED_USERS
    if (search) {
      filteredUsers = HARDCODED_USERS.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    console.log(`👥 Found ${filteredUsers.length} users`)

    // Transform to match frontend expectations
    const users = filteredUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: true,
      createdAt: user.createdAt,
      lastLoginAt: user.createdAt,
      profile: user.profile,
      subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
      _count: {
        cards: 0,
        profile: 1
      }
    }))

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page: 1,
        limit: users.length,
        total: users.length,
        pages: 1
      }
    })
    
  } catch (error) {
    console.error('❌ Test users error:', error)
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Production'da yeni kullanıcı ekleme devre dışı
  return NextResponse.json({
    success: false,
    message: "User creation disabled in production. Please use register endpoint."
  }, { status: 400 })
}

export async function DELETE(request: NextRequest) {
  // Production'da kullanıcı silme devre dışı
  return NextResponse.json({
    success: false,
    message: "User deletion disabled in production."
  }, { status: 400 })
}

export async function PATCH(request: NextRequest) {
  // Production'da kullanıcı güncelleme devre dışı
  return NextResponse.json({
    success: false,
    message: "User update disabled in production."
  }, { status: 400 })
}