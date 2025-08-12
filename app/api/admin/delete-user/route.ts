import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email gerekli" },
        { status: 400 }
      )
    }
    
    console.log(`🗑️ Deleting user from production database: ${email}`)
    
    const prisma = new PrismaClient()
    
    try {
      // First, check if user exists
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: `Kullanıcı bulunamadı: ${email}` },
          { status: 404 }
        )
      }
      
      // Don't allow deleting admin users
      if (user.isAdmin) {
        return NextResponse.json(
          { success: false, message: "Admin kullanıcıları silinemez" },
          { status: 403 }
        )
      }
      
      // Delete user's profile first (if exists)
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      })
      
      if (profile) {
        await prisma.profile.delete({
          where: { userId: user.id }
        })
        console.log(`✅ Profile deleted for user: ${email}`)
      }
      
      // Delete user
      await prisma.user.delete({
        where: { id: user.id }
      })
      
      console.log(`✅ User deleted from production database: ${email}`)
      
      // Get remaining user count
      const remainingCount = await prisma.user.count()
      
      return NextResponse.json({
        success: true,
        message: `Kullanıcı başarıyla silindi: ${email}`,
        deletedUser: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        remainingUsers: remainingCount
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error("❌ Delete user error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Kullanıcı silme hatası",
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Production kullanıcı silme endpoint'i",
    usage: "DELETE /api/admin/delete-user?email=user@example.com",
    note: "Admin kullanıcıları silinemez"
  })
}