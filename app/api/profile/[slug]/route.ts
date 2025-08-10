import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug gerekli' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Looking for profile with slug:', slug)
    
    // Kullanıcı adından slug oluştur
    const createSlug = (name: string) => {
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
    }
    
    // Database'den tüm kullanıcıları al
    const users = await prisma.$queryRaw`
      SELECT id, email, name, "isAdmin", "isActive", "createdAt"
      FROM "User" 
      WHERE "isActive" = true
      ORDER BY "createdAt" DESC
    ` as any[]
    
    console.log(`👥 Found ${users.length} active users`)
    
    // Slug'a göre kullanıcı bul
    const user = users.find(u => createSlug(u.name) === slug)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Profil bulunamadı' },
        { status: 404 }
      )
    }
    
    console.log('✅ Found user:', user.name, user.email)
    
    // Gerçek profil verisini al
    const realProfile = await prisma.profile.findFirst({
      where: { userId: user.id }
    })
    
    console.log('🔍 Real profile found:', realProfile ? 'YES' : 'NO')
    
    // Gerçek profil verisi ile response oluştur
    const profile = {
      name: user.name,
      title: realProfile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "QART Kullanıcısı"),
      bio: realProfile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
      companyName: realProfile?.companyName || (user.isAdmin ? "QART Team" : ""),
      phone: realProfile?.phone || "+90 555 000 0000",
      email: user.email,
      website: realProfile?.website || "",
      address: realProfile?.address || "",
      city: "İstanbul",
      country: "Türkiye", 
      whatsapp: realProfile?.whatsapp || realProfile?.phone || "+90 555 000 0000",
      slug: createSlug(user.name),
      isPremium: user.isAdmin,
      isPublic: realProfile?.isPublic ?? true,
      profileImage: realProfile?.profileImage || "",
      coverImageUrl: realProfile?.coverImageUrl || "",
      logoUrl: realProfile?.logoUrl || "",
      theme: realProfile?.theme || "modern",
      
      // Kullanıcıya özgü istatistikler
      stats: {
        customers: user.isAdmin ? "500+" : "50+",
        experience: user.isAdmin ? "5+ yıl" : "2+ yıl",
        projects: user.isAdmin ? "1000+" : "100+",
        employees: user.isAdmin ? "10+" : "1-5"
      },
      
      // Temel hizmetler
      services: [
        {
          title: "Dijital Kartvizit",
          description: "Modern ve profesyonel dijital kartvizit hizmeti",
          price: "Ücretsiz",
          icon: "card"
        },
        {
          title: "QR Kod Oluşturma",
          description: "Özelleştirilebilir QR kod tasarımları",
          price: "Dahil",
          icon: "qr"
        }
      ],
      
      // Temel özellikler
      features: [
        {
          title: "Kolay Paylaşım",
          description: "QR kod ve link ile anında paylaşım",
          icon: "share"
        },
        {
          title: "Analitik Takibi",
          description: "Görüntüleme istatistikleri ve analiz",
          icon: "analytics"
        },
        {
          title: "Mobil Uyumlu",
          description: "Tüm cihazlarda mükemmel görünüm",
          icon: "mobile"
        }
      ]
    }
    
    return NextResponse.json({
      success: true,
      profile
    })
    
  } catch (error) {
    console.error('Error fetching profile by slug:', error)
    return NextResponse.json(
      { success: false, message: 'Profil bilgisi alınamadı' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}