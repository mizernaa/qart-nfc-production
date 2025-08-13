import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// In-memory user storage for production fallback
let memoryUsers: any[] = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m", // admin123
    name: "Admin User",
    isAdmin: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    profile: {
      slug: "admin-user",
      title: "Sistem Yöneticisi",
      bio: "QART Sistem Yöneticisi",
      phone: "+90 555 000 0001",
      companyName: "QART Team"
    }
  },
  {
    id: "demo-001",
    email: "demo@qart.app", 
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m", // demo123
    name: "Demo User",
    isAdmin: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı", 
      bio: "QART Demo Kullanıcısı",
      phone: "+90 555 000 0002",
      companyName: ""
    }
  }
]

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 Public registration attempt:', { email: body.email, name: body.name })

    const { name, email, password } = body
    
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Name, email and password are required"
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor"
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const slug = createSlug(name)
    const userId = `user-${Date.now()}`

    // Create new user
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      profile: {
        slug,
        title: 'Kullanıcı',
        bio: `${name} - QART dijital kartvizit kullanıcısı`,
        phone: '',
        companyName: ''
      }
    }

    // Add to memory storage
    memoryUsers.push(newUser)

    console.log('✅ User registered successfully (memory storage):', email)

    return NextResponse.json({
      success: true,
      message: "Kayıt başarılı! Giriş yapabilirsiniz.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        slug: newUser.profile.slug
      }
    })

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu. Lütfen tekrar deneyin.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// Login endpoint for the registered users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const password = searchParams.get('password')
  
  if (!email || !password) {
    return NextResponse.json({
      success: false,
      message: "Email and password required"
    }, { status: 400 })
  }

  try {
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Kullanıcı bulunamadı"
      }, { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz şifre"
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        profile: user.profile
      }
    })

  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json({
      success: false,
      message: "Giriş işlemi sırasında hata oluştu"
    }, { status: 500 })
  }
}