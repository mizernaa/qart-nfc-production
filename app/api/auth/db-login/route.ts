import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from "zod"

// Validation schema
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
    console.log("🔐 Database Login attempt:", email)
    
    const prisma = new PrismaClient()
    
    try {
      // Find user in PostgreSQL database ONLY
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Geçersiz email veya şifre" },
          { status: 401 }
        )
      }
      
      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { success: false, message: "Hesabınız devre dışı bırakılmış" },
          { status: 401 }
        )
      }
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password)
      
      if (!validPassword) {
        return NextResponse.json(
          { success: false, message: "Geçersiz email veya şifre" },
          { status: 401 }
        )
      }
      
      console.log("✅ User authenticated from database:", user.email)
      
      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user
      
      return NextResponse.json({
        success: true,
        message: "Giriş başarılı",
        user: {
          ...userWithoutPassword,
          profile: {
            slug: user.name.toLowerCase().replace(/\s+/g, '-'),
            title: user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'
          }
        }
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error("❌ Database login error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Sunucu hatası",
        error: error.message 
      },
      { status: 500 }
    )
  }
}