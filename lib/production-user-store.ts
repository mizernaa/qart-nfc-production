import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  emailVerified?: boolean
  createdAt: string
  lastLoginAt?: string
  profile: {
    slug: string
    title?: string
    bio?: string
    phone?: string
    companyName?: string
  }
  subscription?: string
  _count?: {
    cards: number
    profile: number
  }
}

/**
 * Production-compatible user store that works on Vercel
 * Uses in-memory storage with hardcoded admin/demo accounts
 */
class ProductionUserStore {
  private static users: User[] = [
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

  private static nextId = 3

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    console.log("🔐 Production auth attempt:", email)
    
    const user = this.users.find(u => u.email === email)
    if (!user) {
      console.log("❌ User not found:", email)
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      console.log("❌ Invalid password for:", email)
      return null
    }

    console.log("✅ Authentication successful:", email)
    
    // Update last login time
    user.lastLoginAt = new Date().toISOString()
    
    return {
      ...user,
      password: undefined // Don't return password
    } as User
  }

  static async registerUser(email: string, password: string, name: string, isAdmin = false): Promise<User | null> {
    console.log("📝 Production register attempt:", { email, name, isAdmin })
    
    // Check if user already exists
    if (this.users.find(u => u.email === email)) {
      throw new Error('Bu email adresi zaten kullanılıyor')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Generate slug
    const slug = name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}-${this.nextId}`,
      email,
      password: hashedPassword,
      name,
      isAdmin,
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      profile: {
        slug: `${slug}-${this.nextId}`,
        title: isAdmin ? "Yönetici" : "Kullanıcı",
        bio: `${name} - QART dijital kartvizit kullanıcısı`,
        phone: "+90 555 000 0000",
        companyName: ""
      },
      subscription: isAdmin ? "QART Lifetime" : "Free",
      _count: {
        cards: 0,
        profile: 1
      }
    }

    this.users.push(newUser)
    this.nextId++

    console.log("✅ User registered:", email)
    return newUser
  }

  static getAllUsers(): User[] {
    return this.users.map(user => ({
      ...user,
      password: undefined // Don't expose passwords
    })) as User[]
  }

  static findUserByEmail(email: string): User | null {
    const user = this.users.find(u => u.email === email)
    if (user) {
      return {
        ...user,
        password: undefined
      } as User
    }
    return null
  }

  static deleteUser(userId: string): boolean {
    const index = this.users.findIndex(u => u.id === userId)
    if (index > -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }

  static toggleUserStatus(userId: string): User | null {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      user.isActive = !user.isActive
      return {
        ...user,
        password: undefined
      } as User
    }
    return null
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      Object.assign(user, updates)
      return {
        ...user,
        password: undefined
      } as User
    }
    return null
  }
}

export { ProductionUserStore }