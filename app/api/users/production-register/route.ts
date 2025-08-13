import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

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

// File system functions
function getUsersFilePath() {
  return path.join(process.cwd(), 'data', 'users.json')
}

function readUsersFromFile() {
  try {
    const filePath = getUsersFilePath()
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users file:', error)
  }
  return []
}

function writeUsersToFile(users: any[]) {
  try {
    const filePath = getUsersFilePath()
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
    return true
  } catch (error) {
    console.error('Error writing users file:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 Production registration attempt:', { email: body.email, name: body.name })

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
    const userId = `user-${Date.now()}`

    // First try database (if available)
    let registrationMethod = 'none'
    let newUser = null

    // Try Prisma database if available
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log('💾 Trying database registration...')
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
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

      // Create user
      newUser = await prisma.user.create({
        data: {
          id: userId,
          email,
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
              phone: '+90 555 000 0000',
              themeId: 'default'
            }
          }
        },
        include: {
          profile: true
        }
      })

      await prisma.$disconnect()
      registrationMethod = 'database'
      console.log('✅ Database registration successful!')
      
    } catch (dbError: any) {
      console.log('⚠️ Database not available, falling back to file system...')
      console.error('DB Error:', dbError.message)
      registrationMethod = 'file'
    }

    // If database failed or not available, use file system (only in development)
    if ((registrationMethod === 'file' || !newUser) && process.env.NODE_ENV !== 'production') {
      console.log('📁 Using file system registration...')
      
      // Read existing users
      const users = readUsersFromFile()
      
      // Check if user exists
      const existingUser = users.find((u: any) => u.email === email)
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "Bu email adresi zaten kullanılıyor"
        }, { status: 409 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user
      newUser = {
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

      // Add to users array
      users.push(newUser)
      
      // Save to file
      const saved = writeUsersToFile(users)
      if (!saved) {
        throw new Error('Kullanıcı kaydedilemedi')
      }

      registrationMethod = 'file'
      console.log('✅ File system registration successful!')
    }
    
    // If in production and database failed, return error
    if (!newUser && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        message: "Veritabanı bağlantı hatası. Lütfen tekrar deneyin."
      }, { status: 503 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Kullanıcı başarıyla kaydedildi (${registrationMethod})`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        slug: newUser.profile?.slug || slug,
        isAdmin: false
      }
    })

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu",
      error: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}