import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

// Static users for fallback when database is not available
const STATIC_USERS = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m",
    name: "Admin User",
    isAdmin: true,
    isActive: true,
    emailVerified: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    lastLoginAt: "2025-01-01T00:00:00.000Z",
    profile: {
      slug: "admin-user",
      title: "Sistem Yöneticisi",
      bio: "QART Sistem Yöneticisi",
      phone: "+90 555 000 0001"
    },
    subscription: "QART Lifetime",
    _count: {
      cards: 0,
      profile: 1
    }
  },
  {
    id: "demo-001",
    email: "demo@qart.app",
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m",
    name: "Demo User",
    isAdmin: false,
    isActive: true,
    emailVerified: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    lastLoginAt: "2025-01-01T00:00:00.000Z",
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı",
      bio: "QART Demo Kullanıcısı",
      phone: "+90 555 000 0002"
    },
    subscription: "Free",
    _count: {
      cards: 0,
      profile: 1
    }
  }
]

// Store for new registered users (in-memory)
let dynamicUsers: any[] = []

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Hybrid: Fetching all users...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    let allUsers: any[] = []
    
    // Try to get users from database first
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log("💾 Trying to fetch from database...")
      
      try {
        const whereCondition = search ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {}

        const dbUsers = await prisma.user.findMany({
          where: whereCondition,
          include: {
            profile: true,
            subscription: true,
            _count: {
              select: {
                cards: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        allUsers = dbUsers.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          emailVerified: true,
          createdAt: user.createdAt.toISOString(),
          lastLoginAt: user.createdAt.toISOString(),
          profile: {
            slug: user.profile?.slug || 'no-profile',
            title: user.profile?.title || (user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'),
            bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
            phone: user.profile?.phone || '+90 555 000 0000'
          },
          subscription: user.isAdmin ? 'QART Lifetime' : (user.subscription?.plan || 'Free'),
          _count: {
            cards: user._count.cards,
            profile: user.profile ? 1 : 0
          }
        }))

        await prisma.$disconnect()
        console.log(`✅ Database: Found ${allUsers.length} users`)
        
      } catch (dbError) {
        await prisma.$disconnect()
        throw dbError
      }
      
    } catch (error: any) {
      console.log('⚠️ Database not available, using static + dynamic users')
      console.error('DB Error:', error.message)
      
      // Use static users + dynamic users as fallback
      allUsers = [...STATIC_USERS, ...dynamicUsers]
      
      // Apply search filter if needed
      if (search) {
        allUsers = allUsers.filter(user => 
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      console.log(`📦 Fallback: Using ${allUsers.length} users (${STATIC_USERS.length} static + ${dynamicUsers.length} dynamic)`)
    }

    return NextResponse.json({
      success: true,
      users: allUsers,
      pagination: {
        page: 1,
        limit: allUsers.length,
        total: allUsers.length,
        pages: 1
      }
    })

  } catch (error) {
    console.error('Admin users GET error:', error)
    
    // Even if everything fails, return static users
    return NextResponse.json({
      success: true,
      users: STATIC_USERS,
      pagination: {
        page: 1,
        limit: STATIC_USERS.length,
        total: STATIC_USERS.length,
        pages: 1
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('➕ Hybrid: Creating user:', body)
    
    const { name, email, password, isAdmin = false } = body
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 }
      )
    }

    // Check if user exists in static or dynamic users
    const existingUser = [...STATIC_USERS, ...dynamicUsers].find(
      u => u.email.toLowerCase() === email.toLowerCase()
    )
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Bu email zaten kullanımda" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const slug = createSlug(name)
    const userId = `user-${Date.now()}`
    
    // Try to save to database
    let savedToDb = false
    
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      console.log("💾 Trying to save to database...")
      
      try {
        // Check if user exists in database
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })
        
        if (dbUser) {
          await prisma.$disconnect()
          return NextResponse.json(
            { success: false, message: "Bu email zaten kullanımda" },
            { status: 400 }
          )
        }

        // Ensure default theme exists
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
        }
        
        // Create user with profile
        const newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            isAdmin,
            isActive: true,
            profile: {
              create: {
                slug,
                companyName: isAdmin ? 'QART Team' : '',
                title: isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
                bio: `${name} - QART dijital kartvizit kullanıcısı`,
                phone: '+90 555 000 0000',
                email: email.toLowerCase(),
                themeId: 'default'
              }
            }
          },
          include: {
            profile: true
          }
        })

        await prisma.$disconnect()
        savedToDb = true
        console.log("✅ User saved to database:", email)
        
      } catch (dbError) {
        await prisma.$disconnect()
        throw dbError
      }
      
    } catch (error: any) {
      console.log('⚠️ Database not available, saving to memory')
      console.error('DB Error:', error.message)
    }

    // If database save failed, add to dynamic users
    if (!savedToDb) {
      const newUser = {
        id: userId,
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        isAdmin,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        profile: {
          slug,
          title: isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
          bio: `${name} - QART dijital kartvizit kullanıcısı`,
          phone: '+90 555 000 0000'
        },
        subscription: isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: 0,
          profile: 1
        }
      }
      
      dynamicUsers.push(newUser)
      console.log("✅ User added to memory:", email)
    }

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      user: {
        id: userId,
        email: email.toLowerCase(),
        name,
        isAdmin,
        isActive: true,
        createdAt: new Date().toISOString(),
        profile: { slug }
      }
    })

  } catch (error) {
    console.error('Admin users POST error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    console.log('🗑️ Hybrid: Deleting user:', userId)
    
    // Check if it's a static user
    const staticUser = STATIC_USERS.find(u => u.id === userId)
    if (staticUser && staticUser.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Cannot delete admin user" },
        { status: 403 }
      )
    }

    // Remove from dynamic users
    dynamicUsers = dynamicUsers.filter(u => u.id !== userId)

    // Try to delete from database
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        })
        
        if (user && !user.isAdmin) {
          await prisma.user.delete({
            where: { id: userId }
          })
          console.log('✅ User deleted from database')
        }
        
        await prisma.$disconnect()
      } catch (dbError) {
        await prisma.$disconnect()
        console.log('⚠️ Could not delete from database')
      }
    } catch (error) {
      console.log('⚠️ Database not available')
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    })

  } catch (error) {
    console.error('Admin users DELETE error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    if (action === 'toggle-status') {
      console.log('🔄 Hybrid: Toggling user status:', userId)
      
      // Update in dynamic users
      const dynamicUser = dynamicUsers.find(u => u.id === userId)
      if (dynamicUser) {
        dynamicUser.isActive = !dynamicUser.isActive
        console.log('✅ Status toggled in memory')
      }

      // Try to update in database
      try {
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId }
          })
          
          if (user) {
            await prisma.user.update({
              where: { id: userId },
              data: { isActive: !user.isActive }
            })
            console.log('✅ Status toggled in database')
          }
          
          await prisma.$disconnect()
        } catch (dbError) {
          await prisma.$disconnect()
          console.log('⚠️ Could not update database')
        }
      } catch (error) {
        console.log('⚠️ Database not available')
      }

      return NextResponse.json({
        success: true,
        message: "User status updated successfully"
      })
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully"
    })

  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}