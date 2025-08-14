import { NextRequest, NextResponse } from "next/server"
import { DatabaseUserStore } from "@/lib/database-user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔐 DEBUG Login Test - Production')
    console.log('📧 Email:', email)
    console.log('🌐 Environment:', process.env.NODE_ENV)
    console.log('🔗 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔗 DATABASE_URL length:', process.env.DATABASE_URL?.length)
    console.log('🔗 DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 50))
    
    console.log('🔄 Initializing DatabaseUserStore...')
    await DatabaseUserStore.initialize()
    console.log('✅ DatabaseUserStore initialized')
    
    console.log('👤 Attempting authentication...')
    const user = await DatabaseUserStore.authenticateUser(email, password)
    console.log('👤 User found:', !!user)
    if (user) {
      console.log('👤 User email:', user.email)
      console.log('👤 User isAdmin:', user.isAdmin)
      console.log('👤 User isActive:', user.isActive)
    }

    return NextResponse.json({
      success: !!user,
      message: user ? 'Authentication successful' : 'Authentication failed',
      debug: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length,
        userFound: !!user,
        environment: process.env.NODE_ENV
      }
    })
    
  } catch (error: any) {
    console.error('❌ Login test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection error',
      error: error.message,
      debug: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        environment: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}