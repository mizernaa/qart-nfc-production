import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

// Testing persistence across hot reloads

export async function GET(request: NextRequest) {
  try {
    // Initialize database (ensure default users exist)
    await DatabaseUserStore.initialize()
    
    // Get all users
    const users = await DatabaseUserStore.getAllUsers()
    
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
    console.error('Error fetching database users:', error)
    return NextResponse.json(
      { success: false, message: 'Database users alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, isAdmin = false } = body
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Ad, email ve şifre gereklidir' },
        { status: 400 }
      )
    }
    
    const user = await DatabaseUserStore.registerUser(email, password, name, isAdmin)
    
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla eklendi',
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        slug: user?.profile?.slug
      }
    })
    
  } catch (error: any) {
    console.error('Error creating database user:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Kullanıcı oluşturulamadı' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      )
    }
    
    const deleted = await DatabaseUserStore.deleteUser(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı silinemedi (Admin kullanıcılar silinemez)' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    })
    
  } catch (error) {
    console.error('Error deleting database user:', error)
    return NextResponse.json(
      { success: false, message: 'Kullanıcı silinemedi' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID gereklidir' },
        { status: 400 }
      )
    }
    
    if (action === 'toggle-status') {
      const user = await DatabaseUserStore.toggleUserStatus(id)
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: `Kullanıcı durumu ${user.isActive ? 'aktif' : 'deaktif'} olarak güncellendi`,
        user
      })
    } else {
      // Regular user update
      const body = await request.json()
      
      const user = await DatabaseUserStore.updateUser(id, body)
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Kullanıcı güncellenemedi' },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Kullanıcı başarıyla güncellendi',
        user
      })
    }
    
  } catch (error) {
    console.error('Error updating database user:', error)
    return NextResponse.json(
      { success: false, message: 'Kullanıcı güncellenemedi' },
      { status: 500 }
    )
  }
}