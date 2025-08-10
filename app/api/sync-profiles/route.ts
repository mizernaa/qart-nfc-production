import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Syncing file data to database...')
    
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
    
    const prisma = new PrismaClient()
    let synced = 0
    
    try {
      for (const user of users) {
        if (!user.profile) continue
        
        // Database'de kullanıcıyı bul
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          include: { profile: true }
        })
        
        if (dbUser && dbUser.profile) {
          console.log(`📄 Syncing ${user.email}:`, {
            logoUrl: user.profile.logoUrl,
            profileImage: user.profile.profileImage
          })
          
          // File'dan database'e sync et (sadece mevcut alanlar)
          const updateData: any = {}
          
          if (user.profile.title) updateData.title = user.profile.title
          if (user.profile.bio) updateData.bio = user.profile.bio
          if (user.profile.phone) updateData.phone = user.profile.phone
          if (user.profile.website !== undefined) updateData.website = user.profile.website
          if (user.profile.address !== undefined) updateData.address = user.profile.address
          if (user.profile.companyName !== undefined) updateData.companyName = user.profile.companyName
          if (user.profile.coverImageUrl !== undefined) updateData.coverImageUrl = user.profile.coverImageUrl
          if (user.profile.logoUrl !== undefined) updateData.logoUrl = user.profile.logoUrl
          if (user.profile.whatsapp) updateData.whatsapp = user.profile.whatsapp
          
          // Sadece güncellenmesi gereken alanlar varsa güncelle
          if (Object.keys(updateData).length > 0) {
            await prisma.profile.update({
              where: { userId: dbUser.id },
              data: updateData
            })
          }
          
          synced++
        }
      }
      
      console.log(`✅ Synced ${synced} profiles successfully`)
      
      return NextResponse.json({
        success: true,
        message: `${synced} profil başarıyla sync edildi`,
        synced
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error('Profile sync error:', error)
    return NextResponse.json(
      { success: false, message: 'Profile sync hatası' },
      { status: 500 }
    )
  }
}