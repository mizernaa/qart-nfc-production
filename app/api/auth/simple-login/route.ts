import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from "zod"
import { ProductionAuth } from '@/lib/production-auth'

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

    console.log("🔐 Login attempt:", email)
    
    // Always use Prisma for both local and production
    console.log("💻 Using Prisma Database (unified auth system)")
    
    const prisma = new PrismaClient()
    
    try {
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase() 
        },
        include: {
          profile: true
        }
      })
      
      if (!user) {
        console.log("❌ User not found:", email)
        return NextResponse.json(
          { success: false, message: "Geçersiz email veya şifre" },
          { status: 401 }
        )
      }

      // Check if user is active
      if (!user.isActive) {
        console.log("❌ User inactive:", email)
        return NextResponse.json(
          { success: false, message: "Hesap deaktif" },
          { status: 403 }
        )
      }

      // Verify password
      console.log("🔑 Verifying password for user:", email)
      const isValidPassword = await bcrypt.compare(password, user.password)
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
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}