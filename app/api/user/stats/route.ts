import { NextRequest, NextResponse } from 'next/server'
import { fileUserStore } from '@/lib/file-user-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userEmail = searchParams.get('email')
    
    if (!userId && !userEmail) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID veya email gerekli' },
        { status: 400 }
      )
    }
    
    // Kullanıcıyı bul
    const user = userId 
      ? fileUserStore.findById(userId)
      : fileUserStore.findByEmail(userEmail!)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Basit kullanıcı istatistikleri (gerçek uygulamada analytics tablosundan gelir)
    const isActive = user.isActive
    const isPremium = user.isAdmin // Admin = Premium olarak varsayıyoruz
    
    // Temel analitik veriler - gerçek uygulamada veritabanından çekilir
    const baseViews = isPremium ? 150 : 25
    const baseVisitors = isPremium ? 85 : 15
    const baseDuration = isPremium ? 180 : 45
    
    // Zaman damgasına göre değişken değerler
    const now = new Date()
    const dayOffset = now.getDate()
    const hourOffset = now.getHours()
    
    const analytics = {
      overview: {
        totalViews: baseViews + (dayOffset * 5) + Math.floor(Math.random() * 20),
        viewsToday: Math.floor(Math.random() * 15) + 3,
        viewsThisWeek: baseViews + (dayOffset * 3),
        viewsThisMonth: baseViews + (dayOffset * 8),
        uniqueVisitors: baseVisitors + (dayOffset * 2),
        averageSessionDuration: baseDuration + (hourOffset * 10) + Math.floor(Math.random() * 30),
        bounceRate: 35 + Math.floor(Math.random() * 20),
        conversionRate: isPremium ? 8 + Math.floor(Math.random() * 5) : 3 + Math.floor(Math.random() * 3),
        profileShares: Math.floor(Math.random() * 25) + (isPremium ? 15 : 5),
        contactClicks: Math.floor(Math.random() * 40) + (isPremium ? 20 : 8),
        growth: {
          views: Math.floor(Math.random() * 30) - 15,
          visitors: Math.floor(Math.random() * 25) - 12,
          clicks: Math.floor(Math.random() * 20) - 10,
          duration: Math.floor(Math.random() * 15) - 7
        }
      },
      
      // Son 7 günlük trend
      viewsTrend: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çrş', 'Prş', 'Cum', 'Cmt']
        return {
          date: dayNames[date.getDay()],
          views: Math.floor(Math.random() * 30) + (isPremium ? 15 : 5),
          visitors: Math.floor(Math.random() * 20) + (isPremium ? 10 : 3)
        }
      }),
      
      // Cihaz dağılımı
      deviceStats: [
        { device: "Mobil", views: Math.floor(Math.random() * 100) + 50, percentage: 65 },
        { device: "Masaüstü", views: Math.floor(Math.random() * 60) + 20, percentage: 25 },
        { device: "Tablet", views: Math.floor(Math.random() * 30) + 5, percentage: 10 }
      ],
      
      // Ülke dağılımı
      countryStats: [
        { country: "Türkiye", views: Math.floor(Math.random() * 80) + 40, percentage: 75, flag: "🇹🇷" },
        { country: "Almanya", views: Math.floor(Math.random() * 20) + 8, percentage: 12, flag: "🇩🇪" },
        { country: "ABD", views: Math.floor(Math.random() * 15) + 5, percentage: 8, flag: "🇺🇸" },
        { country: "İngiltere", views: Math.floor(Math.random() * 10) + 3, percentage: 3, flag: "🇬🇧" },
        { country: "Fransa", views: Math.floor(Math.random() * 8) + 2, percentage: 2, flag: "🇫🇷" }
      ],
      
      // Sosyal medya tıklamaları
      socialClicks: [
        { platform: "LinkedIn", clicks: Math.floor(Math.random() * 40) + 20, percentage: 35 },
        { platform: "Instagram", clicks: Math.floor(Math.random() * 30) + 15, percentage: 25 },
        { platform: "WhatsApp", clicks: Math.floor(Math.random() * 35) + 18, percentage: 30 },
        { platform: "GitHub", clicks: Math.floor(Math.random() * 15) + 5, percentage: 5 },
        { platform: "Twitter", clicks: Math.floor(Math.random() * 12) + 3, percentage: 5 }
      ],
      
      // Trafik kaynakları
      referrerStats: [
        { source: "Direkt Erişim", views: Math.floor(Math.random() * 60) + 30, percentage: 45 },
        { source: "QR Kod", views: Math.floor(Math.random() * 40) + 20, percentage: 30 },
        { source: "LinkedIn", views: Math.floor(Math.random() * 20) + 10, percentage: 15 },
        { source: "Instagram", views: Math.floor(Math.random() * 15) + 5, percentage: 7 },
        { source: "Google", views: Math.floor(Math.random() * 8) + 2, percentage: 3 }
      ]
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isPremium,
        createdAt: user.createdAt
      },
      analytics
    })
    
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { success: false, message: 'Kullanıcı istatistikleri alınamadı' },
      { status: 500 }
    )
  }
}