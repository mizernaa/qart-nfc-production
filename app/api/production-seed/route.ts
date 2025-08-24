import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Production için özel database bağlantısı
    const { PrismaClient } = require('@prisma/client')
    
    const productionPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      log: ['error']
    })
    
    console.log('🌱 Creating production user...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash('omer123', 12)
    
    // Create user with minimal approach
    const user = await productionPrisma.user.create({
      data: {
        id: `user_${Date.now()}`,
        email: 'omeraytac@gmail.com',
        password: hashedPassword,
        name: 'Ömer Aytaç',
        isActive: true,
        isAdmin: false,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ User created:', user.email)
    
    // Create profile
    const profile = await productionPrisma.profile.create({
      data: {
        id: `profile_${Date.now()}`,
        userId: user.id,
        slug: 'omer-aytac',
        title: 'CEO & Founder',
        bio: 'QART Digital kullanıcısı',
        phone: '+90 555 123 4567',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Profile created:', profile.slug)
    
    // Create subscription
    const subscription = await productionPrisma.subscription.create({
      data: {
        id: `sub_${Date.now()}`,
        userId: user.id,
        plan: 'Free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Subscription created:', subscription.plan)
    
    await productionPrisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Production user created successfully',
      user: {
        email: user.email,
        name: user.name,
        slug: profile.slug
      },
      credentials: {
        email: 'omeraytac@gmail.com',
        password: 'omer123'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Production seed failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create production user',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Production seed endpoint ready',
    instructions: 'POST to create omeraytac@gmail.com / omer123'
  })
}