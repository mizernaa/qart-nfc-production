import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

export async function DELETE(request: NextRequest) {
  try {
    console.log('🧹 Starting production database cleanup...')
    
    const prisma = new PrismaClient()
    
    try {
      // Sadece admin ve demo kullanıcılarını koru
      const keepEmails = ['admin@qart.app', 'demo@qart.app']
      
      // Önce silinecek kullanıcıları listele
      const usersToDelete = await prisma.user.findMany({
        where: {
          email: {
            notIn: keepEmails
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true
        }
      })
      
      console.log(`🗑️ Found ${usersToDelete.length} users to delete:`, usersToDelete.map(u => u.email))
      
      if (usersToDelete.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Database zaten temiz - sadece admin ve demo kullanıcıları mevcut",
          deletedUsers: [],
          remainingUsers: keepEmails
        })
      }
      
      // Her kullanıcının profile'ini sil
      for (const user of usersToDelete) {
        // Profile'i varsa sil
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id }
        })
        
        if (profile) {
          await prisma.profile.delete({
            where: { userId: user.id }
          })
          console.log(`✅ Profile deleted for: ${user.email}`)
        }
        
        // Kullanıcıyı sil
        await prisma.user.delete({
          where: { id: user.id }
        })
        console.log(`✅ User deleted: ${user.email}`)
      }
      
      // Final user count
      const finalCount = await prisma.user.count()
      const remainingUsers = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          isAdmin: true,
          isActive: true
        }
      })
      
      console.log(`✅ Production database cleanup completed!`)
      console.log(`📊 Remaining users: ${finalCount}`)
      
      return NextResponse.json({
        success: true,
        message: `Production database temizlendi! ${usersToDelete.length} kullanıcı silindi.`,
        deletedUsers: usersToDelete.map(u => ({ email: u.email, name: u.name })),
        remainingUsers: remainingUsers,
        stats: {
          deleted: usersToDelete.length,
          remaining: finalCount
        }
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    console.error("❌ Production cleanup error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Database temizleme hatası",
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient()
    
    try {
      const allUsers = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          isAdmin: true,
          isActive: true,
          createdAt: true
        }
      })
      
      const keepEmails = ['admin@qart.app', 'demo@qart.app']
      const toDelete = allUsers.filter(u => !keepEmails.includes(u.email))
      const toKeep = allUsers.filter(u => keepEmails.includes(u.email))
      
      return NextResponse.json({
        message: "Production database cleanup endpoint",
        usage: "DELETE request to cleanup database",
        currentUsers: {
          total: allUsers.length,
          toKeep: toKeep,
          toDelete: toDelete.map(u => ({ email: u.email, name: u.name }))
        }
      })
      
    } finally {
      await prisma.$disconnect()
    }
    
  } catch (error: any) {
    return NextResponse.json({
      message: "Production database cleanup endpoint",
      error: error.message
    })
  }
}