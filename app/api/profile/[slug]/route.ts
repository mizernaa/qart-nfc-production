import { NextRequest, NextResponse } from 'next/server'
import { fileUserStore } from '@/lib/file-user-store'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug gerekli' },
        { status: 400 }
      )
    }
    
    // Tüm kullanıcıları al ve slug'a göre ara
    const users = fileUserStore.getAllUsers()
    
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
    
    // Slug'a göre kullanıcı bul
    const user = users.find(u => createSlug(u.name) === slug)
    
    if (!user) {
      // Hardcoded demo profil için fallback
      if (slug === 'huseyin-demir') {
        return NextResponse.json({
          success: true,
          profile: {
            name: "Hüseyin Demir",
            title: "Elektrik Mühendisi",
            bio: "20+ yıllık deneyimli Elektrik Mühendisi. Endüstriyel elektrik ve otomasyon sistemleri uzmanı.",
            companyName: "HD Elektrik",
            phone: "+90 555 987 6543",
            email: "huseyin@hdelektrik.com",
            website: "https://hdelektrik.com",
            address: "Bağdat Caddesi, Elektrikçiler Sokak No:23",
            city: "İstanbul",
            country: "Türkiye",
            slug: "huseyin-demir",
            isPremium: true,
            isPublic: true,
            profileImage: "/api/placeholder/150/150"
          }
        })
      }
      
      return NextResponse.json(
        { success: false, message: 'Profil bulunamadı' },
        { status: 404 }
      )
    }
    
    // Gerçek kullanıcı profili oluştur
    const profile = {
      name: user.name,
      title: user.isAdmin ? "Sistem Yöneticisi" : "QART Kullanıcısı",
      bio: `${user.name} - QART dijital kartvizit kullanıcısı`,
      companyName: user.isAdmin ? "QART Team" : user.name,
      phone: "+90 555 000 0000",
      email: user.email,
      website: "",
      address: "",
      city: "İstanbul",
      country: "Türkiye",
      slug: createSlug(user.name),
      isPremium: user.isAdmin,
      isPublic: true,
      profileImage: "/api/placeholder/150/150",
      
      // İstatistikler
      stats: {
        customers: user.isAdmin ? "300+" : "50+",
        experience: user.isAdmin ? "5+ yıl" : "2+ yıl",
        projects: user.isAdmin ? "500+" : "100+",
        employees: user.isAdmin ? "15+" : "5+"
      },
      
      // Hizmetler
      services: [
        {
          title: user.isAdmin ? "Sistem Yönetimi" : "Dijital Kartvizit",
          description: user.isAdmin ? "Profesyonel sistem yönetimi hizmetleri" : "Modern dijital kartvizit çözümleri"
        },
        {
          title: "Destek Hizmetleri",
          description: "7/24 teknik destek ve danışmanlık"
        },
        {
          title: "Özelleştirme",
          description: "İhtiyaca özel çözümler"
        }
      ],
      
      // Özellikler
      features: [
        user.isAdmin ? "Deneyimli Ekip" : "Güvenilir Hizmet",
        user.isAdmin ? "7/24 Destek" : "Hızlı Çözüm",
        "2 Yıl Garanti",
        "Ücretsiz Keşif"
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
  }
}