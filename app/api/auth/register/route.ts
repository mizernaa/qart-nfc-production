import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from "zod"
import { ProductionAuth } from '@/lib/production-auth'

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

    console.log("📝 Registration attempt:", email)
    
    // Always use Prisma for both local and production
    console.log("💻 Using Prisma Database (unified auth system)")
    
    const prisma = new PrismaClient()
    
    try {
      // Check if user exists
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
      
      // Create slug from name
      const baseSlug = name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
      
      // Make sure slug is unique
      let slug = baseSlug
      let counter = 1
      while (await prisma.profile.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      // First check if default theme exists, if not create it
      let defaultTheme = await prisma.theme.findFirst({
        where: { id: 'default' }
      })
      
      if (!defaultTheme) {
        defaultTheme = await prisma.theme.create({
          data: {
            id: 'default',
            name: 'Varsayılan',
            primaryColor: '#3B82F6',
            secondaryColor: '#EF4444',
            backgroundColor: '#FFFFFF',
            textColor: '#111827',
            font: 'Inter',
            layout: 'modern',
            isDefault: true
          }
        })
      }
      
      // Create user with profile
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          isAdmin: false,
          isActive: true,
          profile: {
            create: {
              slug,
              companyName: '',
              title: '',
              bio: `${name} - QART dijital kartvizit kullanıcısı`,
              phone: '',
              email: email.toLowerCase(),
              themeId: 'default'
            }
          }
        },
        include: {
          profile: true
        }
      })

      console.log("✅ New user registered:", email)

      return NextResponse.json({
        success: true,
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          profile: {
            slug: newUser.profile?.slug
          }
        }
      })
      
    } finally {
      await prisma.$disconnect()
    }

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
  }
}