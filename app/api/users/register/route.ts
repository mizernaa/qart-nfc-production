import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { vercelUserStore } from "@/lib/vercel-user-store"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  isAdmin: z.boolean().optional().default(false),
})

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
    const existingUser = await vercelUserStore.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
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

    // Yeni kullanıcı oluştur
    const newUser = await vercelUserStore.createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      isAdmin: isAdmin || false,
      profile: {
        slug,
        title: isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
        bio: `${name} - QART dijital kartvizit kullanıcısı`,
        phone: '+90 555 000 0000',
        companyName: isAdmin ? 'QART Team' : ''
      }
    })

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
    const users = await vercelUserStore.getAllUsers()

    return NextResponse.json({
      success: true,
      users: users,
      total: users.length
    })

  } catch (error) {
    console.error("❌ Kullanıcı listesi hatası:", error)
    return NextResponse.json(
      { success: false, message: "Kullanıcılar getirilemedi" },
      { status: 500 }
    )
  }
}