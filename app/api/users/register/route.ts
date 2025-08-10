import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { vercelUserStore } from '@/lib/vercel-user-store'

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  isAdmin: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📝 Yeni kullanıcı kayıt isteği:", body)
    
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

    const { email, password, name, isAdmin } = validation.data

    // Vercel production ortamında mı kontrol et
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    
    if (isProduction) {
      // Production - Vercel in-memory store kullan
      console.log("🌐 Production mode - using Vercel store")
      
      const existingUser = await vercelUserStore.findByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Bu email zaten kullanımda" },
          { status: 400 }
        )
      }

      const hashedPassword = await vercelUserStore.hashPassword(password)
      
      // Create slug from name
      const slug = name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u') 
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')

      const newUser = await vercelUserStore.createUser({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        isAdmin: false, // Always false for public registration
        profile: {
          slug,
          title: 'Kullanıcı',
          bio: `${name} - QART dijital kartvizit kullanıcısı`,
          phone: '+90 555 000 0000',
          companyName: ''
        }
      })

      console.log("✅ User created in Vercel store:", email)

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla oluşturuldu",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          profile: newUser.profile
        }
      })
      
    } else {
      // Local development - File-based system
      console.log("💻 Local mode - using file system")
      
      const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
      
      let users = []
      try {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8')
        users = JSON.parse(usersData)
      } catch (error) {
        users = []
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Bu email zaten kullanımda" },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      
      const slug = name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u') 
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')

      const newUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        isAdmin: isAdmin || false,
        isActive: true,
        createdAt: new Date().toISOString(),
        profile: {
          slug,
          title: isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
          bio: `${name} - QART dijital kartvizit kullanıcısı`,
          phone: '+90 555 000 0000',
          companyName: isAdmin ? 'QART Team' : ''
        }
      }

      users.push(newUser)
      
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))

      console.log("✅ User created in file system:", email)

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla oluşturuldu",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          profile: newUser.profile
        }
      })
    }
    
  } catch (error) {
    console.error("❌ Register error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}