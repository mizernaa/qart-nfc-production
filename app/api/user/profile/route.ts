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
    
    // Profil verisi oluştur
    const profile = {
      // Üyelik Bilgileri
      isPremium: user.isAdmin, // Admin = Premium olarak varsay
      subscriptionPlan: user.isAdmin ? "QART Lifetime" : "Free",
      subscriptionDate: user.createdAt,
      
      // Kişisel Bilgiler
      name: user.name,
      email: user.email,
      title: user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı",
      bio: `${user.name} - QART dijital kartvizit kullanıcısı`,
      
      // Temel İletişim (gerçek uygulamada kullanıcıdan alınır)
      phone: "+90 555 000 0000",
      whatsapp: "+90 555 000 0000",
      website: "",
      
      // Adres (varsayılan)
      address: "",
      city: "İstanbul",
      country: "Türkiye",
      
      // Diğer
      slug: createSlug(user.name),
      profileImage: "/api/placeholder/150/150",
      theme: "modern",
      isPublic: true,
      
      // Şirket Bilgileri (varsayılan - kullanıcı doldurabilir)
      companyName: user.isAdmin ? "QART Team" : "",
      companyLegalName: "",
      taxOffice: "",
      taxNumber: "",
    }
    
    return NextResponse.json({
      success: true,
      profile
    })
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, message: 'Profil bilgileri alınamadı' },
      { status: 500 }
    )
  }
}