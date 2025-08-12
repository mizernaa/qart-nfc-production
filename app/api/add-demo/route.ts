import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Adding demo user to database...')
    
    const prisma = new PrismaClient()
    
    try {
      // Check if demo user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: 'demo@qart.app' }
      })
      
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: 'Demo user already exists',
          user: existingUser
        })
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash('demo123', 12)
      
      // Create demo user
      const demoUser = await prisma.user.create({
        data: {
          email: 'demo@qart.app',
          password: hashedPassword,
          name: 'Demo User',
          isAdmin: false,
          isActive: true
        }
      })
      
      console.log('✅ Demo user created:', demoUser.email)
      
      return NextResponse.json({
        success: true,
        message: 'Demo user created successfully',
        user: demoUser
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error('❌ Error creating demo user:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create demo user',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Demo user creation endpoint',
    usage: 'Send POST request to create demo user',
    credentials: 'demo@qart.app / demo123'
  })
}