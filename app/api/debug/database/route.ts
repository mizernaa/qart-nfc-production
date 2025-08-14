import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('👥 Total users in database:', userCount)
    
    // Test specific user
    const testUser = await prisma.user.findUnique({
      where: { email: 'dbtest@qart.app' },
      include: { profile: true }
    })
    
    if (testUser) {
      console.log('✅ Found test user:', testUser.email)
      console.log('🔑 Password hash:', testUser.password)
      
      // Test password verification
      const isValid = await bcrypt.compare('test123', testUser.password)
      console.log('🔐 Password check result:', isValid)
      
      return NextResponse.json({
        success: true,
        userCount,
        testUser: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          passwordValid: isValid
        }
      })
    } else {
      console.log('❌ Test user not found')
      return NextResponse.json({
        success: false,
        message: 'Test user not found',
        userCount
      })
    }
    
  } catch (error) {
    console.error('❌ Database debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}