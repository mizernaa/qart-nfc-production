import { NextRequest, NextResponse } from 'next/server'
import { fileUserStore } from '@/lib/file-user-store'

export async function GET(request: NextRequest) {
  try {
    // Get all users from file store
    const users = fileUserStore.getAllUsers()
    
    // Calculate real statistics
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.isActive).length
    const inactiveUsers = totalUsers - activeUsers
    const adminUsers = users.filter(u => u.isAdmin).length
    const premiumUsers = users.filter(u => u.isAdmin).length // Currently admin = premium
    
    // Calculate growth (simplified - based on recent registrations)
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentUsers = users.filter(u => {
      const createdDate = new Date(u.createdAt)
      return createdDate > oneWeekAgo
    }).length
    
    const userGrowth = totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0
    
    // Mock revenue data (would come from payment system in real app)
    const revenue = {
      total: premiumUsers * 799, // 799 TL per premium user
      monthly: 0, // Lifetime model, so no monthly recurring
      today: 0,
      growth: 0
    }
    
    // System stats (would come from system monitoring in real app)
    const system = {
      uptime: 99.9,
      cpu: Math.floor(Math.random() * 30) + 10, // Random between 10-40%
      memory: Math.floor(Math.random() * 40) + 20, // Random between 20-60%
      storage: Math.floor(Math.random() * 20) + 10, // Random between 10-30%
      requests: totalUsers * 150 // Estimate requests based on users
    }
    
    // Activity stats
    const activities = {
      newUsers: recentUsers,
      newOrders: premiumUsers, // Assuming all premium users have orders
      supportTickets: Math.floor(totalUsers * 0.1), // 10% of users might need support
      systemAlerts: 0
    }
    
    // Create recent activities based on real users
    const recentActivities = users.slice(-5).map((user, index) => ({
      id: `activity_${index}`,
      user: user.name,
      action: user.isAdmin ? 'Admin girişi yaptı' : 'Profil güncellendi',
      time: `${Math.floor(Math.random() * 60)} dakika önce`,
      type: user.isAdmin ? 'danger' : 'success'
    }))
    
    // Create recent orders for premium users
    const recentOrders = users.filter(u => u.isAdmin).slice(-3).map((user, index) => ({
      id: `order_${Date.now()}_${index}`,
      customer: user.name,
      plan: 'QART Lifetime',
      amount: 799,
      status: 'completed'
    }))
    
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        premium: premiumUsers,
        growth: userGrowth
      },
      revenue,
      system,
      activities,
      recentActivities,
      recentOrders
    }
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, message: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}