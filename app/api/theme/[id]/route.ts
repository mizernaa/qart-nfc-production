import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Theme ID required'
      }, { status: 400 })
    }

    // Get theme by ID
    const theme = await prisma.theme.findUnique({
      where: { id }
    })

    if (!theme) {
      // Return default theme if not found
      const defaultTheme = {
        id: "default",
        name: "Default",
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        font: "Inter",
        layout: "modern",
        subscriptionLevel: "Free",
        isDefault: true
      }
      
      return NextResponse.json({
        success: true,
        theme: defaultTheme
      })
    }

    return NextResponse.json({
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        font: theme.font,
        layout: theme.layout,
        subscriptionLevel: theme.subscriptionLevel,
        isDefault: theme.isDefault
      }
    })

  } catch (error) {
    console.error('❌ Theme fetch error:', error)
    
    // Return default theme on error
    const defaultTheme = {
      id: "default",
      name: "Default",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      font: "Inter",
      layout: "modern",
      subscriptionLevel: "Free",
      isDefault: true
    }
    
    return NextResponse.json({
      success: true,
      theme: defaultTheme
    })
  } finally {
    await prisma.$disconnect()
  }
}