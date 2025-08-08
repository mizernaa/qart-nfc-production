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
      return NextResponse.json(
        { success: false, message: 'Profil bulunamadı' },
        { status: 404 }
      )
    }
    
    // Temiz kullanıcı profili - sadece temel bilgiler
    const profile = {
      name: user.name,
      title: user.isAdmin ? "Sistem Yöneticisi" : "QART Kullanıcısı",
      bio: `${user.name} - QART dijital kartvizit kullanıcısı`,
      companyName: user.name,
      phone: "",
      email: user.email,
      website: "",
      address: "",
      city: "",
      country: "",
      slug: createSlug(user.name),
      isPremium: user.isAdmin,
      isPublic: true,
      profileImage: "",
      
      // Boş istatistikler
      stats: {
        customers: "",
        experience: "",
        projects: "",
        employees: ""
      },
      
      // Boş hizmetler
      services: [],
      
      // Boş özellikler
      features: []
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