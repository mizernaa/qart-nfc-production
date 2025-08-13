import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

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

// File system fallback functions
function readUsersFromFile() {
  const filePath = path.join(process.cwd(), 'data', 'users.json')
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  }
  return []
}

function writeUsersToFile(users: any[]) {
  const filePath = path.join(process.cwd(), 'data', 'users.json')
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 Secure user registration:', { email: body.email, name: body.name })

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz bilgiler",
        errors: validation.error.issues
      }, { status: 400 })
    }

    const { email, password, name } = validation.data
    const slug = createSlug(name)
    const userId = `user-${Date.now()}`

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    try {
      // Try database first (Production)
      console.log('💾 Attempting database registration...')
      
      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "Bu email adresi zaten kullanılıyor"
        }, { status: 409 })
      }

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

      // Create user with profile in database
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email,
          password: hashedPassword,
          name,
          isAdmin: false, // Always false for new registrations
          isActive: true,
          profile: {
            create: {
              slug,
              companyName: '',
              title: 'Kullanıcı',
              bio: `${name} - QART dijital kartvizit kullanıcısı`,
              phone: '+90 555 000 0000',
              themeId: 'default'
            }
          }
        },
        include: {
          profile: true
        }
      })

      console.log('✅ Database registration successful!')

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla kaydedildi",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          slug: newUser.profile?.slug,
          isAdmin: false
        }
      })

    } catch (dbError) {
      // Database failed, fallback to file system
      console.log('⚠️ Database failed, using file system fallback...')
      console.error('Database error:', dbError)

      // File system fallback
      const users = readUsersFromFile()
      
      // Check if user exists in file
      const existingUser = users.find((u: any) => u.email === email)
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "Bu email adresi zaten kullanılıyor"
        }, { status: 409 })
      }

      // Create new user in file system
      const newUser = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        isAdmin: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        profile: {
          slug,
          title: 'Kullanıcı',
          bio: `${name} - QART dijital kartvizit kullanıcısı`,
          phone: '+90 555 000 0000',
          companyName: ''
        }
      }

      users.push(newUser)
      writeUsersToFile(users)

      console.log('✅ File system registration successful!')

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla kaydedildi (file system)",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          slug: newUser.profile.slug,
          isAdmin: false
        }
      })
    }

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}