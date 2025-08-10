import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

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

    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
    } catch (error) {
      // Dosya yoksa boş array ile başla
      users = []
    }

    // Email kontrolü
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
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

    // Yeni kullanıcı oluştur
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

    // Kullanıcıyı ekle ve kaydet
    users.push(newUser)
    
    // Data klasörünü oluştur eğer yoksa
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Dosyaya kaydet
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))

    console.log("✅ Yeni kullanıcı file system'e eklendi:", email)

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
    
  } catch (error) {
    console.error("❌ Register error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}