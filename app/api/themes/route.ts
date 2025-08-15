import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🎨 Fetching themes with subscription filtering...')
    
    // Get user email from query params (should come from session)
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    
    if (!userEmail) {
      return NextResponse.json({
        success: false,
        message: 'User email required for theme filtering'
      }, { status: 400 })
    }

    // Get user with subscription info
    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    // Determine user's subscription level
    const userSubscription = user.subscription?.plan || (user.isAdmin ? 'QART Lifetime' : 'Free')
    
    console.log(`👤 User: ${userEmail}, Subscription: ${userSubscription}`)

    // Define subscription hierarchy
    const subscriptionHierarchy: { [key: string]: string[] } = {
      'Free': ['Free'],
      'Pro': ['Free', 'Pro'],
      'Business': ['Free', 'Pro', 'Business'],
      'Enterprise': ['Free', 'Pro', 'Business', 'Enterprise'],
      'QART Lifetime': ['Free', 'Pro', 'Business', 'Enterprise', 'QART Lifetime']
    }

    // Get allowed subscription levels for user
    const allowedLevels = subscriptionHierarchy[userSubscription] || ['Free']
    
    // Fetch themes based on subscription access
    const themes = await prisma.theme.findMany({
      where: {
        subscriptionLevel: {
          in: allowedLevels
        }
      },
      orderBy: [
        { isDefault: 'desc' }, // Default first
        { subscriptionLevel: 'asc' }, // Then by subscription level
        { name: 'asc' }
      ]
    })

    console.log(`✅ Found ${themes.length} themes for ${userSubscription} user`)

    return NextResponse.json({
      success: true,
      themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        font: theme.font,
        layout: theme.layout,
        isDefault: theme.isDefault,
        subscriptionLevel: theme.subscriptionLevel,
        // Add locked status for themes above user's subscription
        isLocked: !allowedLevels.includes(theme.subscriptionLevel)
      }))
    })

  } catch (error) {
    console.error('❌ Theme fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch themes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}