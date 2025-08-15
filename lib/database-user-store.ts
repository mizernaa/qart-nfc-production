// Database-backed User Management System
// This replaces the file-based system with persistent SQLite storage

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Initialize Prisma client with explicit datasource URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_NEW || process.env.DATABASE_URL
    }
  }
})

interface UserWithProfile {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  lastLoginAt?: Date
  profile?: {
    slug: string
    title: string
    bio: string
    phone: string
    whatsapp?: string
    website?: string
    address?: string
    companyName?: string
    profileImage?: string
    coverImageUrl?: string
    logoUrl?: string
    isPublic?: boolean
    theme?: string
  }
  subscription: string
  _count: {
    cards: number
    profile: number
  }
}

// Default admin user
const DEFAULT_ADMIN = {
  email: 'admin@qart.app',
  password: 'admin123', // Will be hashed
  name: 'Admin User',
  isAdmin: true,
  slug: 'admin-user'
}

// Default demo user
const DEFAULT_DEMO = {
  email: 'demo@qart.app', 
  password: 'demo123', // Will be hashed
  name: 'Demo User',
  isAdmin: false,
  slug: 'demo-user'
}

// Ensure default users exist
async function ensureDefaultUsers() {
  try {
    // Check if admin exists
    const adminExists = await prisma.user.findUnique({
      where: { email: DEFAULT_ADMIN.email }
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12)
      
      await prisma.user.create({
        data: {
          email: DEFAULT_ADMIN.email,
          password: hashedPassword,
          name: DEFAULT_ADMIN.name,
          isAdmin: DEFAULT_ADMIN.isAdmin,
          profile: {
            create: {
              slug: DEFAULT_ADMIN.slug,
              title: 'Sistem Yöneticisi',
              bio: 'QART Sistem Yöneticisi',
              phone: '+90 555 000 0001',
              companyName: 'QART Team'
            }
          }
        }
      })
      console.log('✅ Admin user created')
    }

    // Check if demo exists
    const demoExists = await prisma.user.findUnique({
      where: { email: DEFAULT_DEMO.email }
    })

    if (!demoExists) {
      const hashedPassword = await bcrypt.hash(DEFAULT_DEMO.password, 12)
      
      await prisma.user.create({
        data: {
          email: DEFAULT_DEMO.email,
          password: hashedPassword,
          name: DEFAULT_DEMO.name,
          isAdmin: DEFAULT_DEMO.isAdmin,
          profile: {
            create: {
              slug: DEFAULT_DEMO.slug,
              title: 'Demo Kullanıcısı',
              bio: 'QART Demo Kullanıcısı', 
              phone: '+90 555 000 0002',
              companyName: ''
            }
          }
        }
      })
      console.log('✅ Demo user created')
    }
    
  } catch (error) {
    console.error('❌ Error ensuring default users:', error)
  }
}

// Database User Store Class
export class DatabaseUserStore {
  
  // Initialize - ensure default users exist
  static async initialize() {
    await ensureDefaultUsers()
  }
  
  // Get all users with profile data
  static async getAllUsers(): Promise<UserWithProfile[]> {
    try {
      const users = await prisma.user.findMany({
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        },
        orderBy: [
          { isAdmin: 'desc' }, // Admin first
          { createdAt: 'asc' }
        ]
      })

      return users.map(user => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        emailVerified: true, // Simplified for now
        createdAt: user.createdAt,
        lastLoginAt: user.updatedAt,
        profile: user.profile ? {
          slug: user.profile.slug,
          title: user.profile.title || (user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'),
          bio: user.profile.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
          phone: user.profile.phone || '+90 555 000 0000',
          companyName: user.profile.companyName || (user.isAdmin ? 'QART Team' : '')
        } : undefined,
        subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: user._count?.cards || 0,
          profile: user.profile ? 1 : 0
        }
      }))

    } catch (error) {
      console.error('❌ Error getting users:', error)
      return []
    }
  }
  
  // Find user by email
  static async findUserByEmail(email: string): Promise<UserWithProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        }
      })

      if (!user) return null

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        emailVerified: true,
        createdAt: user.createdAt,
        lastLoginAt: user.updatedAt,
        profile: user.profile ? {
          slug: user.profile.slug,
          title: user.profile.title || (user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'),
          bio: user.profile.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
          phone: user.profile.phone || '+90 555 000 0000',
          whatsapp: (user.profile as any).whatsapp,
          website: (user.profile as any).website,
          address: (user.profile as any).address,
          companyName: user.profile.companyName || (user.isAdmin ? 'QART Team' : ''),
          profileImage: (user.profile as any).profileImage,
          coverImageUrl: (user.profile as any).coverImageUrl,
          logoUrl: (user.profile as any).logoUrl,
          isPublic: (user.profile as any).isPublic !== false,
          theme: (user.profile as any).theme || 'modern'
        } : undefined,
        subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: user._count?.cards || 0,
          profile: user.profile ? 1 : 0
        }
      }

    } catch (error) {
      console.error('❌ Error finding user:', error)
      return null
    }
  }

  // Get user by email (without password check)
  static async getUserByEmail(email: string): Promise<UserWithProfile | null> {
    try {
      console.log('👤 Getting user by email:', email)
      return await this.findUserByEmail(email)
    } catch (error) {
      console.error('❌ Error getting user by email:', error)
      return null
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserWithProfile | null> {
    try {
      console.log('👤 Getting user by ID:', id)
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        }
      })

      if (!user) {
        console.log('❌ User not found:', id)
        return null
      }

      console.log('✅ User found:', user.email)

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        emailVerified: true,
        createdAt: user.createdAt,
        lastLoginAt: user.updatedAt,
        profile: user.profile ? {
          slug: user.profile.slug,
          title: user.profile.title || (user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı'),
          bio: user.profile.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
          phone: user.profile.phone || '+90 555 000 0000',
          whatsapp: (user.profile as any).whatsapp,
          website: (user.profile as any).website,
          address: (user.profile as any).address,
          companyName: user.profile.companyName || (user.isAdmin ? 'QART Team' : ''),
          profileImage: (user.profile as any).profileImage,
          coverImageUrl: (user.profile as any).coverImageUrl,
          logoUrl: (user.profile as any).logoUrl,
          isPublic: (user.profile as any).isPublic !== false,
          theme: (user.profile as any).theme || 'modern'
        } : undefined,
        subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: user._count?.cards || 0,
          profile: user.profile ? 1 : 0
        }
      }

    } catch (error) {
      console.error('❌ Error getting user by ID:', error)
      return null
    }
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string): Promise<UserWithProfile | null> {
    try {
      console.log('🔐 Authenticating user:', email)
      const user = await this.findUserByEmail(email)
      if (!user || !user.isActive) {
        console.log('❌ User not found or inactive')
        return null
      }

      console.log('🔑 Comparing password for user:', email)
      console.log('🔑 Stored hash:', user.password)
      const isValidPassword = await bcrypt.compare(password, user.password)
      console.log('🔑 Password valid:', isValidPassword)
      if (!isValidPassword) {
        return null
      }

      // Note: Skip updating last login for now due to Prisma client issue
      // This will be re-enabled once the client is properly regenerated
      
      return user

    } catch (error) {
      console.error('❌ Error authenticating user:', error)
      return null
    }
  }

  // Register new user
  static async registerUser(email: string, password: string, name: string, isAdmin: boolean = false): Promise<UserWithProfile | null> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (existingUser) {
        throw new Error('Bu email adresi zaten kullanılıyor')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create slug
      const baseSlug = name
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

      // Ensure unique slug
      let slug = baseSlug
      let counter = 1
      
      while (true) {
        const existingProfile = await prisma.profile.findUnique({
          where: { slug }
        })
        if (!existingProfile) break
        
        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Create user with profile
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          isAdmin,
          profile: {
            create: {
              slug,
              title: isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
              bio: `${name} - QART dijital kartvizit kullanıcısı`,
              phone: '+90 555 000 0000',
              companyName: isAdmin ? 'QART Team' : ''
            }
          }
        },
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        }
      })

      console.log('✅ User registered:', email)

      return {
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        isAdmin: newUser.isAdmin,
        isActive: newUser.isActive,
        emailVerified: true,
        createdAt: newUser.createdAt,
        lastLoginAt: newUser.updatedAt,
        profile: newUser.profile ? {
          slug: newUser.profile.slug,
          title: newUser.profile.title || 'Kullanıcı',
          bio: newUser.profile.bio || `${name} - QART dijital kartvizit kullanıcısı`,
          phone: newUser.profile.phone || '+90 555 000 0000',
          companyName: newUser.profile.companyName || ''
        } : undefined,
        subscription: newUser.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: newUser._count?.cards || 0,
          profile: newUser.profile ? 1 : 0
        }
      }

    } catch (error) {
      console.error('❌ Error registering user:', error)
      throw error
    }
  }

  // Update user
  static async updateUser(id: string, updates: Partial<{
    name: string
    email: string
    isAdmin: boolean
    isActive: boolean
    subscription: string
    profile: {
      slug: string
      title: string
      bio: string
      phone: string
      whatsapp: string
      website: string
      address: string
      companyName: string
      profileImage: string
      coverImageUrl: string
      logoUrl: string
      isPublic: boolean
      theme: string
    }
  }>): Promise<UserWithProfile | null> {
    try {
      const userData: any = {}
      const profileData: any = {}

      // Separate user fields from profile fields
      if (updates.name) userData.name = updates.name
      if (updates.email) userData.email = updates.email.toLowerCase()
      if (updates.isAdmin !== undefined) userData.isAdmin = updates.isAdmin
      if (updates.isActive !== undefined) userData.isActive = updates.isActive
      
      // Handle profile updates
      if (updates.profile) {
        Object.assign(profileData, updates.profile)
      }

      // Check if user has profile
      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: { profile: true }
      })

      if (!existingUser) {
        console.error('❌ User not found:', id)
        return null
      }

      // Update user with upsert for profile
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...userData,
          updatedAt: new Date(),
          ...(Object.keys(profileData).length > 0 && {
            profile: {
              upsert: {
                create: profileData,
                update: profileData
              }
            }
          })
        },
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        }
      })

      console.log('✅ User updated:', id)

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        password: updatedUser.password,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
        emailVerified: true,
        createdAt: updatedUser.createdAt,
        lastLoginAt: updatedUser.updatedAt,
        profile: updatedUser.profile ? {
          slug: updatedUser.profile.slug,
          title: updatedUser.profile.title || 'Kullanıcı',
          bio: updatedUser.profile.bio || `${updatedUser.name} - QART dijital kartvizit kullanıcısı`,
          phone: updatedUser.profile.phone || '+90 555 000 0000',
          companyName: updatedUser.profile.companyName || ''
        } : undefined,
        subscription: updatedUser.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: updatedUser._count?.cards || 0,
          profile: updatedUser.profile ? 1 : 0
        }
      }

    } catch (error) {
      console.error('❌ Error updating user:', error)
      return null
    }
  }

  // Delete user (non-admin only)
  static async deleteUser(id: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user || user.isAdmin) {
        return false // Cannot delete admin users
      }

      await prisma.user.delete({
        where: { id }
      })

      console.log('✅ User deleted:', id)
      return true

    } catch (error) {
      console.error('❌ Error deleting user:', error)
      return false
    }
  }

  // Toggle user status
  static async toggleUserStatus(id: string): Promise<UserWithProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user) return null

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isActive: !user.isActive,
          updatedAt: new Date()
        },
        include: {
          profile: true,
          _count: {
            select: {
              cards: true
            }
          }
        }
      })

      console.log('✅ User status toggled:', id, 'Active:', updatedUser.isActive)

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        password: updatedUser.password,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        isActive: updatedUser.isActive,
        emailVerified: true,
        createdAt: updatedUser.createdAt,
        lastLoginAt: updatedUser.updatedAt,
        profile: updatedUser.profile ? {
          slug: updatedUser.profile.slug,
          title: updatedUser.profile.title || 'Kullanıcı',
          bio: updatedUser.profile.bio || `${updatedUser.name} - QART dijital kartvizit kullanıcısı`,
          phone: updatedUser.profile.phone || '+90 555 000 0000',
          companyName: updatedUser.profile.companyName || ''
        } : undefined,
        subscription: updatedUser.isAdmin ? 'QART Lifetime' : 'Free',
        _count: {
          cards: updatedUser._count?.cards || 0,
          profile: updatedUser.profile ? 1 : 0
        }
      }

    } catch (error) {
      console.error('❌ Error toggling user status:', error)
      return null
    }
  }

  // Get statistics
  static async getStatistics() {
    try {
      const [totalUsers, activeUsers, adminUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isAdmin: true } })
      ])

      return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        premiumUsers: adminUsers // Currently admin = premium
      }

    } catch (error) {
      console.error('❌ Error getting statistics:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsers: 0,
        premiumUsers: 0
      }
    }
  }
}

export default DatabaseUserStore