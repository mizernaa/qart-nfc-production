import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Direct SQL approach to bypass Prisma issues
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email, password and name are required' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user directly with raw query to bypass prepared statement issues
    const userResponse = await fetch(process.env.DATABASE_URL!.replace('postgresql://', 'https://') + '/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          INSERT INTO "User" (id, email, password, name, "isActive", "isAdmin", "createdAt", "updatedAt") 
          VALUES (
            'user_' || EXTRACT(EPOCH FROM NOW())::TEXT,
            $1,
            $2,
            $3,
            true,
            false,
            NOW(),
            NOW()
          ) RETURNING id, email, name;
        `,
        params: [email, hashedPassword, name]
      })
    })

    if (!userResponse.ok) {
      throw new Error('Failed to create user in database')
    }

    const userData = await userResponse.json()

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userData
    })

  } catch (error: any) {
    console.error('❌ Emergency user creation failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    }, { status: 500 })
  }
}

// Alternative simple approach
export async function GET(request: NextRequest) {
  try {
    // Simple database connection test
    const connectionTest = await fetch(process.env.DATABASE_URL!.replace('postgresql://', 'https://') + '/health')
    
    return NextResponse.json({
      success: true,
      message: 'Emergency endpoint active',
      dbConnection: connectionTest.ok
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Emergency endpoint failed',
      error: error.message
    }, { status: 500 })
  }
}