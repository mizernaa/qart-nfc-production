import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📝 Simple DB registration attempt:", body.email)
    
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

    const { email, password, name } = validation.data
    
    const prisma = new PrismaClient()
    
    try {
      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Bu email zaten kullanımda" },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Create user (NO profile relation)
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          isAdmin: false,
          isActive: true
        }
      })
      
      console.log("✅ User registered in database:", newUser.email)
      
      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = newUser
      
      return NextResponse.json({
        success: true,
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
        user: {
          ...userWithoutPassword,
          profile: {
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            title: 'Kullanıcı',
            bio: `${name} - QART dijital kartvizit kullanıcısı`
          }
        }
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error("❌ Simple DB register error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Kayıt sırasında hata oluştu",
        error: error.message 
      },
      { status: 500 }
    )
  }
}