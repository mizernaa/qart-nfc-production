import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 SQLite kullanıcılarını düzeltiyorum...')
    
    // Önce mevcut kullanıcıları sil
    await prisma.user.deleteMany({})
    console.log('🗑️ Mevcut kullanıcılar temizlendi')
    
    // Admin kullanıcı
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@qart.app',
        password: adminPassword,
        name: 'Admin User',
        isAdmin: true,
        isActive: true
      }
    })
    
    // Demo kullanıcı
    const demoPassword = await bcrypt.hash('demo123', 12)
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@qart.app',
        password: demoPassword,
        name: 'Demo User',
        isAdmin: false,
        isActive: true
      }
    })
    
    console.log('✅ SQLite kullanıcıları başarıyla oluşturuldu')
    
    return NextResponse.json({
      success: true,
      message: 'SQLite kullanıcıları düzeltildi',
      users: [
        { email: adminUser.email, isAdmin: adminUser.isAdmin },
        { email: demoUser.email, isAdmin: demoUser.isAdmin }
      ]
    })

  } catch (error) {
    console.error('❌ SQLite kullanıcı düzeltme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Kullanıcılar düzeltilemedi', error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}