import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Localhost login attempt:", email)

    // File-based kullanıcı sistemi (localhost için)
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
      console.log("📁 File-based users loaded:", users.length)
    } catch (error) {
      console.log("❌ Users file not found, creating fallback...")
      // Fallback kullanıcılar
      users = [
        {
          id: "admin-001",
          email: "admin@qart.app",
          password: "$2b$12$SSoUv/jalgW.AkrG65S1cunTu6ySwmgk2KAtgFoLqvl0.D//7FdKG",
          name: "Admin User",
          isAdmin: true,
          isActive: true
        },
        {
          id: "demo-001", 
          email: "demo@qart.app",
          password: "$2b$12$3G.uzJPIEdrQMqs5o3f69unNBFZ0n1YQLxUph0VXgkmemE34umQza",
          name: "Demo User",
          isAdmin: false,
          isActive: true
        }
      ]
    }

    // Kullanıcıyı bul
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    console.log("👤 User found:", user ? user.email : "NULL")
    
    if (!user) {
      console.log("❌ User not found:", email)
      console.log("📋 Available users:", users.map(u => u.email))
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    // Kullanıcı aktif mi?
    if (!user.isActive) {
      console.log("❌ User inactive:", email)
      return NextResponse.json(
        { success: false, message: "Hesap deaktif" },
        { status: 403 }
      )
    }

    // Şifre doğrulama
    console.log("🔑 Verifying password for user:", email)
    console.log("🔒 User password hash:", user.password ? user.password.substring(0, 10) + '...' : 'NO HASH')
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("✅ Password verification result:", isValidPassword)
    
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
      return NextResponse.json(
        { success: false, message: "Geçersiz email veya şifre" },
        { status: 401 }
      )
    }

    console.log("✅ Login successful for:", email)
    
    // Response
    return NextResponse.json({
      success: true,
      message: "Giriş başarılı",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        profile: user.profile
      }
    })
    
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    )
  }
}