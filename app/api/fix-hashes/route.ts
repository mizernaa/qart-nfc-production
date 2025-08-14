import { NextRequest, NextResponse } from 'next/server'
import { CentralUserStore } from '@/lib/central-user-store'

export async function POST(request: NextRequest) {
  try {
    // Fix admin password hash
    const adminUser = CentralUserStore.findUserByEmail('admin@qart.app')
    if (adminUser) {
      CentralUserStore.updateUser(adminUser.id, {
        password: '$2b$12$wv0CF9GyATjsdvseYavikOqqKdsu31Up7QBKh0y2pgnivU1XEcdKu' // admin123
      })
    }
    
    // Fix demo password hash  
    const demoUser = CentralUserStore.findUserByEmail('demo@qart.app')
    if (demoUser) {
      CentralUserStore.updateUser(demoUser.id, {
        password: '$2b$12$OZHt88RF8lC2NDy6e0IsHO5hgtX7wom71.II0CO.9JKx5vCb0L8uO' // demo123
      })
    }
    
    const users = CentralUserStore.getAllUsers()
    
    return NextResponse.json({
      success: true,
      message: 'Password hashes fixed',
      userCount: users.length,
      adminFixed: !!adminUser,
      demoFixed: !!demoUser
    })
    
  } catch (error) {
    console.error('Error fixing hashes:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fix hashes' },
      { status: 500 }
    )
  }
}