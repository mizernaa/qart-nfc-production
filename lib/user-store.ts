import bcrypt from 'bcryptjs'

// Global in-memory kullanıcı store
interface User {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
  isActive: boolean
  createdAt: Date
}

class UserStore {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@qart.app',
      password: '$2b$12$gGAbDTg.q9wBElTchW9CB.mUbQ880qTZlkp65KSwTcPJSLL8sYkPy', // admin123
      name: 'Admin User',
      isAdmin: true,
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      email: 'demo@qart.app',
      password: '$2b$12$YR/Qq7LByMYjyVXrLrioA.qfjcgYqA20DnrkZS/EpuluUliQ.5mWO', // demo123
      name: 'Demo User',
      isAdmin: false,
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ]

  // Kullanıcı bul - email ile
  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  // Kullanıcı bul - id ile
  findById(id: string): User | undefined {
    return this.users.find(u => u.id === id)
  }

  // Yeni kullanıcı ekle
  async addUser(data: {
    email: string
    password: string
    name: string
    isAdmin?: boolean
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    const newUser: User = {
      id: String(this.users.length + 1),
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
      isAdmin: data.isAdmin || false,
      isActive: true,
      createdAt: new Date()
    }

    this.users.push(newUser)
    console.log('✅ User added to store:', newUser.email)
    return newUser
  }

  // Şifre kontrolü
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = this.findByEmail(email)
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    return user
  }

  // Tüm kullanıcıları getir
  getAllUsers(): User[] {
    return this.users.map(u => ({
      ...u,
      password: '' // Şifreyi gizle
    }))
  }

  // Kullanıcı sayısı
  getUserCount(): number {
    return this.users.length
  }
}

// Singleton instance
export const userStore = new UserStore()