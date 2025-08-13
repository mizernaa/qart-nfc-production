// Central User Management System
// This file manages ALL users across the application

import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  lastLoginAt: string
  profile: {
    slug: string
    title: string
    bio: string
    phone: string
    companyName?: string
  }
  subscription: string
  _count: {
    cards: number
    profile: number
  }
}

// Initial default users - ALWAYS available
const DEFAULT_USERS: User[] = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$wv0CF9GyATjsdvseYavikOqqKdsu31Up7QBKh0y2pgnivU1XEcdKu", // admin123
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
      phone: "+90 555 000 0001",
      companyName: "QART Team"
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
    password: "$2b$12$OZHt88RF8lC2NDy6e0IsHO5hgtX7wom71.II0CO.9JKx5vCb0L8uO", // demo123
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
      phone: "+90 555 000 0002",
      companyName: ""
    },
    subscription: "Free",
    _count: {
      cards: 0,
      profile: 1
    }
  }
]

// Runtime user storage
let RUNTIME_USERS: User[] = [...DEFAULT_USERS]

// Helper functions
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

function getUsersFilePath() {
  return path.join(process.cwd(), 'data', 'central-users.json')
}

// Save users to file
function saveUsersToFile() {
  try {
    const filePath = getUsersFilePath()
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(RUNTIME_USERS, null, 2))
    console.log('✅ Users saved to file:', RUNTIME_USERS.length)
    return true
  } catch (error) {
    console.error('❌ Error saving users to file:', error)
    return false
  }
}

// Load users from file
function loadUsersFromFile() {
  try {
    const filePath = getUsersFilePath()
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      const loadedUsers = JSON.parse(data)
      
      // Merge with default users (defaults take precedence)
      const mergedUsers = [...DEFAULT_USERS]
      
      // Add loaded users that don't conflict with defaults
      loadedUsers.forEach((loadedUser: User) => {
        const isDefault = DEFAULT_USERS.find(u => u.email === loadedUser.email)
        if (!isDefault) {
          mergedUsers.push(loadedUser)
        }
      })
      
      RUNTIME_USERS = mergedUsers
      console.log('✅ Users loaded from file:', RUNTIME_USERS.length)
      return true
    }
  } catch (error) {
    console.error('❌ Error loading users from file:', error)
  }
  
  // If loading failed, ensure we have defaults
  RUNTIME_USERS = [...DEFAULT_USERS]
  console.log('📦 Using default users:', RUNTIME_USERS.length)
  return false
}

// Initialize on first import
loadUsersFromFile()

// Public API
export class CentralUserStore {
  
  // Get all users
  static getAllUsers(): User[] {
    return [...RUNTIME_USERS]
  }
  
  // Find user by email
  static findUserByEmail(email: string): User | undefined {
    return RUNTIME_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
  }
  
  // Find user by ID
  static findUserById(id: string): User | undefined {
    return RUNTIME_USERS.find(u => u.id === id)
  }
  
  // Authenticate user
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = this.findUserByEmail(email)
    if (!user || !user.isActive) {
      return null
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }
    
    // Update last login
    user.lastLoginAt = new Date().toISOString()
    saveUsersToFile()
    
    return user
  }
  
  // Register new user
  static async registerUser(email: string, password: string, name: string, isAdmin: boolean = false): Promise<User | null> {
    // Check if user exists
    if (this.findUserByEmail(email)) {
      throw new Error('Bu email adresi zaten kullanılıyor')
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create slug
    let baseSlug = createSlug(name)
    let slug = baseSlug
    let counter = 1
    
    // Ensure unique slug
    while (RUNTIME_USERS.find(u => u.profile.slug === slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    // Create user
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        phone: '+90 555 000 0000',
        companyName: isAdmin ? 'QART Team' : ''
      },
      subscription: isAdmin ? 'QART Lifetime' : 'Free',
      _count: {
        cards: 0,
        profile: 1
      }
    }
    
    // Add to runtime storage
    RUNTIME_USERS.push(newUser)
    
    // Save to file
    saveUsersToFile()
    
    console.log('✅ User registered:', email)
    return newUser
  }
  
  // Update user
  static updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = RUNTIME_USERS.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return null
    }
    
    RUNTIME_USERS[userIndex] = { ...RUNTIME_USERS[userIndex], ...updates }
    saveUsersToFile()
    
    console.log('✅ User updated:', id)
    return RUNTIME_USERS[userIndex]
  }
  
  // Delete user
  static deleteUser(id: string): boolean {
    const user = this.findUserById(id)
    if (!user || user.isAdmin) {
      return false // Cannot delete admin users
    }
    
    RUNTIME_USERS = RUNTIME_USERS.filter(u => u.id !== id)
    saveUsersToFile()
    
    console.log('✅ User deleted:', id)
    return true
  }
  
  // Toggle user status
  static toggleUserStatus(id: string): User | null {
    const user = this.findUserById(id)
    if (!user) {
      return null
    }
    
    user.isActive = !user.isActive
    saveUsersToFile()
    
    console.log('✅ User status toggled:', id, 'Active:', user.isActive)
    return user
  }
  
  // Search users
  static searchUsers(searchTerm: string): User[] {
    if (!searchTerm) {
      return this.getAllUsers()
    }
    
    const term = searchTerm.toLowerCase()
    return RUNTIME_USERS.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.profile.slug.toLowerCase().includes(term)
    )
  }
  
  // Get statistics
  static getStatistics() {
    const users = this.getAllUsers()
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      adminUsers: users.filter(u => u.isAdmin).length,
      verifiedUsers: users.filter(u => u.emailVerified).length,
      freeUsers: users.filter(u => u.subscription === 'Free').length,
      premiumUsers: users.filter(u => u.subscription !== 'Free').length
    }
  }
}

// Auto-save every 30 seconds
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    saveUsersToFile()
  }, 30000)
}

export default CentralUserStore