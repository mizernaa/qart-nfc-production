import { CentralUserStore } from './central-user-store'
import { ProductionUserStore } from './production-user-store'

/**
 * Universal user store that automatically detects environment and uses appropriate storage
 * - Development/Local: Uses file-based CentralUserStore
 * - Production/Vercel: Uses in-memory ProductionUserStore
 */
class UniversalUserStore {
  private static isProduction(): boolean {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  }

  private static getStore() {
    return this.isProduction() ? ProductionUserStore : CentralUserStore
  }

  static async initialize() {
    const store = this.getStore()
    console.log(`🚀 Initializing ${this.isProduction() ? 'ProductionUserStore' : 'CentralUserStore'}`)
    
    // Initialize the appropriate store if it has an initialize method
    if (store.initialize) {
      await store.initialize()
    }
  }

  static async authenticateUser(email: string, password: string) {
    const store = this.getStore()
    console.log(`🔐 Using ${this.isProduction() ? 'ProductionUserStore' : 'CentralUserStore'} for auth:`, email)
    return await store.authenticateUser(email, password)
  }

  static async registerUser(email: string, password: string, name: string, isAdmin = false) {
    const store = this.getStore()
    console.log(`📝 Using ${this.isProduction() ? 'ProductionUserStore' : 'CentralUserStore'} for register:`, email)
    return await store.registerUser(email, password, name, isAdmin)
  }

  static getAllUsers() {
    const store = this.getStore()
    return store.getAllUsers()
  }

  static findUserByEmail(email: string) {
    const store = this.getStore()
    return store.findUserByEmail(email)
  }

  static deleteUser(userId: string) {
    const store = this.getStore()
    return store.deleteUser(userId)
  }

  static toggleUserStatus(userId: string) {
    const store = this.getStore()
    return store.toggleUserStatus(userId)
  }

  static updateUser(userId: string, updates: any) {
    const store = this.getStore()
    return store.updateUser(userId, updates)
  }
}

export { UniversalUserStore }