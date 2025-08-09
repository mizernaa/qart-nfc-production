import bcrypt from 'bcryptjs'

// Vercel için basit in-memory user store
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

// Global in-memory users - Vercel serverless için - GUARANTEED initialization
const INITIAL_USERS: User[] = [
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

// Global state with guaranteed fallback
let MEMORY_USERS: User[] = []

class VercelUserStore {
  private initialized = false
  constructor() {
    this.ensureInitialized()
    console.log('🚀 Vercel User Store initialized - Pure in-memory')
    console.log('👥 Memory users count:', MEMORY_USERS.length)
    console.log('🔑 Users:', MEMORY_USERS.map(u => ({ email: u.email, isAdmin: u.isAdmin })))
  }

  private ensureInitialized() {
    if (!this.initialized || MEMORY_USERS.length === 0) {
      console.log('🔧 Force initializing users...')
      MEMORY_USERS = [...INITIAL_USERS]
      this.initialized = true
      console.log('✅ Users force initialized:', MEMORY_USERS.length)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.ensureInitialized() // Always ensure users are initialized
    console.log('🔍 Finding user by email:', email)
    console.log('📊 Total users in memory:', MEMORY_USERS.length)
    
    const user = MEMORY_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (user) {
      console.log('✅ User found:', user.email)
      return user
    } else {
      console.log('❌ User not found')
      console.log('📋 Available emails:', MEMORY_USERS.map(u => u.email))
      return null
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = MEMORY_USERS.find(u => u.id === id)
    console.log('🆔 Finding user by ID:', id, user ? 'FOUND' : 'NOT FOUND')
    return user || null
  }

  async getAllUsers(): Promise<User[]> {
    this.ensureInitialized() // Always ensure users are initialized
    console.log('📜 Getting all users:', MEMORY_USERS.length)
    return [...MEMORY_USERS]
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<User> {
    this.ensureInitialized() // Always ensure users are initialized
    console.log('➕ Creating new user:', userData.email)
    
    const newUser: User = {
      ...userData,
      id: String(Date.now()), // Simple ID generation
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    MEMORY_USERS.push(newUser)
    console.log('✅ User created successfully:', newUser.email)
    console.log('📊 Total users now:', MEMORY_USERS.length)
    
    return newUser
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      console.log('🔐 Verifying password for:', user.email)
      const isValid = await bcrypt.compare(password, user.password)
      console.log('🔑 Password verification result:', isValid)
      return isValid
    } catch (error) {
      console.error('❌ Password verification error:', error)
      return false
    }
  }

  async hashPassword(password: string): Promise<string> {
    console.log('🔒 Hashing password...')
    return await bcrypt.hash(password, 12)
  }

  async deleteUser(id: string): Promise<boolean> {
    console.log('🗑️ Deleting user:', id)
    const userIndex = MEMORY_USERS.findIndex(u => u.id === id && !u.isAdmin)
    if (userIndex !== -1) {
      MEMORY_USERS.splice(userIndex, 1)
      console.log('✅ User deleted:', id)
      return true
    }
    console.log('❌ Cannot delete user (not found or is admin):', id)
    return false
  }

  async toggleUserStatus(id: string): Promise<boolean> {
    console.log('🔄 Toggling user status:', id)
    const user = MEMORY_USERS.find(u => u.id === id)
    if (user) {
      user.isActive = !user.isActive
      console.log('✅ User status toggled:', user.email, 'Active:', user.isActive)
      return true
    }
    console.log('❌ User not found for status toggle:', id)
    return false
  }

  getUserCount(): number {
    return MEMORY_USERS.length
  }

  getDiagnosticInfo() {
    return {
      environment: 'Vercel In-Memory Store',
      storage: 'Pure in-memory (session-based)',
      userCount: MEMORY_USERS.length,
      adminCount: MEMORY_USERS.filter(u => u.isAdmin).length,
      activeCount: MEMORY_USERS.filter(u => u.isActive).length,
      storageRisk: 'SESSION - Data resets on cold start',
      healthStatus: 'ACTIVE',
      users: MEMORY_USERS.map(u => ({ 
        id: u.id,
        email: u.email, 
        name: u.name, 
        isAdmin: u.isAdmin, 
        isActive: u.isActive 
      }))
    }
  }
}

// Singleton instance
export const vercelUserStore = new VercelUserStore()
export default vercelUserStore