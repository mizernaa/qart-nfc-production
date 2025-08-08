import { NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Login attempt:", email)

    // Kullanıcı doğrulama
    const user = await userStore.verifyPassword(email, password)
    
    if (!user) {
      console.log("❌ Invalid credentials for:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    console.log("✅ Login successful for:", email)
    
    // Response
    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    })
    
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}