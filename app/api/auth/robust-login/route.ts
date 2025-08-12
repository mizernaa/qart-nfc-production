import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { z } from "zod"
import fs from 'fs'
import path from 'path'

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
})

export async function POST(request: NextRequest) {
  try {
    // DEAKTIF - Use /api/auth/db-login instead
    return NextResponse.json(
      { success: false, message: "Bu endpoint deaktif - /api/auth/db-login kullanın" },
      { status: 410 }
    )
    
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
    console.log("🔐 Robust Login attempt:", email)
    
    // Try Prisma database first
    let user = null
    let authMethod = null
    
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log("🗄️ Trying Prisma database...")
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { profile: true }
      })
      
      await prisma.$disconnect()
      
      if (user) {
        console.log("✅ User found in Prisma database")
        authMethod = 'prisma'
      }
    } catch (prismaError) {
      console.log("❌ Prisma database failed:", prismaError.message)
    }
    
    // If Prisma fails, try file system
    if (!user) {
      try {
        console.log("📁 Trying file system...")
        const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
        const usersData = fs.readFileSync(usersFilePath, 'utf-8')
        const users = JSON.parse(usersData)
        
        const fileUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
        
        if (fileUser) {
          // Convert file user to database-like format
          user = {
            id: fileUser.id,
            email: fileUser.email,
            password: fileUser.password,
            name: fileUser.name,
            isAdmin: fileUser.isAdmin,
            isActive: fileUser.isActive,
            profile: fileUser.profile ? {
              id: fileUser.id + '-profile',
              slug: fileUser.profile.slug || fileUser.name.toLowerCase().replace(/\s+/g, '-')
            } : null
          }
          console.log("✅ User found in file system")
          authMethod = 'file'
        }
      } catch (fileError) {
        console.log("❌ File system failed:", fileError.message)
      }
    }
    
    if (!user) {
      console.log("❌ User not found in any system:", email)
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

    console.log(`✅ Login successful for: ${email} (method: ${authMethod})`)
    
    // Response
    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      authMethod,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        profile: user.profile
      }
    })
    
  } catch (error) {
    console.error("❌ Robust Login error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Sunucu hatası",
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}