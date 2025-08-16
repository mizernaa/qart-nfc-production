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
            bankAccounts: {
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
      bankAccounts: user.profile.bankAccounts
    })

  } catch (error) {
    console.error('Bank accounts fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Banka hesapları alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, bankAccounts } = body

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

    // Delete existing bank accounts
    await prisma.bankAccount.deleteMany({
      where: { profileId: user.profile.id }
    })

    // Create new bank accounts
    if (bankAccounts && bankAccounts.length > 0) {
      const validAccounts = bankAccounts.filter((account: any) => 
        account.bankName && account.iban && account.accountName && account.enabled
      )

      if (validAccounts.length > 0) {
        await prisma.bankAccount.createMany({
          data: validAccounts.map((account: any, index: number) => ({
            profileId: user.profile!.id,
            bankName: account.bankName,
            iban: account.iban,
            accountName: account.accountName,
            isEnabled: account.enabled,
            order: index
          }))
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Banka hesapları güncellendi'
    })

  } catch (error) {
    console.error('Bank accounts update error:', error)
    return NextResponse.json(
      { success: false, message: 'Banka hesapları güncellenemedi' },
      { status: 500 }
    )
  }
}