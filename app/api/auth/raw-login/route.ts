import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 RAW Login attempt:", email)

    // Find user with raw SQL
    const users = await prisma.$queryRaw`
      SELECT id, email, password, name, "isAdmin", "isActive" 
      FROM "User" 
      WHERE email = ${email.toLowerCase()}
    ` as any[]
    
    console.log("👤 Raw query result:", users.length > 0 ? "User found" : "User not found")
    
    if (users.length === 0) {
      console.log("❌ User not found:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    const user = users[0]

    // Check if user is active
    if (!user.isActive) {
      console.log("❌ User inactive:", email)
      return NextResponse.json(
        { success: false, message: "Hesap deaktif" },
        { status: 403 }
      )
    }

    // Verify password
    console.log("🔑 Verifying password...")
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("✅ Password verification result:", isValidPassword)
    
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    console.log("✅ RAW Login successful for:", email)
    
    // Response - minimal user data
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
    console.error("❌ RAW Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası", error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}