import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🧪 Starting authentication test for:', email)
    console.log('🔄 Testing persistence after hot reload')
    
    // Initialize database
    await DatabaseUserStore.initialize()
    console.log('✅ Database initialized')
    
    // Test findUserByEmail first
    const user = await DatabaseUserStore.findUserByEmail(email)
    console.log('👤 User found:', user ? `${user.email} (${user.name})` : 'null')
    
    if (user) {
      console.log('🔍 User details:')
      console.log('  - ID:', user.id)
      console.log('  - Active:', user.isActive)
      console.log('  - Password hash exists:', !!user.password)
      console.log('  - Password hash length:', user.password?.length)
    }
    
    // Test authentication
    const authenticatedUser = await DatabaseUserStore.authenticateUser(email, password)
    console.log('🔐 Authentication result:', authenticatedUser ? 'SUCCESS' : 'FAILED')
    
    return NextResponse.json({
      success: true,
      test: {
        email,
        userExists: !!user,
        userActive: user?.isActive,
        passwordHashExists: !!user?.password,
        authenticationPassed: !!authenticatedUser
      }
    })
    
  } catch (error) {
    console.error('❌ Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}