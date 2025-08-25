import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      
      // Profile bilgileri (PostgreSQL'den) - TÜM ALANLAR
      slug: profileSlug,
      title: user.profile?.title || "",
      bio: user.profile?.bio || "",
      phone: user.profile?.phone || "",
      alternativePhone: user.profile?.alternativePhone || "",
      whatsapp: user.profile?.whatsapp || "",
      email: user.profile?.email || user.email,
      alternativeEmail: user.profile?.alternativeEmail || "",
      website: user.profile?.website || "",
      address: user.profile?.address || "",
      city: user.profile?.city || "",
      district: user.profile?.district || "",
      country: user.profile?.country || "",
      postalCode: user.profile?.postalCode || "",
      googleMapsUrl: user.profile?.googleMapsUrl || "",
      workingHours: user.profile?.workingHours || null,
      companyName: user.profile?.companyName || "",
      companyLegalName: user.profile?.companyLegalName || "",
      companySlogan: user.profile?.companySlogan || "",
      companyDescription: user.profile?.companyDescription || "",
      companySector: user.profile?.companySector || "",
      companyFoundedYear: user.profile?.companyFoundedYear || "",
      companyEmployeeCount: user.profile?.companyEmployeeCount || "",
      logoUrl: user.profile?.logoUrl || "",
      coverImageUrl: user.profile?.coverImageUrl || "",
      
      // Subscription bilgileri
      isPremium: user.subscription === 'QART Lifetime' || user.subscription === 'Pro',
      subscriptionPlan: user.subscription || (user.isAdmin ? "QART Lifetime" : "Free"),
      subscriptionDate: user.createdAt,
      
      // Diğer
      profileImage: user.profile?.profileImage || "",
      theme: user.profile?.theme || "modern",
      themeId: user.profile?.themeId || "default",
      isPublic: user.profile?.isPublic !== false, // Default true
      
      // Sosyal medya ve banka verileri
      socialLinks: user.profile?.socialLinks || [],
      bankAccounts: user.profile?.bankAccounts || [],
      // E-Ticaret
      shopUrl: user.profile?.shopUrl,
      catalogUrl: user.profile?.catalogUrl,
      whatsappCatalog: user.profile?.whatsappCatalog,
      // Fatura Bilgileri
      companyTitle: user.profile?.companyTitle,
      taxOffice: user.profile?.taxOffice,
      taxNumber: user.profile?.taxNumber,
      tradeRegisterNo: user.profile?.tradeRegisterNo,
      mersisNo: user.profile?.mersisNo,
      billingAddress: user.profile?.billingAddress,
      // Google Business
      googleReviewsUrl: user.profile?.googleReviewsUrl,
      googleRating: user.profile?.googleRating,
      googleReviewCount: user.profile?.googleReviewCount,
      showGoogleReviews: user.profile?.showGoogleReviews,
      // Belgeler
      cvUrl: user.profile?.cvUrl,
      portfolioUrl: user.profile?.portfolioUrl,
      brochureUrl: user.profile?.brochureUrl
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
      alternativePhone,
      whatsapp,
      alternativeEmail,
      website,
      address,
      city,
      district,
      country,
      postalCode,
      googleMapsUrl,
      workingHours,
      companyName,
      companyLegalName,
      companySlogan,
      companyDescription,
      companySector,
      companyFoundedYear,
      companyEmployeeCount,
      profileImage,
      coverImageUrl,
      logoUrl,
      isPublic,
      theme,
      themeId,
      socialLinks,
      bankAccounts,
      // E-Ticaret
      shopUrl,
      catalogUrl,
      whatsappCatalog,
      // Fatura Bilgileri
      companyTitle,
      taxOffice,
      taxNumber,
      tradeRegisterNo,
      mersisNo,
      billingAddress,
      // Google Business
      googleReviewsUrl,
      googleRating,
      googleReviewCount,
      showGoogleReviews,
      // Belgeler
      cvUrl,
      portfolioUrl,
      brochureUrl
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
        title: title || user.profile?.title,
        bio: bio || user.profile?.bio,
        // İletişim
        phone: phone || user.profile?.phone,
        alternativePhone: alternativePhone || user.profile?.alternativePhone,
        whatsapp: whatsapp || user.profile?.whatsapp,
        email: email || user.email,
        alternativeEmail: alternativeEmail || user.profile?.alternativeEmail,
        website: website || user.profile?.website,
        // Lokasyon
        address: address || user.profile?.address,
        city: city || user.profile?.city,
        district: district || user.profile?.district,
        country: country || user.profile?.country || "Türkiye",
        postalCode: postalCode || user.profile?.postalCode,
        googleMapsUrl: googleMapsUrl || user.profile?.googleMapsUrl,
        workingHours: workingHours || user.profile?.workingHours,
        // Şirket
        companyName: companyName || user.profile?.companyName,
        companyLegalName: companyLegalName || user.profile?.companyLegalName,
        companySlogan: companySlogan || user.profile?.companySlogan,
        companyDescription: companyDescription || user.profile?.companyDescription,
        companySector: companySector || user.profile?.companySector,
        companyFoundedYear: companyFoundedYear || user.profile?.companyFoundedYear,
        companyEmployeeCount: companyEmployeeCount || user.profile?.companyEmployeeCount,
        // Görseller
        profileImage: profileImage || user.profile?.profileImage,
        coverImageUrl: coverImageUrl || user.profile?.coverImageUrl,
        logoUrl: logoUrl || user.profile?.logoUrl,
        // E-Ticaret
        shopUrl: shopUrl || user.profile?.shopUrl,
        catalogUrl: catalogUrl || user.profile?.catalogUrl,
        whatsappCatalog: whatsappCatalog !== undefined ? whatsappCatalog : user.profile?.whatsappCatalog,
        // Fatura Bilgileri
        companyTitle: companyTitle || user.profile?.companyTitle,
        taxOffice: taxOffice || user.profile?.taxOffice,
        taxNumber: taxNumber || user.profile?.taxNumber,
        tradeRegisterNo: tradeRegisterNo || user.profile?.tradeRegisterNo,
        mersisNo: mersisNo || user.profile?.mersisNo,
        billingAddress: billingAddress || user.profile?.billingAddress,
        // Google Business
        googleReviewsUrl: googleReviewsUrl || user.profile?.googleReviewsUrl,
        googleRating: googleRating || user.profile?.googleRating,
        googleReviewCount: googleReviewCount || user.profile?.googleReviewCount,
        showGoogleReviews: showGoogleReviews !== undefined ? showGoogleReviews : user.profile?.showGoogleReviews,
        // Belgeler
        cvUrl: cvUrl || user.profile?.cvUrl,
        portfolioUrl: portfolioUrl || user.profile?.portfolioUrl,
        brochureUrl: brochureUrl || user.profile?.brochureUrl,
        // Diğer
        isPublic: isPublic !== undefined ? isPublic : (user.profile?.isPublic !== false),
        themeId: themeId || user.profile?.themeId || "default"
      }
    }

    // Update user profile using DatabaseUserStore
    await DatabaseUserStore.updateUser(user.id, updateData)
    
    // Handle social links if provided
    if (socialLinks && Array.isArray(socialLinks)) {
      try {
        console.log('🔗 Sosyal medya bağlantıları güncelleniyor:', socialLinks.length)
        // Delete existing social links
        await prisma.socialLink.deleteMany({
          where: { profileId: user.profile.id }
        })
        
        // Create new social links
        const validLinks = socialLinks.filter((link: any) => 
          link.platform && link.url && link.enabled
        )
        
        if (validLinks.length > 0) {
          await prisma.socialLink.createMany({
            data: validLinks.map((link: any, index: number) => ({
              profileId: user.profile.id,
              platform: link.platform,
              url: link.url,
              isVisible: link.enabled,
              order: index
            }))
          })
          console.log('✅ Sosyal medya bağlantıları kaydedildi:', validLinks.length)
        }
      } catch (error) {
        console.error('❌ Sosyal medya bağlantıları kaydetme hatası:', error)
      }
    }

    // Handle bank accounts if provided
    if (bankAccounts && Array.isArray(bankAccounts)) {
      try {
        console.log('🏦 Banka hesapları güncelleniyor:', bankAccounts.length)
        // Delete existing bank accounts
        await prisma.bankAccount.deleteMany({
          where: { profileId: user.profile.id }
        })
        
        // Create new bank accounts
        const validAccounts = bankAccounts.filter((account: any) => 
          account.bankName && account.iban && account.accountName && account.enabled
        )
        
        if (validAccounts.length > 0) {
          await prisma.bankAccount.createMany({
            data: validAccounts.map((account: any, index: number) => ({
              profileId: user.profile.id,
              bankName: account.bankName,
              iban: account.iban,
              accountName: account.accountName,
              isEnabled: account.enabled,
              order: index
            }))
          })
          console.log('✅ Banka hesapları kaydedildi:', validAccounts.length)
        }
      } catch (error) {
        console.error('❌ Banka hesapları kaydetme hatası:', error)
      }
    }
    
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
      theme: updatedUser!.profile?.themeId || "default",
      themeId: updatedUser!.profile?.themeId || "default",
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