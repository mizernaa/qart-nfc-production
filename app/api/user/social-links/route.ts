import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email gerekli' },
        { status: 400 }
      )
    }

    // Get user and profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            socialLinks: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      socialLinks: user.profile.socialLinks
    })

  } catch (error) {
    console.error('Social links fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Sosyal medya bağlantıları alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, socialLinks } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email gerekli' },
        { status: 400 }
      )
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Delete existing social links
    await prisma.socialLink.deleteMany({
      where: { profileId: user.profile.id }
    })

    // Create new social links
    if (socialLinks && socialLinks.length > 0) {
      const validLinks = socialLinks.filter((link: any) => 
        link.platform && link.url && link.enabled
      )

      if (validLinks.length > 0) {
        await prisma.socialLink.createMany({
          data: validLinks.map((link: any, index: number) => ({
            profileId: user.profile!.id,
            platform: link.platform,
            url: link.url,
            isVisible: link.enabled,
            order: index
          }))
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sosyal medya bağlantıları güncellendi'
    })

  } catch (error) {
    console.error('Social links update error:', error)
    return NextResponse.json(
      { success: false, message: 'Sosyal medya bağlantıları güncellenemedi' },
      { status: 500 }
    )
  }
}