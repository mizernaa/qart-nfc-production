import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  isAdmin: z.boolean().optional().default(false),
})

// In-memory kullanıcı veritabanı (geçici çözüm)
const users: any[] = [
  {
    id: '1',
    email: 'admin@qart.app',
    password: '$2b$12$ytZ9fcLAUT6gxC5o5apJieamjQmhSGp0tm0tixm6YcPO6S6hDvQYy',
    name: 'Admin User',
    isAdmin: true,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'demo@qart.app',
    password: '$2b$12$mRqLcA5sPaXIXRj5Vi74LOvDC5ZpEC/pxvoUjLQxP28kCJmHi45dK',
    name: 'Demo User',
    isAdmin: false,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    email: 'user@qart.app',
    password: '$2b$12$DhSNUCVQvd7kjfRcTtyoCOz2fzjSVZTzWfKPAmHBycnYEyZCVUKbK',
    name: 'Test User',
    isAdmin: false,
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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

    const { email, password, name, isAdmin } = validation.data

    // Email kontrolü
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password)

    // Yeni kullanıcı oluştur
    const newUser = {
      id: String(users.length + 1),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      isAdmin: isAdmin || false,
      isActive: true,
      createdAt: new Date()
    }

    // Kullanıcıyı ekle
    users.push(newUser)

    console.log("✅ Yeni kullanıcı eklendi:", email)

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin
      }
    })

  } catch (error) {
    console.error("❌ Kullanıcı kayıt hatası:", error)
    return NextResponse.json(
      { success: false, message: "Kullanıcı oluşturulamadı" },
      { status: 500 }
    )
  }
}

// Tüm kullanıcıları getir (admin için)
export async function GET(request: NextRequest) {
  try {
    // Basit kullanıcı listesi
    const userList = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      isAdmin: u.isAdmin,
      isActive: u.isActive,
      createdAt: u.createdAt
    }))

    return NextResponse.json({
      success: true,
      users: userList,
      total: userList.length
    })

  } catch (error) {
    console.error("❌ Kullanıcı listesi hatası:", error)
    return NextResponse.json(
      { success: false, message: "Kullanıcılar getirilemedi" },
      { status: 500 }
    )
  }
}