import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting simple production database seeding...')
    
    const prisma = new PrismaClient()
    
    try {
      // Simple users without profiles or themes
      const users = [
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

      const results = []
      
      // Process each user
      for (const userData of users) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
          })
          
          if (existingUser) {
            console.log(`⏭️ User ${userData.email} already exists, skipping...`)
            results.push({
              email: userData.email,
              status: 'skipped',
              reason: 'already exists'
            })
            continue
          }
          
          // Hash password
          const hashedPassword = await bcrypt.hash(userData.password, 12)
          
          // Create user without profile (minimal)
          const newUser = await prisma.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
              isAdmin: userData.isAdmin,
              isActive: true,
              emailVerified: new Date()
            }
          })
          
          console.log(`✅ Created user: ${newUser.email} (${newUser.name})`)
          results.push({
            email: userData.email,
            status: 'created',
            name: userData.name,
            isAdmin: userData.isAdmin
          })
          
        } catch (error) {
          console.error(`❌ Error creating user ${userData.email}:`, error.message)
          results.push({
            email: userData.email,
            status: 'error',
            error: error.message
          })
        }
      }
      
      // Get final user count
      const totalUsers = await prisma.user.count()
      console.log(`📊 Total users in database: ${totalUsers}`)
      
      // List all users
      const allUsers = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          isAdmin: true,
          isActive: true
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Simple production database seeding completed',
        results,
        stats: {
          totalUsers,
          createdCount: results.filter(r => r.status === 'created').length,
          skippedCount: results.filter(r => r.status === 'skipped').length,
          errorCount: results.filter(r => r.status === 'error').length
        },
        users: allUsers
      })
      
    } finally {
      await prisma.$disconnect()
      console.log('✅ Database connection closed')
    }
    
  } catch (error) {
    console.error('❌ Simple seeding error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Simple seeding failed',
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Simple production database seeding endpoint',
    usage: 'Send POST request to seed basic users (admin + demo)',
    note: 'No profiles or themes - just core User table'
  })
}