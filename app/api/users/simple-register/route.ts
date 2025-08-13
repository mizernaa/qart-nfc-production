import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
})

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()
  
  try {
    const body = await request.json()
    console.log('🔐 Simple registration attempt:', { email: body.email, name: body.name })

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz bilgiler: " + validation.error.issues.map(i => i.message).join(', ')
      }, { status: 400 })
    }

    const { email, password, name } = validation.data
    const slug = createSlug(name)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor"
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Ensure default theme exists
    let defaultTheme = await prisma.theme.findUnique({
      where: { id: 'default' }
    })

    if (!defaultTheme) {
      defaultTheme = await prisma.theme.create({
        data: {
          id: 'default',
          name: 'Default',
          primaryColor: '#3b82f6',
          secondaryColor: '#1f2937',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          font: 'Inter',
          layout: 'modern',
          isDefault: true
        }
      })
    }

    // Generate unique slug
    let finalSlug = slug
    let counter = 1
    while (await prisma.profile.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`
      counter++
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
            slug: finalSlug,
            companyName: '',
            title: 'Kullanıcı',
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

    console.log('✅ User registered successfully:', newUser.email)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Kayıt başarılı! Giriş yapabilirsiniz.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        slug: newUser.profile?.slug || finalSlug
      }
    })

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor"
      }, { status: 409 })
    }
    
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu. Lütfen tekrar deneyin.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}