import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from "zod"

const prisma = new PrismaClient()

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
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

    const { email, password, name } = validation.data

    console.log("📝 New registration attempt:", email)

    // Check if user exists
    const existingUsers = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${email.toLowerCase()}
    ` as any[]
    
    if (existingUsers.length > 0) {
      console.log("❌ Email already exists:", email)
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create unique ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Create user in database - ALWAYS isAdmin = false for new registrations
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, "isAdmin", "isActive", "createdAt")
      VALUES (${userId}, ${email.toLowerCase()}, ${hashedPassword}, ${name}, false, true, NOW())
    `
    
    console.log("✅ New user registered successfully:", email)

    return NextResponse.json({
      success: true,
      message: "Kayıt başarılı! Giriş yapabilirsiniz.",
      user: {
        id: userId,
        email: email.toLowerCase(),
        name: name,
        isAdmin: false // ALWAYS false for new users
      }
    })

  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Kayıt sırasında hata oluştu",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}