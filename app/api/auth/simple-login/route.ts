import { NextRequest, NextResponse } from "next/server"
import { authenticateUser, createToken, getClientIP } from "@/lib/auth"
import { loginSchema } from "@/lib/validation"
import { authRateLimiter } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting kontrolü
    const clientIP = getClientIP(request)
    if (!authRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." 
        },
        { status: 429 }
      )
    }

    // Input validation
    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Geçersiz giriş bilgileri",
          errors: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    console.log("🔐 Secure login attempt:", email)

    // Kullanıcı authentication
    const user = await authenticateUser(email, password)
    
    if (!user) {
      console.log("❌ Failed login attempt:", email, "from IP:", clientIP)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    // JWT token oluştur
    const token = createToken(user)
    
    console.log("✅ Secure login successful for:", email)
    
    // Response headers ile secure cookie set et
    const response = NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      token
    })

    // Secure HTTP-only cookie set et
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
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