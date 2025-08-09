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
  createdAt: string
}

interface UsersDB {
  users: User[]
}

class FileUserStore {
  private dbPath: string

  constructor() {
    // Vercel'de /tmp dizini yazılabilir
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV
    if (isVercel) {
      this.dbPath = '/tmp/users-db.json'
      console.log('Using Vercel temp storage for users')
    } else {
      this.dbPath = path.join(process.cwd(), 'lib', 'users-db.json')
      console.log('Using local file storage for users')
    }
    
    // Eğer dosya yoksa varsayılan kullanıcılarla oluştur
    this.initDB()
  }

  private getDefaultData(): UsersDB {
    return {
      users: [
        {
          id: '1',
          email: 'admin@qart.app',
          password: '$2b$12$gGAbDTg.q9wBElTchW9CB.mUbQ880qTZlkp65KSwTcPJSLL8sYkPy',
          name: 'Admin User',
          isAdmin: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          email: 'demo@qart.app',
          password: '$2b$12$YR/Qq7LByMYjyVXrLrioA.qfjcgYqA20DnrkZS/EpuluUliQ.5mWO',
          name: 'Demo User',
          isAdmin: false,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ]
    }
  }

  private initDB() {
    if (!fs.existsSync(this.dbPath)) {
      this.saveDB(this.getDefaultData())
    }
  }

  private loadDB(): UsersDB {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Error loading database:', error)
      // Hata durumunda varsayılan veriyi döndür
      return this.getDefaultData()
    }
  }

  private saveDB(data: UsersDB): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }

  // Kullanıcı bul - email ile
  findByEmail(email: string): User | undefined {
    const db = this.loadDB()
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  // Kullanıcı bul - id ile
  findById(id: string): User | undefined {
    const db = this.loadDB()
    return db.users.find(u => u.id === id)
  }

  // Yeni kullanıcı ekle
  async addUser(data: {
    email: string
    password: string
    name: string
    isAdmin?: boolean
  }): Promise<User> {
    const db = this.loadDB()
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    const newUser: User = {
      id: String(Date.now()), // Basit ID oluşturma
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
      isAdmin: data.isAdmin || false,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    db.users.push(newUser)
    this.saveDB(db)
    
    console.log('✅ User added to file store:', newUser.email)
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
    const db = this.loadDB()
    return db.users.map(u => ({
      ...u,
      password: '' // Şifreyi gizle
    }))
  }

  // Kullanıcı sayısı
  getUserCount(): number {
    const db = this.loadDB()
    return db.users.length
  }

  // Kullanıcı sil
  deleteUser(id: string): boolean {
    const db = this.loadDB()
    const userIndex = db.users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return false // Kullanıcı bulunamadı
    }
    
    // Admin kullanıcısının silinmesini engelle
    const user = db.users[userIndex]
    if (user.isAdmin) {
      console.log('⚠️ Admin user deletion prevented:', user.email)
      return false
    }
    
    db.users.splice(userIndex, 1)
    this.saveDB(db)
    
    console.log('✅ User deleted from file store:', user.email)
    return true
  }

  // Kullanıcı durumunu değiştir (aktif/deaktif)
  toggleUserStatus(id: string): boolean {
    const db = this.loadDB()
    const user = db.users.find(u => u.id === id)
    
    if (!user) {
      return false // Kullanıcı bulunamadı
    }
    
    user.isActive = !user.isActive
    this.saveDB(db)
    
    console.log(`✅ User status changed: ${user.email} → ${user.isActive ? 'active' : 'inactive'}`)
    return true
  }
}

// Singleton instance
export const fileUserStore = new FileUserStore()