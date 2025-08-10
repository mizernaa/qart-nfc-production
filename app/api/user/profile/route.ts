import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

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
    
    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı verileri yüklenemedi' },
        { status: 500 }
      )
    }
    
    // Kullanıcıyı bul
    const user = userId 
      ? users.find(u => u.id === userId)
      : users.find(u => u.email.toLowerCase() === userEmail!.toLowerCase())
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Slug oluştur
    const profileSlug = user.profile?.slug || user.name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    
    console.log('🔗 User profil slug:', profileSlug, 'for user:', user.name)
    
    // Profil verisi - file-based system'den
    const profile = {
      // User bilgileri
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      emailVerified: true, // Default
      createdAt: user.createdAt,
      
      // Profile bilgileri (varsa)
      slug: profileSlug,
      title: user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı"),
      bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
      phone: user.profile?.phone || "+90 555 000 0000",
      whatsapp: user.profile?.whatsapp || "+90 555 000 0000",
      website: user.profile?.website || "",
      address: user.profile?.address || "",
      companyName: user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
      logoUrl: user.profile?.logoUrl || "",
      coverImageUrl: user.profile?.coverImageUrl || "",
      
      // Subscription bilgileri
      isPremium: user.isAdmin,
      subscriptionPlan: user.isAdmin ? "QART Lifetime" : "Free",
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
      theme
    } = body

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı ID veya email gerekli' },
        { status: 400 }
      )
    }

    // File-based kullanıcı sistemi yükle
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      users = JSON.parse(usersData)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı verileri yüklenemedi' },
        { status: 500 }
      )
    }

    // Kullanıcıyı email ile bul
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    const user = users[userIndex]
    console.log('👤 Güncellenecek kullanıcı:', user.email)

    // Slug oluştur
    const profileSlug = (name || user.name).toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')

    console.log('🔗 Oluşturulan slug:', profileSlug)

    // Profil bilgilerini güncelle
    users[userIndex] = {
      ...user,
      name: name || user.name,
      profile: {
        ...user.profile,
        slug: profileSlug,
        title: title || user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "Kullanıcı"),
        bio: bio || user.profile?.bio || `${name || user.name} - QART dijital kartvizit kullanıcısı`,
        phone: phone || user.profile?.phone || "+90 555 000 0000",
        whatsapp: whatsapp || user.profile?.whatsapp || "+90 555 000 0000",
        website: website || user.profile?.website || "",
        address: address || user.profile?.address || "",
        companyName: companyName || user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
        profileImage: profileImage || user.profile?.profileImage || "/api/placeholder/150/150",
        coverImageUrl: coverImageUrl || user.profile?.coverImageUrl || "",
        logoUrl: logoUrl || user.profile?.logoUrl || "",
        isPublic: isPublic !== undefined ? isPublic : (user.profile?.isPublic !== false),
        theme: theme || user.profile?.theme || "modern"
      }
    }

    // Dosyaya kaydet
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    
    // Database'e de kaydet (dual storage)
    try {
      const prisma = new PrismaClient()
      
      console.log('👤 Güncellenecek kullanıcı:', email)
      
      // Kullanıcıyı database'de bul
      const dbUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { profile: true }
      })
      
      if (dbUser && dbUser.profile) {
        // Profili güncelle
        await prisma.profile.update({
          where: { userId: dbUser.id },
          data: {
            title: title || dbUser.profile.title,
            bio: bio || dbUser.profile.bio,
            phone: phone || dbUser.profile.phone,
            website: website || dbUser.profile.website,
            address: address || dbUser.profile.address,
            companyName: companyName || dbUser.profile.companyName,
            profileImage: profileImage || dbUser.profile.profileImage,
            coverImageUrl: coverImageUrl || dbUser.profile.coverImageUrl,
            logoUrl: logoUrl || dbUser.profile.logoUrl,
            isPublic: isPublic !== undefined ? isPublic : dbUser.profile.isPublic,
            theme: theme || dbUser.profile.theme,
            whatsapp: whatsapp || dbUser.profile.whatsapp
          }
        })
        
        console.log('💾 Profile database güncellendi:', email)
      }
      
      await prisma.$disconnect()
      
    } catch (dbError) {
      console.error('Database update error (non-critical):', dbError)
      // Continue execution, database update failure doesn't break file-based system
    }
    
    console.log('✅ Profil başarıyla güncellendi')

    // Güncellenmiş profili döndür
    const profile = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      isAdmin: users[userIndex].isAdmin,
      title: users[userIndex].profile.title,
      bio: users[userIndex].profile.bio,
      phone: users[userIndex].profile.phone,
      whatsapp: users[userIndex].profile.whatsapp,
      website: users[userIndex].profile.website,
      address: users[userIndex].profile.address,
      companyName: users[userIndex].profile.companyName,
      profileImage: users[userIndex].profile.profileImage,
      coverImageUrl: users[userIndex].profile.coverImageUrl,
      logoUrl: users[userIndex].profile.logoUrl,
      isPublic: users[userIndex].profile.isPublic,
      theme: users[userIndex].profile.theme,
      isPremium: users[userIndex].isAdmin,
      subscriptionPlan: users[userIndex].isAdmin ? "QART Lifetime" : "Free",
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