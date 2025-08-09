import { NextRequest, NextResponse } from 'next/server'
import { prismaUserStore } from '@/lib/prisma-user-store'

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
      ? await prismaUserStore.findById(userId)
      : await prismaUserStore.findByEmail(userEmail!)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Profil verisi - gerçek database'den
    const profile = {
      // User bilgileri
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      
      // Profile bilgileri (varsa)
      slug: user.profile?.slug || user.name.toLowerCase().replace(/\s+/g, '-'),
      title: user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı"),
      bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
      phone: user.profile?.phone || "+90 555 000 0000",
      whatsapp: user.profile?.whatsapp || "+90 555 000 0000",
      website: user.profile?.website || "",
      address: user.profile?.address || "",
      companyName: user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
      logoUrl: user.profile?.logoUrl,
      coverImageUrl: user.profile?.coverImageUrl,
      
      // Subscription bilgileri
      isPremium: user.isAdmin || (user.subscription?.status === 'active'),
      subscriptionPlan: user.subscription?.plan || (user.isAdmin ? "QART Lifetime" : "Free"),
      subscriptionDate: user.subscription?.createdAt || user.createdAt,
      
      // Diğer
      profileImage: "/api/placeholder/150/150",
      theme: "modern",
      isPublic: user.profile?.isPublic ?? true
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