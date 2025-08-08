import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { userStore } from "@/lib/user-store"

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
    const existingUser = userStore.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Yeni kullanıcı oluştur
    const newUser = await userStore.addUser({
      email,
      password,
      name,
      isAdmin: isAdmin || false
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
    const users = userStore.getAllUsers()

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