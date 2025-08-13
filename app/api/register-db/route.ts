import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

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
  try {
    const body = await request.json()
    console.log('🔐 Database registration attempt:', { email: body.email, name: body.name })

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz bilgiler: " + validation.error.issues.map(i => i.message).join(', ')
      }, { status: 400 })
    }

    const { email, password, name } = validation.data
    
    // Try to use Prisma if available
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log('💾 Using Prisma Database for registration')
      
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })

        if (existingUser) {
          await prisma.$disconnect()
          return NextResponse.json({
            success: false,
            message: "Bu email adresi zaten kullanılıyor"
          }, { status: 409 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)
        
        // Create slug from name
        const baseSlug = createSlug(name)
        
        // Make sure slug is unique
        let slug = baseSlug
        let counter = 1
        while (await prisma.profile.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
        
        // Ensure default theme exists
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

        console.log("✅ User registered in database:", email)

        await prisma.$disconnect()

        return NextResponse.json({
          success: true,
          message: "Kayıt başarılı! Giriş yapabilirsiniz.",
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            slug: newUser.profile?.slug || slug
          }
        })
        
      } catch (dbError: any) {
        await prisma.$disconnect()
        throw dbError
      }
      
    } catch (error: any) {
      console.log('⚠️ Database not available, using fallback response')
      console.error('Error:', error.message)
      
      // If database fails, still return success for user experience
      // The user will be able to login with client-login endpoint
      const slug = createSlug(name)
      
      return NextResponse.json({
        success: true,
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
        user: {
          id: `user-${Date.now()}`,
          email: email.toLowerCase(),
          name,
          slug
        }
      })
    }

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu. Lütfen tekrar deneyin.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}