import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Initializing default themes...')

    // Define all themes to initialize
    const themesToInit = [
      {
        id: 'default',
        name: 'Default',
        primaryColor: '#3b82f6',
        secondaryColor: '#1f2937',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        font: 'Inter',
        layout: 'modern',
        isDefault: true,
        subscriptionLevel: 'Free'
      },
      // Pro Themes
      {
        id: 'pro-dark',
        name: 'Pro Dark',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        font: 'Inter',
        layout: 'modern',
        isDefault: false,
        subscriptionLevel: 'Pro'
      },
      {
        id: 'pro-gradient',
        name: 'Pro Gradient',
        primaryColor: '#ec4899',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#1e293b',
        textColor: '#e2e8f0',
        font: 'Inter',
        layout: 'modern',
        isDefault: false,
        subscriptionLevel: 'Pro'
      },
      {
        id: 'pro-elegant',
        name: 'Pro Elegant',
        primaryColor: '#059669',
        secondaryColor: '#0891b2',
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
        font: 'Inter',
        layout: 'elegant',
        isDefault: false,
        subscriptionLevel: 'Pro'
      },
      // Business Themes
      {
        id: 'business-corporate',
        name: 'Business Corporate',
        primaryColor: '#1f2937',
        secondaryColor: '#374151',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        font: 'Inter',
        layout: 'corporate',
        isDefault: false,
        subscriptionLevel: 'Business'
      },
      {
        id: 'business-premium',
        name: 'Business Premium',
        primaryColor: '#7c3aed',
        secondaryColor: '#a855f7',
        backgroundColor: '#faf5ff',
        textColor: '#581c87',
        font: 'Inter',
        layout: 'premium',
        isDefault: false,
        subscriptionLevel: 'Business'
      },
      // QART Lifetime Themes
      {
        id: 'lifetime-gold',
        name: 'QART Lifetime Gold',
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        backgroundColor: '#1c1917',
        textColor: '#fbbf24',
        font: 'Inter',
        layout: 'luxury',
        isDefault: false,
        subscriptionLevel: 'QART Lifetime'
      },
      {
        id: 'lifetime-platinum',
        name: 'QART Lifetime Platinum',
        primaryColor: '#e5e7eb',
        secondaryColor: '#9ca3af',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        font: 'Inter',
        layout: 'luxury',
        isDefault: false,
        subscriptionLevel: 'QART Lifetime'
      }
    ]

    // Create themes if they don't exist
    for (const themeData of themesToInit) {
      const existingTheme = await prisma.theme.findUnique({
        where: { id: themeData.id }
      })

      if (!existingTheme) {
        await prisma.theme.create({
          data: themeData
        })
        console.log(`✅ Created theme: ${themeData.name}`)
      }
    }

    const themes = await prisma.theme.findMany()
    console.log(`🎨 Total themes: ${themes.length}`)

    return NextResponse.json({
      success: true,
      message: 'Themes initialized successfully',
      themes: themes.map(t => ({ id: t.id, name: t.name, isDefault: t.isDefault }))
    })

  } catch (error) {
    console.error('❌ Theme initialization error:', error)
    return NextResponse.json({
      success: false,
      error: 'Theme initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}