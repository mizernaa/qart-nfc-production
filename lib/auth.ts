import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './db'

// JWT Secret - production'da güvenli olmalı
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

export interface AuthUser {
  id: string
  email: string
  name: string
  isAdmin: boolean
  isActive: boolean
}

// Şifre hash'leme
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Şifre doğrulama
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT token oluşturma
export function createToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// JWT token doğrulama
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.userId,
      email: decoded.email,
      name: '', // Token'da name yok, database'den alınacak
      isAdmin: decoded.isAdmin,
      isActive: decoded.isActive
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Request'ten token al
export function getTokenFromRequest(request: NextRequest): string | null {
  // Authorization header'dan
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Cookie'den
  const cookies = request.headers.get('cookie')
  if (cookies) {
    const tokenCookie = cookies
      .split(';')
      .find(cookie => cookie.trim().startsWith('auth-token='))
    
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
  }

  return null
}

// Kullanıcı authentication
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  // GEÇİCİ: Database bağlantısı kurulana kadar hardcoded kullanıcılar
  const tempUsers = [
    {
      id: '1',
      email: 'admin@qart.app',
      password: 'SecureAdmin2025!',
      name: 'Admin User',
      isAdmin: true,
      isActive: true
    },
    {
      id: '2',
      email: 'demo@qart.app',
      password: 'DemoUser2025!',
      name: 'Demo User',
      isAdmin: false,
      isActive: true
    }
  ]

  // Temp user kontrolü
  const tempUser = tempUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (tempUser && tempUser.password === password) {
    return {
      id: tempUser.id,
      email: tempUser.email,
      name: tempUser.name,
      isAdmin: tempUser.isAdmin,
      isActive: tempUser.isActive
    }
  }

  // Database kontrolü (bağlantı kurulduğunda çalışacak)
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return null
    }

    if (!user.isActive) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return null
    }

    // Last login güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Request authentication middleware
export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return null
  }

  const decodedUser = verifyToken(token)
  if (!decodedUser) {
    return null
  }

  // Database'den güncel kullanıcı bilgilerini al
  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id }
    })

    if (!user || !user.isActive) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isActive: user.isActive
    }
  } catch (error) {
    console.error('Request authentication error:', error)
    return null
  }
}

// Admin kontrolü
export function requireAdmin(user: AuthUser | null): boolean {
  return user !== null && user.isAdmin && user.isActive
}

// Rate limiting için IP alma
export function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1'
}