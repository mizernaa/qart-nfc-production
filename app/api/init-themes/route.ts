import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Initializing default themes...')

    // Check if default theme exists
    const defaultTheme = await prisma.theme.findUnique({
      where: { id: 'default' }
    })

    if (!defaultTheme) {
      await prisma.theme.create({
        data: {
          id: 'default',
          name: 'Default',
          primaryColor: '#3b82f6',
          secondaryColor: '#1f2937',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          font: 'Inter',
          layout: 'modern',
          isDefault: true
        }
      })
      console.log('✅ Created default theme')
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