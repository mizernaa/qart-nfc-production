import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

// Hardcoded test users for production emergency login
const EMERGENCY_USERS = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$sG81TSiNrDMsafDKzTgI6e3ADFSdPOnm1lPJ8dbZPcD5QsrdugSHK", // admin123
    name: "Admin User",
    isAdmin: true,
    isActive: true,
    profile: {
      slug: "admin-user",
      title: "Sistem Yöneticisi"
    }
  },
  {
    id: "demo-001",
    email: "demo@qart.app", 
    password: "$2b$12$zkCJrkabVur5cmn8.dBJw.I8zO2CTiHS5kO8SSaTPcS/SpspuBcCG", // demo123
    name: "Demo User",
    isAdmin: false,
    isActive: true,
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı"
    }
  }
]

export async function POST(request: NextRequest) {
  try {
    // DEAKTIF - Use /api/auth/db-login instead
    return NextResponse.json(
      { success: false, message: "Bu endpoint deaktif - /api/auth/db-login kullanın" },
      { status: 410 }
    )
    
    const { email, password } = await request.json()
    
    // Find user in emergency list
    const user = EMERGENCY_USERS.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı" },
        { status: 401 }
      )
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Geçersiz şifre" },
        { status: 401 }
      )
    }
    
    // Return user data
    return NextResponse.json({
      success: true,
      message: "Giriş başarılı (Emergency Mode)",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        profile: user.profile
      }
    })
    
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      { success: false, message: "Test login hatası", error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test login endpoint is ready",
    users: ["admin@qart.app", "demo@qart.app"],
    note: "Use POST with email and password"
  })
}