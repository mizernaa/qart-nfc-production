import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Initialize database (ensure default users exist)
    await DatabaseUserStore.initialize()
    
    // Authenticate user
    const user = await DatabaseUserStore.authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Return user data without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      profile: user.profile
    }

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      user: userResponse
    })
    
  } catch (error) {
    console.error('Database login error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}