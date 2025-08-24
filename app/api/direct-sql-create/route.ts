import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { Pool } = require('pg')
    
    // Create PostgreSQL connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })

    console.log('🔗 Connecting to production database...')
    
    // Direct SQL execution to bypass Prisma prepared statement issues
    const userId = `user_${Date.now()}`
    const profileId = `profile_${Date.now()}`  
    const subscriptionId = `sub_${Date.now()}`
    const hashedPassword = '$2b$12$5uzV/AXh0DpY9vapY258PeVc4xJnhKLSh2Bqj2WkdTlw.bjSQdUVG' // omer123
    
    await pool.query('BEGIN')
    
    // Insert user
    await pool.query(`
      INSERT INTO "User" (
        id, email, password, name, "isActive", "isAdmin", 
        "createdAt", "updatedAt", "emailVerified"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)
    `, [userId, 'omeraytac@gmail.com', hashedPassword, 'Ömer Aytaç', true, false, true])
    
    // Insert profile
    await pool.query(`
      INSERT INTO "Profile" (
        id, "userId", slug, title, bio, phone, "isPublic", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [profileId, userId, 'omer-aytac', 'CEO & Founder', 'QART Digital kullanıcısı', '+90 555 123 4567', true])
    
    // Insert subscription
    await pool.query(`
      INSERT INTO "Subscription" (
        id, "userId", plan, status, "currentPeriodEnd", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 year', NOW(), NOW())
    `, [subscriptionId, userId, 'Free', 'active'])
    
    await pool.query('COMMIT')
    
    console.log('✅ User created successfully in production!')
    
    await pool.end()
    
    return NextResponse.json({
      success: true,
      message: 'User created in production database',
      credentials: {
        email: 'omeraytac@gmail.com',
        password: 'omer123'
      }
    })
    
  } catch (error: any) {
    console.error('❌ Direct SQL creation failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create user via direct SQL',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Direct SQL user creation endpoint ready',
    instructions: 'POST to this endpoint to create user directly in production DB'
  })
}