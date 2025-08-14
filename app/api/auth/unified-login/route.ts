import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { UniversalUserStore } from "@/lib/universal-user-store"

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
})

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

    console.log("🔐 Unified login attempt:", email)
    
    // Use universal user store (auto-detects environment)
    const user = await UniversalUserStore.authenticateUser(email, password)
    
    if (!user) {
      console.log("❌ Authentication failed:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      console.log("❌ User inactive:", email)
      return NextResponse.json(
        { success: false, message: "Hesap deaktif" },
        { status: 403 }
      )
    }

    console.log("✅ Login successful for:", email)
    
    // Create response
    const response = NextResponse.json({
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

    // Set cookie for session
    response.cookies.set('auth-token', Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin
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