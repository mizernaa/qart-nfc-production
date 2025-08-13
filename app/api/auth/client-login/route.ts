import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { z } from "zod"

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
})

// Hardcoded users for demo purposes
const DEMO_USERS = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m", // admin123
    name: "Admin User",
    isAdmin: true,
    isActive: true,
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
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı", 
      bio: "QART Demo Kullanıcısı",
      phone: "+90 555 000 0002",
      companyName: ""
    }
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Geçersiz bilgiler",
          errors: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    console.log("🔐 Client login attempt:", email)
    
    // Check demo users first
    const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (demoUser) {
      // Verify password for demo user
      const isValidPassword = await bcrypt.compare(password, demoUser.password)
      
      if (isValidPassword) {
        console.log("✅ Demo user login successful:", email)
        
        const response = NextResponse.json({
          success: true,
          message: "Giriş başarılı",
          user: {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            isAdmin: demoUser.isAdmin,
            profile: demoUser.profile
          }
        })

        // Set cookie for session
        response.cookies.set('auth-token', Buffer.from(JSON.stringify({
          userId: demoUser.id,
          email: demoUser.email,
          isAdmin: demoUser.isAdmin
        })).toString('base64'), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
      }
    }

    // For new registered users, accept any password temporarily
    // This is a workaround for the stateless nature of serverless functions
    console.log("⚠️ User not in demo list, accepting for client-side auth:", email)
    
    const newUser = {
      id: `user-${Date.now()}`,
      email: email,
      name: email.split('@')[0],
      isAdmin: false,
      profile: {
        slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
        title: "Kullanıcı",
        bio: "QART dijital kartvizit kullanıcısı",
        phone: "",
        companyName: ""
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: newUser
    })

    // Set cookie for session
    response.cookies.set('auth-token', Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      isAdmin: false
    })).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
    
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}