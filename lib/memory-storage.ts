// Shared memory storage for users across all endpoints
export let memoryUsers: any[] = [
  {
    id: "admin-001",
    email: "admin@qart.app",
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m", // admin123
    name: "Admin User",
    isAdmin: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    profile: {
      slug: "admin-user",
      title: "Sistem Yöneticisi",
      bio: "QART Sistem Yöneticisi",
      phone: "+90 555 000 0001",
      companyName: "QART Team"
    }
  },
  {
    id: "demo-001",
    email: "demo@qart.app", 
    password: "$2b$12$SSoWCDr5fU.jLH8eKfJlF.9XDNz4oX3WMkJhf0KCMnGQHqZ0KX2.m", // demo123
    name: "Demo User",
    isAdmin: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    profile: {
      slug: "demo-user",
      title: "Demo Kullanıcısı", 
      bio: "QART Demo Kullanıcısı",
      phone: "+90 555 000 0002",
      companyName: ""
    }
  }
]

export function addUser(user: any) {
  memoryUsers.push(user)
}

export function findUser(email: string) {
  return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function getAllUsers() {
  return memoryUsers
}