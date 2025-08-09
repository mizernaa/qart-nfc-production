import { NextRequest, NextResponse } from 'next/server'
import { vercelUserStore } from '@/lib/vercel-user-store'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    console.log('📝 Registration attempt:', { name, email })

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Tüm alanlar gerekli' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await vercelUserStore.findByEmail(email)
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return NextResponse.json(
        { success: false, message: 'Bu email adresi zaten kullanımda' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await vercelUserStore.hashPassword(password)
    
    // Create slug from name
    const slug = name.toLowerCase()
      .replace(/[üÜ]/g, 'u')
      .replace(/[ğĞ]/g, 'g') 
      .replace(/[şŞ]/g, 's')
      .replace(/[ıİ]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[çÇ]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Create new user
    const newUser = await vercelUserStore.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
      profile: {
        slug,
        title: 'Kullanıcı',
        bio: `${name} - QART dijital kartvizit kullanıcısı`,
        phone: '+90 555 000 0000'
      }
    })

    console.log('✅ User registered successfully:', newUser.email)

    // Return user without password
    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı! Giriş yapabilirsiniz.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin,
        profile: newUser.profile
      }
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}