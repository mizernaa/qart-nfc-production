import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

// Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

interface CreateUserData {
  email: string
  password: string
  name: string
  isAdmin?: boolean
}

class PrismaUserStore {
  constructor() {
    console.log('✅ Using PostgreSQL database with Prisma ORM')
    this.initializeDefaultUsers()
  }

  // Default users'ları initialize et (sadece bir kez)
  private async initializeDefaultUsers() {
    try {
      const userCount = await prisma.user.count()
      
      if (userCount === 0) {
        console.log('📦 Creating default users in database...')
        
        // Admin user
        const adminPasswordHash = await bcrypt.hash('admin123', 12)
        const adminUser = await prisma.user.create({
          data: {
            email: 'admin@qart.app',
            password: adminPasswordHash,
            name: 'Admin User',
            isAdmin: true,
            isActive: true,
            emailVerified: true
          }
        })

        // Demo user
        const demoPasswordHash = await bcrypt.hash('demo123', 12)
        const demoUser = await prisma.user.create({
          data: {
            email: 'demo@qart.app',
            password: demoPasswordHash,
            name: 'Demo User',
            isAdmin: false,
            isActive: true,
            emailVerified: true
          }
        })

        // Create profiles for default users
        await prisma.profile.create({
          data: {
            userId: adminUser.id,
            slug: 'admin-user',
            companyName: 'QART Team',
            title: 'Sistem Yöneticisi',
            bio: 'QART NFC sistemi yöneticisi',
            email: 'admin@qart.app',
            phone: '+90 555 000 0001',
            website: 'https://qart.app'
          }
        })

        await prisma.profile.create({
          data: {
            userId: demoUser.id,
            slug: 'demo-user',
            companyName: 'Demo Şirket',
            title: 'Demo Kullanıcı',
            bio: 'QART demo kullanıcısı',
            email: 'demo@qart.app',
            phone: '+90 555 000 0002'
          }
        })

        console.log('✅ Default users created successfully')
      }
    } catch (error) {
      console.error('Error initializing default users:', error)
    }
  }

  // Kullanıcı bul - email ile
  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase() 
        },
        include: {
          profile: true,
          subscription: true
        }
      })
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  // Kullanıcı bul - id ile
  async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          subscription: true
        }
      })
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  // Yeni kullanıcı ekle
  async addUser(data: CreateUserData) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          name: data.name,
          isAdmin: data.isAdmin || false,
          isActive: true,
          emailVerified: false
        }
      })

      // Create slug from name
      const slug = this.createSlug(data.name)
      
      // Create profile for new user
      await prisma.profile.create({
        data: {
          userId: user.id,
          slug,
          email: data.email.toLowerCase(),
          companyName: data.name,
          title: 'Kullanıcı',
          bio: `${data.name} - QART dijital kartvizit kullanıcısı`
        }
      })

      console.log(`✅ New user created: ${user.email}`)
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Tüm kullanıcıları getir
  async getAllUsers() {
    try {
      return await prisma.user.findMany({
        include: {
          profile: true,
          subscription: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  }

  // Kullanıcı sayısı
  async getUserCount(): Promise<number> {
    try {
      return await prisma.user.count()
    } catch (error) {
      console.error('Error getting user count:', error)
      return 0
    }
  }

  // Kullanıcı sil
  async deleteUser(id: string): Promise<boolean> {
    try {
      // Admin kullanıcısını kontrol et
      const user = await prisma.user.findUnique({ where: { id } })
      
      if (!user) {
        console.log('❌ User not found for deletion:', id)
        return false
      }

      if (user.isAdmin) {
        console.log('⚠️ Admin user deletion prevented:', user.email)
        return false
      }

      // Cascade delete - Prisma otomatik olarak ilişkili verileri siler
      await prisma.user.delete({
        where: { id }
      })

      console.log('✅ User deleted successfully:', user.email)
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  // Kullanıcı durumu değiştir
  async toggleUserStatus(id: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      
      if (!user) {
        console.log('❌ User not found for status toggle:', id)
        return false
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          isActive: !user.isActive
        }
      })

      console.log(`✅ User status changed: ${updatedUser.email} → ${updatedUser.isActive ? 'active' : 'inactive'}`)
      return true
    } catch (error) {
      console.error('Error toggling user status:', error)
      return false
    }
  }

  // Password verification
  async verifyPassword(user: any, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      console.error('Error verifying password:', error)
      return false
    }
  }

  // Update last login
  async updateLastLogin(id: string) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          lastLoginAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  // Create slug from name
  private createSlug(name: string): string {
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
  }

  // Database health check
  async getDiagnosticInfo() {
    try {
      const userCount = await prisma.user.count()
      const adminCount = await prisma.user.count({ where: { isAdmin: true } })
      const activeCount = await prisma.user.count({ where: { isActive: true } })
      const profileCount = await prisma.profile.count()

      return {
        environment: 'PostgreSQL Database',
        storage: 'PERSISTENT - Supabase/Neon PostgreSQL',
        userCount,
        adminCount,
        activeCount,
        profileCount,
        storageRisk: 'NONE - Fully persistent database',
        healthStatus: userCount > 0 && adminCount > 0 ? 'HEALTHY' : 'REQUIRES_ATTENTION'
      }
    } catch (error) {
      console.error('Database diagnostic error:', error)
      return {
        environment: 'PostgreSQL Database',
        storage: 'ERROR - Cannot connect to database',
        storageRisk: 'HIGH - Database connection failed',
        healthStatus: 'ERROR'
      }
    }
  }

  // Disconnect Prisma (cleanup)
  async disconnect() {
    await prisma.$disconnect()
  }
}

// Singleton instance
export const prismaUserStore = new PrismaUserStore()
export default prismaUserStore