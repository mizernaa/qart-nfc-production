import { NextRequest, NextResponse } from 'next/server'
import { DatabaseUserStore } from '@/lib/database-user-store'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug gerekli' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Public profile requested for slug:', slug)
    
    // Initialize DatabaseUserStore
    await DatabaseUserStore.initialize()
    
    // Get all users and find by profile slug
    const users = await DatabaseUserStore.getAllUsers()
    
    console.log(`👥 Found ${users.length} users`)
    
    // Create slug from name function
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
    
    // Find user by profile slug or generated slug from name
    const user = users.find(u => {
      const profileSlug = u.profile?.slug
      const generatedSlug = createSlug(u.name || '')
      
      console.log(`👤 Checking user: ${u.name}, profile slug: ${profileSlug}, generated: ${generatedSlug}`)
      
      return profileSlug === slug || generatedSlug === slug
    })
    
    if (!user || !user.isActive) {
      console.log('❌ Profile not found or inactive:', slug)
      return NextResponse.json(
        { success: false, message: 'Profil bulunamadı' },
        { status: 404 }
      )
    }
    
    // Check if profile is public
    if (user.profile?.isPublic === false) {
      console.log('❌ Profile is private:', slug)
      return NextResponse.json(
        { success: false, message: 'Bu profil özeldir' },
        { status: 403 }
      )
    }
    
    console.log('✅ Public profile found:', user.name)
    
    // Build public profile data (excluding sensitive information)
    const profile = {
      // Basic info
      name: user.name,
      title: user.profile?.title || (user.isAdmin ? "Sistem Yöneticisi" : "QART Kullanıcısı"),
      bio: user.profile?.bio || `${user.name} - QART dijital kartvizit kullanıcısı`,
      
      // Contact info
      phone: user.profile?.phone || "+90 555 000 0000",
      whatsapp: user.profile?.whatsapp || user.profile?.phone || "+90 555 000 0000",
      email: user.email,
      website: user.profile?.website || "",
      address: user.profile?.address || "",
      city: user.profile?.address?.split(',')[1]?.trim() || "İstanbul",
      country: "Türkiye",
      
      // Company info
      companyName: user.profile?.companyName || (user.isAdmin ? "QART Team" : ""),
      profileImage: user.profile?.profileImage || "/api/placeholder/150/150",
      logoUrl: user.profile?.logoUrl || "",
      coverImageUrl: user.profile?.coverImageUrl || "",
      
      // Status
      isPremium: user.subscription === 'QART Lifetime' || user.subscription === 'Pro' || user.isAdmin,
      subscriptionPlan: user.subscription || (user.isAdmin ? "QART Lifetime" : "Free"),
      isActive: user.isActive,
      isPublic: user.profile?.isPublic !== false, // Default to true
      
      // Settings
      theme: user.profile?.themeId || "default",
      themeId: user.profile?.themeId || "default", 
      slug: user.profile?.slug || createSlug(user.name || ''),
      
      // Meta info
      createdAt: user.createdAt,
      emailVerified: true, // Simplified for now
      
    }
    
    // Record view analytics (optional - could be implemented later)
    try {
      console.log('📊 Profile view recorded for:', slug)
    } catch (error) {
      // Non-critical, don't fail the request
      console.error('Analytics error:', error)
    }
    
    return NextResponse.json({
      success: true,
      profile
    })
    
  } catch (error) {
    console.error('Error fetching public profile:', error)
    return NextResponse.json(
      { success: false, message: 'Profil bilgisi alınamadı' },
      { status: 500 }
    )
  }
}