import bcrypt from 'bcryptjs'
import prisma from './prisma'
import prismaProduction from './prisma-production'

// Use different Prisma client based on environment
const dbClient = process.env.NODE_ENV === 'production' ? prismaProduction : prisma

export interface UserWithProfile {
  id: string
  email: string
  password?: string
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
    alternativePhone?: string
    whatsapp?: string
    email?: string
    alternativeEmail?: string
    website?: string
    address?: string
    city?: string
    district?: string
    country?: string
    postalCode?: string
    googleMapsUrl?: string
    workingHours?: any
    companyName?: string
    companyLegalName?: string
    companySlogan?: string
    companyDescription?: string
    companySector?: string
    companyFoundedYear?: string
    companyEmployeeCount?: string
    profileImage?: string
    coverImageUrl?: string
    logoUrl?: string
    themeId?: string
    theme?: string
    isPublic: boolean
    socialLinks?: any[]
    bankAccounts?: any[]
  }
  subscription: string
  _count?: {
    cards: number
    profile: number
  }
}

export class DatabaseUserStore {
  
  // Initialize the database connection
  static async initialize(): Promise<void> {
    try {
      console.log('🔄 Attempting to connect to database...')
      console.log('🔗 Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
      
      await dbClient.$connect()
      console.log('✅ PostgreSQL database connection established')
    } catch (error: any) {
      console.error('❌ Failed to connect to PostgreSQL database')
      console.error('Error message:', error?.message)
      console.error('Error code:', error?.code)
      console.error('Full error:', error)
      throw error
    }
  }

  // Helper function to map user profile data consistently
  private static mapUserProfile(user: any): UserWithProfile {
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
        alternativePhone: user.profile.alternativePhone,
        whatsapp: user.profile.whatsapp,
        email: user.profile.email,
        alternativeEmail: user.profile.alternativeEmail,
        website: user.profile.website,
        address: user.profile.address,
        city: user.profile.city,
        district: user.profile.district,
        country: user.profile.country,
        postalCode: user.profile.postalCode,
        googleMapsUrl: user.profile.googleMapsUrl,
        workingHours: user.profile.workingHours,
        companyName: user.profile.companyName || (user.isAdmin ? 'QART Team' : ''),
        companyLegalName: user.profile.companyLegalName,
        companySlogan: user.profile.companySlogan,
        companyDescription: user.profile.companyDescription,
        companySector: user.profile.companySector,
        companyFoundedYear: user.profile.companyFoundedYear,
        companyEmployeeCount: user.profile.companyEmployeeCount,
        profileImage: user.profile.profileImage,
        coverImageUrl: user.profile.coverImageUrl,
        logoUrl: user.profile.logoUrl,
        isPublic: user.profile.isPublic !== false,
        theme: user.profile.themeId || 'default',
        themeId: user.profile.themeId || 'default',
        socialLinks: user.profile.socialLinks || [],
        bankAccounts: user.profile.bankAccounts || []
      } : undefined,
      subscription: user.subscription?.plan || (user.isAdmin ? 'QART Lifetime' : 'Free'),
      _count: {
        cards: user._count?.cards || 0,
        profile: user.profile ? 1 : 0
      }
    }
  }

  // Standard include for user queries
  private static getIncludeOptions() {
    return {
      profile: {
        include: {
          socialLinks: {
            orderBy: { order: 'asc' }
          },
          bankAccounts: {
            orderBy: { order: 'asc' }
          }
        }
      },
      subscription: true,
      _count: {
        select: {
          cards: true
        }
      }
    }
  }

  // Get all users
  static async getAllUsers(): Promise<UserWithProfile[]> {
    try {
      const users = await dbClient.user.findMany({
        include: this.getIncludeOptions(),
        orderBy: [
          { isAdmin: 'desc' },
          { createdAt: 'asc' }
        ]
      })

      return users.map(user => this.mapUserProfile(user))

    } catch (error) {
      console.error('❌ Error getting users:', error)
      return []
    }
  }
  
  // Find user by email
  static async findUserByEmail(email: string): Promise<UserWithProfile | null> {
    try {
      const user = await dbClient.user.findUnique({
        where: { email: email.toLowerCase() },
        include: this.getIncludeOptions()
      })

      if (!user) return null
      return this.mapUserProfile(user)

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
      const user = await dbClient.user.findUnique({
        where: { id },
        include: this.getIncludeOptions()
      })

      if (!user) {
        console.log('❌ User not found:', id)
        return null
      }

      return this.mapUserProfile(user)

    } catch (error) {
      console.error('❌ Error getting user by ID:', error)
      return null
    }
  }

  // Authenticate user (login)
  static async authenticateUser(email: string, password: string): Promise<UserWithProfile | null> {
    try {
      const user = await this.findUserByEmail(email)
      
      if (!user || !user.password) {
        console.log('❌ User not found or no password:', email)
        return null
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email)
        return null
      }

      console.log('✅ User authenticated:', email)
      
      // Remove password from return object
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword

    } catch (error) {
      console.error('❌ Authentication error:', error)
      return null
    }
  }

  // Create user
  static async createUser(userData: {
    name: string
    email: string
    password: string
    isAdmin?: boolean
  }): Promise<UserWithProfile | null> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await dbClient.user.create({
        data: {
          name: userData.name,
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          isAdmin: userData.isAdmin || false,
          isActive: true,
          profile: {
            create: {
              slug: userData.name.toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-'),
              title: userData.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
              bio: `${userData.name} - QART dijital kartvizit kullanıcısı`,
              phone: '+90 555 000 0000',
              isPublic: true
            }
          },
          subscription: {
            create: {
              plan: userData.isAdmin ? 'QART Lifetime' : 'Free',
              status: 'active',
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            }
          }
        },
        include: this.getIncludeOptions()
      })

      return this.mapUserProfile(user)

    } catch (error) {
      console.error('❌ Error creating user:', error)
      return null
    }
  }

  // Register user (alias for createUser for API compatibility)
  static async registerUser(email: string, password: string, name: string, isAdmin: boolean = false): Promise<UserWithProfile | null> {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email)
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor')
    }
    
    return this.createUser({
      name,
      email,
      password,
      isAdmin
    })
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
      alternativePhone: string
      whatsapp: string
      email: string
      alternativeEmail: string
      website: string
      address: string
      city: string
      district: string
      country: string
      postalCode: string
      googleMapsUrl: string
      workingHours: any
      companyName: string
      companyLegalName: string
      companySlogan: string
      companyDescription: string
      companySector: string
      companyFoundedYear: string
      companyEmployeeCount: string
      profileImage: string
      coverImageUrl: string
      logoUrl: string
      isPublic: boolean
      themeId: string
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
      
      // Handle subscription update
      const subscriptionData: any = {}
      if (updates.subscription) {
        subscriptionData.plan = updates.subscription
        subscriptionData.status = 'active'
        subscriptionData.currentPeriodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
      
      // Handle profile updates
      if (updates.profile) {
        Object.assign(profileData, updates.profile)
        
        console.log('🎨 Theme update data:', { themeId: profileData.themeId })
        
        // Validate themeId exists in database
        if (profileData.themeId) {
          const themeExists = await dbClient.theme.findUnique({
            where: { id: profileData.themeId }
          })
          
          if (!themeExists) {
            console.log('⚠️ Theme not found, using default:', profileData.themeId)
            profileData.themeId = 'default'
          } else {
            console.log('✅ Theme validated:', profileData.themeId)
          }
        }
      }

      // Update user in database
      const updatedUser = await dbClient.user.update({
        where: { id },
        data: {
          ...userData,
          profile: profileData && Object.keys(profileData).length > 0 ? {
            upsert: {
              create: profileData,
              update: profileData
            }
          } : undefined,
          subscription: subscriptionData && Object.keys(subscriptionData).length > 0 ? {
            upsert: {
              create: subscriptionData,
              update: subscriptionData
            }
          } : undefined
        },
        include: this.getIncludeOptions()
      })

      console.log('✅ User updated successfully:', updatedUser.email)
      return this.mapUserProfile(updatedUser)

    } catch (error) {
      console.error('❌ Error updating user:', error)
      return null
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    try {
      await dbClient.user.delete({
        where: { id }
      })
      
      console.log('✅ User deleted successfully:', id)
      return true

    } catch (error) {
      console.error('❌ Error deleting user:', error)
      return false
    }
  }

  // Get user stats
  static async getUserStats(): Promise<any> {
    try {
      const totalUsers = await dbClient.user.count()
      const activeUsers = await dbClient.user.count({ where: { isActive: true } })
      const adminUsers = await dbClient.user.count({ where: { isAdmin: true } })
      
      return {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers: totalUsers - activeUsers
      }

    } catch (error) {
      console.error('❌ Error getting user stats:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        inactiveUsers: 0
      }
    }
  }
}