import bcrypt from 'bcryptjs'

// Production için basit in-memory user store
interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  profile: {
    slug: string
    title: string
    bio: string
    phone: string
    companyName: string
    email: string
  }
}

// Global in-memory storage - Vercel serverless için
let PRODUCTION_USERS: User[] = [
  {
    id: 'admin-prod',
    email: 'admin@qart.app',
    password: '$2b$12$SSoUv/jalgW.AkrG65S1cunTu6ySwmgk2KAtgFoLqvl0.D//7FdKG', // admin123
    name: 'Admin User',
    isAdmin: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    profile: {
      slug: 'admin-user',
      title: 'Sistem Yöneticisi',
      bio: 'QART NFC sistemi yöneticisi',
      phone: '+90 555 000 0001',
      companyName: 'QART Team',
      email: 'admin@qart.app'
    }
  },
  {
    id: 'demo-prod',
    email: 'demo@qart.app',
    password: '$2b$12$3G.uzJPIEdrQMqs5o3f69unNBFZ0n1YQLxUph0VXgkmemE34umQza', // demo123
    name: 'Demo User',
    isAdmin: false,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    profile: {
      slug: 'demo-user',
      title: 'Demo Kullanıcı',
      bio: 'QART demo kullanıcısı',
      phone: '+90 555 000 0002',
      companyName: 'Demo Şirket',
      email: 'demo@qart.app'
    }
  }
]

export class ProductionAuth {
  private static initialized = false

  static ensureInitialized() {
    if (!this.initialized) {
      console.log('🚀 Production Auth initialized with', PRODUCTION_USERS.length, 'users')
      this.initialized = true
    }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    this.ensureInitialized()
    const user = PRODUCTION_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    console.log('🔍 Finding user:', email, user ? 'FOUND' : 'NOT_FOUND')
    return user || null
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword)
      console.log('🔑 Password verification:', isValid)
      return isValid
    } catch (error) {
      console.error('❌ Password verification error:', error)
      return false
    }
  }

  static async createUser(userData: {
    name: string
    email: string
    password: string
  }): Promise<User> {
    this.ensureInitialized()
    
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Create slug
    const slug = userData.name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      name: userData.name,
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      profile: {
        slug,
        title: 'Kullanıcı',
        bio: `${userData.name} - QART dijital kartvizit kullanıcısı`,
        phone: '+90 555 000 0000',
        companyName: '',
        email: userData.email.toLowerCase()
      }
    }

    // Add to in-memory storage
    PRODUCTION_USERS.push(newUser)
    
    console.log('✅ User created in production:', userData.email)
    return newUser
  }

  static async getAllUsers(): Promise<User[]> {
    this.ensureInitialized()
    console.log('📜 Getting all users:', PRODUCTION_USERS.length)
    return [...PRODUCTION_USERS].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  static async deleteUser(userId: string): Promise<boolean> {
    this.ensureInitialized()
    const index = PRODUCTION_USERS.findIndex(u => u.id === userId && !u.isAdmin)
    if (index !== -1) {
      PRODUCTION_USERS.splice(index, 1)
      console.log('✅ User deleted:', userId)
      return true
    }
    console.log('❌ Cannot delete user:', userId)
    return false
  }

  static async updateUserStatus(userId: string): Promise<boolean> {
    this.ensureInitialized()
    const user = PRODUCTION_USERS.find(u => u.id === userId)
    if (user) {
      user.isActive = !user.isActive
      console.log('✅ User status updated:', userId, 'Active:', user.isActive)
      return true
    }
    return false
  }

  static getDiagnostics() {
    return {
      environment: 'Production In-Memory Auth',
      userCount: PRODUCTION_USERS.length,
      users: PRODUCTION_USERS.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isAdmin: u.isAdmin,
        isActive: u.isActive
      })),
      warning: 'Data resets on serverless function restart'
    }
  }
}