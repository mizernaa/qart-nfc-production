import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { profileSchema } from "@/lib/validation"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        socialLinks: true,
        customFields: true,
      }
    })

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Input validation
    const body = await request.json()
    const validation = profileSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid input data",
          errors: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Update profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...validatedData,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        slug: user.email.split('@')[0], // Default slug
        themeId: 'default',
        ...validatedData
      }
    })

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}