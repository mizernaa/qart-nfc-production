import { NextRequest, NextResponse } from "next/server"
import { vercelUserStore } from "@/lib/vercel-user-store"

export async function POST(request: NextRequest) {
  // Force redeploy - Vercel login test 9 Ağustos 2025
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Login attempt:", email)
    console.log("🌐 Environment:", {
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV
    })

    // Kullanıcıyı bul (Vercel store - Pure in-memory)
    console.log("🔍 Searching for user with Vercel store...")
    const user = await vercelUserStore.findByEmail(email)
    console.log("👤 User search result:", user ? { email: user.email, isAdmin: user.isAdmin, id: user.id } : "NULL")
    
    if (!user) {
      console.log("❌ User not found:", email)
      // Log all available users for debugging
      const allUsers = await vercelUserStore.getAllUsers()
      console.log("📋 Available users:", allUsers.map(u => u.email))
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
    console.log("🔑 Verifying password for user:", email)
    console.log("🔒 User password hash:", user.password ? user.password.substring(0, 10) + '...' : 'NO HASH')
    const isValidPassword = await vercelUserStore.verifyPassword(user, password)
    console.log("✅ Password verification result:", isValidPassword)
    
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
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