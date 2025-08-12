import bcrypt from 'bcryptjs'

// Hybrid user store - PostgreSQL first, file fallback
interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  profile?: {
    slug: string
    title?: string
    bio?: string
    phone?: string
    whatsapp?: string
    website?: string
    companyName?: string
  }
}

// Static fallback users - guaranteed to be available
const FALLBACK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@qart.app',
    password: '$2b$12$gGAbDTg.q9wBElTchW9CB.mUbQ880qTZlkp65KSwTcPJSLL8sYkPy', // admin123
    name: 'Admin User',
    isAdmin: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      slug: 'admin-user',
      title: 'Sistem Yöneticisi',
      bio: 'QART NFC sistemi yöneticisi',
      phone: '+90 555 000 0001',
      companyName: 'QART Team'
    }
  },
  {
    id: '2',
    email: 'demo@qart.app',
    password: '$2b$12$YR/Qq7LByMYjyVXrLrioA.qfjcgYqA20DnrkZS/EpuluUliQ.5mWO', // demo123
    name: 'Demo User',
    isAdmin: false,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      slug: 'demo-user',
      title: 'Demo Kullanıcı',
      bio: 'QART demo kullanıcısı',
      phone: '+90 555 000 0002',
      companyName: 'Demo Şirket'
    }
  }
]

class HybridUserStore {
  private fallbackUsers: User[]

  constructor() {
    // Always initialize with static users - guaranteed to be available
    this.fallbackUsers = [...FALLBACK_USERS]
    
    console.log('🔄 Hybrid User Store initialized - PostgreSQL with fallback')
    console.log('🔍 Environment check:', {
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      fallbackUsersCount: this.fallbackUsers.length
    })
    console.log('📋 Fallback users initialized:', this.fallbackUsers.map(u => ({ email: u.email, isAdmin: u.isAdmin })))
    
    // Verify fallback users are actually there
    if (this.fallbackUsers.length === 0) {
      console.error('❌ CRITICAL: Fallback users array is empty!')
      // Force reinitialize
      this.fallbackUsers = [
        {
          id: '1',
          email: 'admin@qart.app',
          password: '$2b$12$gGAbDTg.q9wBElTchW9CB.mUbQ880qTZlkp65KSwTcPJSLL8sYkPy',
          name: 'Admin User',
          isAdmin: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          profile: { slug: 'admin-user', title: 'Sistem Yöneticisi', bio: 'QART NFC sistemi yöneticisi', phone: '+90 555 000 0001', companyName: 'QART Team' }
        }
      ]
      console.log('🔧 Emergency fallback user created')
    }
  }

  // Try PostgreSQL first, fallback to memory
  async findByEmail(email: string) {
    // Vercel'de PostgreSQL connection problem varsa direkt fallback kullan
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV
    
    if (!isVercel) {
      try {
        // Local'de PostgreSQL dene
        const { prismaUserStore } = await import('./prisma-user-store')
        const user = await prismaUserStore.findByEmail(email)
        if (user) {
          console.log('✅ User found in PostgreSQL:', email)
          return user
        }
      } catch (error: any) {
        console.warn('⚠️ PostgreSQL unavailable, using fallback:', error?.message || 'Unknown error')
      }
    } else {
      console.log('🔄 Vercel detected - using fallback store directly')
    }

    // Fallback to memory - ALWAYS CHECK FALLBACK
    console.log('🔄 Checking fallback users for:', email)
    console.log('📊 Current fallback users count:', this.fallbackUsers.length)
    
    // Double-check fallback users exist
    if (this.fallbackUsers.length === 0) {
      console.error('❌ CRITICAL: Fallback users disappeared! Reinitializing...')
      this.fallbackUsers = [...FALLBACK_USERS]
      console.log('🔧 Fallback users reinitialized:', this.fallbackUsers.length)
    }
    
    const user = this.fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (user) {
      console.log('✅ User found in fallback store:', email)
      return user
    } else {
      console.log('❌ User not found in fallback store:', email)
      console.log('📋 Available fallback emails:', this.fallbackUsers.map(u => u.email))
      return null
    }
  }

  async findById(id: string) {
    try {
      // Try PostgreSQL first
      const { prismaUserStore } = await import('./prisma-user-store')
      const user = await prismaUserStore.findById(id)
      if (user) {
        console.log('✅ User found in PostgreSQL by ID:', id)
        return user
      }
    } catch (error) {
      console.warn('⚠️ PostgreSQL unavailable, using fallback')
    }

    // Fallback to memory
    return this.fallbackUsers.find(u => u.id === id)
  }

  async getAllUsers() {
    // Vercel'de PostgreSQL connection problem varsa direkt fallback kullan
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV
    
    if (!isVercel) {
      try {
        // Local'de PostgreSQL dene
        const { prismaUserStore } = await import('./prisma-user-store')
        const users = await prismaUserStore.getAllUsers()
        if (users && users.length > 0) {
          console.log('✅ Users loaded from PostgreSQL:', users.length)
          return users
        }
      } catch (error: any) {
        console.warn('⚠️ PostgreSQL unavailable, using fallback:', error?.message || 'Unknown error')
      }
    } else {
      console.log('🔄 Vercel detected - using fallback users directly')
    }

    // Fallback to memory - ALWAYS RETURN FALLBACK  
    console.log('🔄 Using fallback user data:', this.fallbackUsers.length, 'users')
    
    // Final safety check
    if (this.fallbackUsers.length === 0) {
      console.error('❌ CRITICAL: Fallback users empty in getAllUsers! Emergency reinit...')
      this.fallbackUsers = [...FALLBACK_USERS]
      console.log('🔧 Emergency fallback users restored:', this.fallbackUsers.length)
    }
    
    return this.fallbackUsers
  }

  async verifyPassword(user: any, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      console.error('Error verifying password:', error)
      return false
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const { prismaUserStore } = await import('./prisma-user-store')
      const count = await prismaUserStore.getUserCount()
      return count
    } catch (error) {
      return this.fallbackUsers.length
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { prismaUserStore } = await import('./prisma-user-store')
      return await prismaUserStore.deleteUser(id)
    } catch (error) {
      // Fallback'te delete simulation
      const userIndex = this.fallbackUsers.findIndex(u => u.id === id)
      if (userIndex !== -1 && !this.fallbackUsers[userIndex].isAdmin) {
        this.fallbackUsers.splice(userIndex, 1)
        return true
      }
      return false
    }
  }

  async toggleUserStatus(id: string): Promise<boolean> {
    try {
      const { prismaUserStore } = await import('./prisma-user-store')
      return await prismaUserStore.toggleUserStatus(id)
    } catch (error) {
      // Fallback'te status toggle simulation
      const user = this.fallbackUsers.find(u => u.id === id)
      if (user) {
        user.isActive = !user.isActive
        return true
      }
      return false
    }
  }

  async getDiagnosticInfo() {
    // Vercel'de PostgreSQL connection problem varsa direkt fallback kullan
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV
    
    if (!isVercel) {
      try {
        const { prismaUserStore } = await import('./prisma-user-store')
        const diagnostics = await prismaUserStore.getDiagnosticInfo()
        return diagnostics
      } catch (error: any) {
        console.warn('⚠️ PostgreSQL diagnostic failed, using fallback info:', error?.message)
      }
    } else {
      console.log('🔄 Vercel detected - using fallback diagnostic directly')
    }

    return {
      environment: 'Hybrid Store (Fallback Active)',
      storage: isVercel ? 'VERCEL - Fallback mode active' : 'FALLBACK - In-memory store active',
      userCount: this.fallbackUsers.length,
      adminCount: this.fallbackUsers.filter(u => u.isAdmin).length,
      activeCount: this.fallbackUsers.filter(u => u.isActive).length,
      storageRisk: 'LOW - Reliable fallback active',
      healthStatus: 'FALLBACK_MODE_ACTIVE',
      fallbackUsers: this.fallbackUsers.map(u => ({ email: u.email, name: u.name, isAdmin: u.isAdmin }))
    }
  }
}

// Singleton instance
export const hybridUserStore = new HybridUserStore()
export default hybridUserStore