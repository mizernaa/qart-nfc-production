import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

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
    
    // Initialize DatabaseUserStore
    await DatabaseUserStore.initialize()
    
    // Get user from PostgreSQL
    const user = userEmail 
      ? await DatabaseUserStore.getUserByEmail(userEmail)
      : await DatabaseUserStore.getUserById(userId!)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Slug oluştur - profile'dan al veya user name'den oluştur
    const profileSlug = user.profile?.slug || user.name?.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') || 'user'
    
    console.log('🔗 User profil slug:', profileSlug, 'for user:', user.name)
    
    // Profil verisi - PostgreSQL'den
    const profile = {
      // User bilgileri
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: user.emailVerified || true,
      createdAt: user.createdAt,
      
      // Profile bilgileri (PostgreSQL'den)
      slug: profileSlug,
      title: user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı"),
      bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
      phone: user.profile?.phone || "+90 555 000 0000",
      whatsapp: user.profile?.whatsapp || user.profile?.phone || "+90 555 000 0000",
      website: user.profile?.website || "",
      address: user.profile?.address || "",
      companyName: user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
      logoUrl: user.profile?.logoUrl || "",
      coverImageUrl: user.profile?.coverImageUrl || "",
      
      // Subscription bilgileri
      isPremium: user.subscription === 'QART Lifetime' || user.subscription === 'Pro',
      subscriptionPlan: user.subscription || (user.isAdmin ? "QART Lifetime" : "Free"),
      subscriptionDate: user.createdAt,
      
      // Diğer
      profileImage: user.profile?.profileImage || "/api/placeholder/150/150",
      theme: user.profile?.theme || "modern",
      isPublic: user.profile?.isPublic !== false // Default true
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Profil güncelleme isteği:', body)
    
    const { 
      userId, 
      email,
      name,
      title,
      bio,
      phone,
      whatsapp,
      website,
      address,
      companyName,
      profileImage,
      coverImageUrl,
      logoUrl,
      isPublic,
      theme,
      themeId
    } = body

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID veya email gerekli' },
        { status: 400 }
      )
    }

    // Initialize DatabaseUserStore
    await DatabaseUserStore.initialize()
    
    // Get user from PostgreSQL
    const user = email 
      ? await DatabaseUserStore.getUserByEmail(email)
      : await DatabaseUserStore.getUserById(userId!)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    console.log('👤 Güncellenecek kullanıcı:', user.email)

    // Slug oluştur
    const profileSlug = (name || user.name)?.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') || 'user'

    console.log('🔗 Oluşturulan slug:', profileSlug)

    // DatabaseUserStore ile profil güncelle
    const updateData = {
      name: name || user.name,
      profile: {
        slug: profileSlug,
        title: title || user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı"),
        bio: bio || user.profile?.bio || `${name || user.name} - QART dijital kartvizit kullanıcısı`,
        phone: phone || user.profile?.phone || "+90 555 000 0000",
        whatsapp: whatsapp || user.profile?.whatsapp || user.profile?.phone || "+90 555 000 0000",
        website: website || user.profile?.website || "",
        address: address || user.profile?.address || "",
        companyName: companyName || user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
        profileImage: profileImage || user.profile?.profileImage || "/api/placeholder/150/150",
        coverImageUrl: coverImageUrl || user.profile?.coverImageUrl || "",
        logoUrl: logoUrl || user.profile?.logoUrl || "",
        isPublic: isPublic !== undefined ? isPublic : (user.profile?.isPublic !== false),
        themeId: themeId || theme || user.profile?.themeId || "default"
      }
    }

    // Update user profile using DatabaseUserStore
    await DatabaseUserStore.updateUser(user.id, updateData)
    
    console.log('✅ Profil başarıyla güncellendi')

    // Güncellenmiş kullanıcıyı al
    const updatedUser = await DatabaseUserStore.getUserByEmail(user.email)

    // Güncellenmiş profili döndür
    const profile = {
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      isAdmin: updatedUser!.isAdmin,
      title: updatedUser!.profile?.title,
      bio: updatedUser!.profile?.bio,
      phone: updatedUser!.profile?.phone,
      whatsapp: updatedUser!.profile?.whatsapp,
      website: updatedUser!.profile?.website,
      address: updatedUser!.profile?.address,
      companyName: updatedUser!.profile?.companyName,
      profileImage: updatedUser!.profile?.profileImage,
      coverImageUrl: updatedUser!.profile?.coverImageUrl,
      logoUrl: updatedUser!.profile?.logoUrl,
      isPublic: updatedUser!.profile?.isPublic,
      theme: updatedUser!.profile?.theme,
      isPremium: updatedUser!.subscription === 'QART Lifetime' || updatedUser!.subscription === 'Pro',
      subscriptionPlan: updatedUser!.subscription || (updatedUser!.isAdmin ? "QART Lifetime" : "Free"),
      slug: profileSlug
    }

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      profile
    })

  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
    return NextResponse.json(
      { success: false, message: 'Profil güncellenemedi' },
      { status: 500 }
    )
  }
}