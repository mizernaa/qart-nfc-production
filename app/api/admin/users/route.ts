import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { ProductionAuth } from '@/lib/production-auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all users...')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Check if we're in production (Vercel)
    const isVercelProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    
    if (isVercelProduction) {
      console.log("🌐 Using Production Auth (in-memory)")
      
      // Get all users from production auth
      let allUsers = await ProductionAuth.getAllUsers()
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        allUsers = allUsers.filter(user => 
          user.email.toLowerCase().includes(searchLower) || 
          user.name.toLowerCase().includes(searchLower)
        )
      }

      console.log(`👥 Found ${allUsers.length} users in production auth`)

      // Transform to match frontend expectations
      const users = allUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        emailVerified: true,
        createdAt: user.createdAt,
        lastLoginAt: user.createdAt, // Use createdAt as fallback
        profile: {
          slug: user.profile.slug,
          title: user.profile.title,
          bio: user.profile.bio,
          phone: user.profile.phone
        },
        subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: 0,
          profile: 1
        }
      }))

      const total = users.length

      return NextResponse.json({
        success: true,
        users,
        pagination: {
          page: 1,
          limit: total,
          total,
          pages: 1
        }
      })
      
    } else {
      console.log("💻 Using Local Prisma Database")
      
      const prisma = new PrismaClient()
      
      try {
        // Build search conditions
        const whereCondition = search ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } }
          ]
        } : {}

        // Fetch users with profile data
        const allUsers = await prisma.user.findMany({
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

        console.log(`👥 Found ${allUsers.length} users in database`)

        // Transform to match frontend expectations
        const users = allUsers.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          emailVerified: true,
          createdAt: user.createdAt.toISOString(),
          lastLoginAt: user.createdAt.toISOString(), // Use createdAt as fallback
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

        const total = users.length

        return NextResponse.json({
          success: true,
          users,
          pagination: {
            page: 1,
            limit: total,
            total,
            pages: 1
          }
        })
        
      } finally {
        await prisma.$disconnect()
      }
    }

  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('➕ Admin creating user:', body)
    
    const { name, email, password, isAdmin = false } = body
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 }
      )
    }

    // Check if we're in production (Vercel)
    const isVercelProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    
    if (isVercelProduction) {
      console.log("🌐 Using Production Auth (in-memory)")
      
      // Check if user already exists
      const existingUser = await ProductionAuth.findUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Bu email zaten kullanımda" },
          { status: 400 }
        )
      }

      // Create user in production auth
      const newUser = await ProductionAuth.createUser({
        name,
        email,
        password
      })

      // Override isAdmin if specified
      if (isAdmin && !newUser.isAdmin) {
        newUser.isAdmin = true
        newUser.profile.title = 'Sistem Yöneticisi'
        newUser.profile.companyName = 'QART Team'
      }

      console.log("✅ Admin created user in production:", email)

      return NextResponse.json({
        success: true,
        message: "Kullanıcı başarıyla oluşturuldu",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
          profile: newUser.profile
        }
      })
      
    } else {
      console.log("💻 Using Local Prisma Database")
      
      const prisma = new PrismaClient()
      
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })
        
        if (existingUser) {
          return NextResponse.json(
            { success: false, message: "Bu email zaten kullanımda" },
            { status: 400 }
          )
        }

        // Hash password
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(password, 12)
        
        // Create slug from name
        const baseSlug = name.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
        
        // Make sure slug is unique
        let slug = baseSlug
        let counter = 1
        while (await prisma.profile.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
        
        // First check if default theme exists, if not create it
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

        console.log("✅ Admin created user locally:", email)

        return NextResponse.json({
          success: true,
          message: "Kullanıcı başarıyla oluşturuldu",
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
            isActive: newUser.isActive,
            createdAt: newUser.createdAt.toISOString(),
            profile: {
              slug: newUser.profile?.slug
            }
          }
        })
        
      } finally {
        await prisma.$disconnect()
      }
    }

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
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting user:', userId)
    
    // Check if we're in production (Vercel)
    const isVercelProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    
    if (isVercelProduction) {
      console.log("🌐 Using Production Auth (in-memory)")
      
      const success = await ProductionAuth.deleteUser(userId)
      
      if (!success) {
        return NextResponse.json(
          { success: false, message: "User not found or cannot be deleted" },
          { status: 404 }
        )
      }
      
      console.log('✅ User deleted from production auth:', userId)
      
    } else {
      console.log("💻 Using Local Prisma Database")
      
      const prisma = new PrismaClient()
      
      try {
        // Check if user exists and is not admin
        const user = await prisma.user.findUnique({
          where: { id: userId }
        })
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
          )
        }
        
        if (user.isAdmin) {
          return NextResponse.json(
            { success: false, message: "Cannot delete admin user" },
            { status: 403 }
          )
        }
        
        // Delete user from database (Prisma will cascade delete profile)
        await prisma.user.delete({
          where: { id: userId }
        })
        
        console.log('✅ User deleted successfully:', user.email)
        
      } finally {
        await prisma.$disconnect()
      }
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
    // Get user ID from query params
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
      console.log('🔄 Toggling user status:', userId)
      
      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }
      
      const newStatus = !user.isActive
      
      // Update user status
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: newStatus }
      })
      
      console.log(`✅ User status changed: ${user.isActive} → ${newStatus}`)

      return NextResponse.json({
        success: true,
        message: "User status updated successfully"
      })
    } else {
      // Handle user update
      const body = await request.json()
      const { name, email, phone, isAdmin, isActive } = body
      
      console.log('📝 Updating user:', userId, body)
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      })
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }
      
      // Update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || user.name,
          email: email || user.email,
          isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin,
          isActive: isActive !== undefined ? isActive : user.isActive,
        }
      })
      
      // Update profile if exists and phone is provided
      if (user.profile && phone) {
        await prisma.profile.update({
          where: { userId: userId },
          data: { phone }
        })
      }
      
      console.log('✅ User updated successfully')
      
      return NextResponse.json({
        success: true,
        message: "User updated successfully"
      })
    }

  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}