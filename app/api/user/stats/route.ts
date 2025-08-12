import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient()
  
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
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findUnique({ where: { email: userEmail! } })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Temiz analitik veriler - tüm değerler sıfır
    const isActive = user.isActive
    const isPremium = user.isAdmin
    
    const analytics = {
      overview: {
        totalViews: 0,
        viewsToday: 0,
        viewsThisWeek: 0,
        viewsThisMonth: 0,
        uniqueVisitors: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        profileShares: 0,
        contactClicks: 0,
        growth: {
          views: 0,
          visitors: 0,
          clicks: 0,
          duration: 0
        }
      },
      
      // Boş trend verileri
      viewsTrend: [
        { date: "Pzt", views: 0, visitors: 0 },
        { date: "Sal", views: 0, visitors: 0 },
        { date: "Çrş", views: 0, visitors: 0 },
        { date: "Prş", views: 0, visitors: 0 },
        { date: "Cum", views: 0, visitors: 0 },
        { date: "Cmt", views: 0, visitors: 0 },
        { date: "Paz", views: 0, visitors: 0 }
      ],
      
      // Boş cihaz dağılımı
      deviceStats: [
        { device: "Mobil", views: 0, percentage: 0 },
        { device: "Masaüstü", views: 0, percentage: 0 },
        { device: "Tablet", views: 0, percentage: 0 }
      ],
      
      // Boş ülke dağılımı
      countryStats: [
        { country: "Türkiye", views: 0, percentage: 0, flag: "🇹🇷" },
        { country: "Almanya", views: 0, percentage: 0, flag: "🇩🇪" },
        { country: "ABD", views: 0, percentage: 0, flag: "🇺🇸" },
        { country: "İngiltere", views: 0, percentage: 0, flag: "🇬🇧" },
        { country: "Fransa", views: 0, percentage: 0, flag: "🇫🇷" }
      ],
      
      // Boş sosyal medya tıklamaları
      socialClicks: [
        { platform: "LinkedIn", clicks: 0, percentage: 0 },
        { platform: "Instagram", clicks: 0, percentage: 0 },
        { platform: "WhatsApp", clicks: 0, percentage: 0 },
        { platform: "GitHub", clicks: 0, percentage: 0 },
        { platform: "Twitter", clicks: 0, percentage: 0 }
      ],
      
      // Boş trafik kaynakları
      referrerStats: [
        { source: "Direkt Erişim", views: 0, percentage: 0 },
        { source: "QR Kod", views: 0, percentage: 0 },
        { source: "LinkedIn", views: 0, percentage: 0 },
        { source: "Instagram", views: 0, percentage: 0 },
        { source: "Google", views: 0, percentage: 0 }
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
  } finally {
    await prisma.$disconnect()
  }
}