import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting production database seeding via API...')
    
    const prisma = new PrismaClient()
    
    try {
      // Default users to seed
      const users = [
        {
          email: 'admin@qart.app',
          password: 'admin123',
          name: 'Admin User',
          isAdmin: true,
          profile: {
            slug: 'admin-user',
            title: 'Sistem Yöneticisi',
            bio: 'QART Sistem Yöneticisi - Tüm sistem yetkileri',
            phone: '+90 555 000 0001',
            companyName: 'QART Team',
            website: 'https://qart.app',
            address: 'İstanbul, Türkiye'
          }
        },
        {
          email: 'demo@qart.app',
          password: 'demo123',
          name: 'Demo User',
          isAdmin: false,
          profile: {
            slug: 'demo-user',
            title: 'Demo Kullanıcısı',
            bio: 'QART Demo Kullanıcısı - Örnek profil',
            phone: '+90 555 000 0002',
            companyName: 'Demo Şirketi',
            website: 'https://demo.qart.app',
            address: 'Ankara, Türkiye'
          }
        },
        {
          email: 'omeraytac@gmail.com',
          password: 'omer123', // Default password for Ömer
          name: 'Ömer Aytaç',
          isAdmin: false,
          profile: {
            slug: 'omer-aytac',
            title: 'Kullanıcı',
            bio: 'Ömer Aytaç - QART dijital kartvizit kullanıcısı',
            phone: '+90 555 000 0000',
            companyName: '',
            website: '',
            address: ''
          }
        }
      ]

      // Check and create default theme
      let defaultTheme = await prisma.theme.findFirst({
        where: { id: 'default' }
      })
      
      if (!defaultTheme) {
        defaultTheme = await prisma.theme.create({
          data: {
            id: 'default',
            name: 'Varsayılan',
            primaryColor: '#3B82F6',
            secondaryColor: '#EF4444',
            backgroundColor: '#FFFFFF',
            textColor: '#111827',
            font: 'Inter',
            layout: 'modern',
            isDefault: true
          }
        })
        console.log('✅ Default theme created')
      }

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
          
          // Create user with profile
          const newUser = await prisma.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
              isAdmin: userData.isAdmin,
              isActive: true,
              emailVerified: new Date(),
              profile: {
                create: {
                  slug: userData.profile.slug,
                  companyName: userData.profile.companyName || '',
                  title: userData.profile.title,
                  bio: userData.profile.bio,
                  phone: userData.profile.phone,
                  email: userData.email,
                  address: userData.profile.address || '',
                  website: userData.profile.website || '',
                  themeId: 'default'
                }
              }
            },
            include: {
              profile: true
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
        message: 'Production database seeding completed',
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
    console.error('❌ Production seeding error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Production seeding failed',
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Production database seeding endpoint',
    usage: 'Send POST request to seed the database',
    users: [
      'admin@qart.app (Admin User)',
      'demo@qart.app (Demo User)', 
      'omeraytac@gmail.com (Ömer Aytaç)'
    ]
  })
}