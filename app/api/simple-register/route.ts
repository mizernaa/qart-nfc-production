import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
})

// In-memory user storage for production (temporary)
const REGISTERED_USERS = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📝 Simple registration attempt:", body.email)
    
    // Validate input
    const validation = registerSchema.safeParse(body)
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

    const { email, password, name } = validation.data

    // Check if user already registered in this session
    if (REGISTERED_USERS.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Check against hardcoded users
    const hardcodedEmails = ['admin@qart.app', 'demo@qart.app']
    if (hardcodedEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Bu email sistem hesabı olarak rezerve edilmiş" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create slug from name
    const slug = name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u') 
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')

    // Create user object
    const newUser = {
      id: `user-${Date.now()}`,
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
        phone: '+90 555 000 0000',
        companyName: ''
      }
    }

    // Store in memory (will reset on server restart)
    REGISTERED_USERS.set(email.toLowerCase(), newUser)

    console.log("✅ User registered in memory:", email)
    console.log("📊 Total registered users in this session:", REGISTERED_USERS.size)

    return NextResponse.json({
      success: true,
      message: "Kayıt başarılı! Giriş yapabilirsiniz.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin,
        profile: newUser.profile
      }
    })
    
  } catch (error) {
    console.error("❌ Simple register error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Return registered users count for debugging
  return NextResponse.json({
    message: "Simple register endpoint",
    registeredUsersInSession: REGISTERED_USERS.size,
    note: "Users are stored in memory and will reset on server restart"
  })
}