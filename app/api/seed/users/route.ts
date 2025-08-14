import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting production user seeding...')
    
    // Initialize database
    await DatabaseUserStore.initialize()
    
    const results = []
    
    // Default users to seed
    const defaultUsers = [
      {
        email: 'admin@qart.app',
        password: 'admin123',
        name: 'Admin User',
        isAdmin: true
      },
      {
        email: 'demo@qart.app', 
        password: 'demo123',
        name: 'Demo User',
        isAdmin: false
      }
    ]
    
    for (const userData of defaultUsers) {
      try {
        // Check if user exists
        const existingUser = await DatabaseUserStore.findUserByEmail(userData.email)
        
        if (existingUser) {
          console.log(`👤 User ${userData.email} already exists`)
          results.push({
            email: userData.email,
            status: 'exists',
            message: 'Already exists'
          })
          continue
        }
        
        // Create user
        const newUser = await DatabaseUserStore.registerUser(
          userData.email,
          userData.password,
          userData.name,
          userData.isAdmin
        )
        
        if (newUser) {
          console.log(`✅ Created user: ${userData.email}`)
          results.push({
            email: userData.email,
            status: 'created',
            message: 'Successfully created'
          })
        } else {
          results.push({
            email: userData.email,
            status: 'failed',
            message: 'Creation failed'
          })
        }
        
      } catch (userError: any) {
        console.error(`❌ Error creating user ${userData.email}:`, userError.message)
        results.push({
          email: userData.email,
          status: 'error',
          message: userError.message
        })
      }
    }
    
    // Get final user count
    const allUsers = await DatabaseUserStore.getAllUsers()
    console.log(`📊 Total users in database: ${allUsers.length}`)
    
    return NextResponse.json({
      success: true,
      message: 'Seeding completed',
      results,
      totalUsers: allUsers.length,
      users: allUsers.map(u => ({
        email: u.email,
        name: u.name,
        isAdmin: u.isAdmin,
        isActive: u.isActive
      }))
    })
    
  } catch (error: any) {
    console.error('❌ Seeding failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    }, { status: 500 })
  }
}