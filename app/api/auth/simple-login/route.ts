import { NextRequest, NextResponse } from "next/server"
import { prismaUserStore } from "@/lib/prisma-user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Login attempt:", email)

    // Kullanıcıyı bul
    const user = await prismaUserStore.findByEmail(email)
    
    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    // Kullanıcı aktif mi?
    if (!user.isActive) {
      console.log("❌ User inactive:", email)
      return NextResponse.json(
        { success: false, message: "Hesap deaktif" },
        { status: 403 }
      )
    }

    // Şifre doğrulama
    const isValidPassword = await prismaUserStore.verifyPassword(user, password)
    
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    // Last login güncelle
    await prismaUserStore.updateLastLogin(user.id)

    console.log("✅ Login successful for:", email)
    
    // Response
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
    
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}