import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { vercelUserStore } from '@/lib/vercel-user-store'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting comprehensive user debug...')
    
    const results: any = {
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      timestamp: new Date().toISOString(),
      storages: {}
    }
    
    // 1. Check Prisma Database
    try {
      const prisma = new PrismaClient()
      
      try {
        const prismaUsers = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            isActive: true,
            createdAt: true
          }
        })
        
        results.storages.prisma = {
          status: 'connected',
          userCount: prismaUsers.length,
          users: prismaUsers
        }
        console.log(`💾 Prisma Database: ${prismaUsers.length} users`)
        
      } finally {
        await prisma.$disconnect()
      }
      
    } catch (error) {
      results.storages.prisma = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        userCount: 0,
        users: []
      }
      console.log('❌ Prisma Database: Connection failed')
    }
    
    // 2. Check Vercel In-Memory Store
    try {
      const vercelUsers = await vercelUserStore.getAllUsers()
      const diagnosticInfo = vercelUserStore.getDiagnosticInfo()
      
      results.storages.vercel = {
        status: 'active',
        userCount: vercelUsers.length,
        users: vercelUsers.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          isAdmin: u.isAdmin,
          isActive: u.isActive,
          createdAt: u.createdAt
        })),
        diagnostics: diagnosticInfo
      }
      console.log(`☁️ Vercel Store: ${vercelUsers.length} users`)
      
    } catch (error) {
      results.storages.vercel = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        userCount: 0,
        users: []
      }
      console.log('❌ Vercel Store: Error')
    }
    
    // 3. Check File System (if available)
    try {
      const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
      
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8')
        const fileUsers = JSON.parse(usersData)
        
        results.storages.fileSystem = {
          status: 'available',
          userCount: fileUsers.length,
          users: fileUsers.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            isAdmin: u.isAdmin,
            isActive: u.isActive,
            createdAt: u.createdAt
          }))
        }
        console.log(`📁 File System: ${fileUsers.length} users`)
      } else {
        results.storages.fileSystem = {
          status: 'not_available',
          reason: 'users.json file not found',
          userCount: 0,
          users: []
        }
        console.log('📁 File System: Not available')
      }
      
    } catch (error) {
      results.storages.fileSystem = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        userCount: 0,
        users: []
      }
      console.log('❌ File System: Error')
    }
    
    // 4. Collect all unique emails
    const allEmails = new Set()
    const emailSources: any = {}
    
    Object.entries(results.storages).forEach(([storage, data]: [string, any]) => {
      if (data.users && Array.isArray(data.users)) {
        data.users.forEach((user: any) => {
          if (user.email) {
            allEmails.add(user.email)
            if (!emailSources[user.email]) {
              emailSources[user.email] = []
            }
            emailSources[user.email].push(storage)
          }
        })
      }
    })
    
    results.summary = {
      totalUniqueEmails: allEmails.size,
      totalUsersAcrossStorages: Object.values(results.storages).reduce((sum: number, storage: any) => sum + (storage.userCount || 0), 0),
      emailSources,
      duplicateEmails: Object.entries(emailSources).filter(([email, sources]) => (sources as string[]).length > 1),
      storageStatus: Object.entries(results.storages).map(([name, data]: [string, any]) => ({
        name,
        status: data.status,
        userCount: data.userCount || 0
      }))
    }
    
    // 5. Recommendations
    const recommendations = []
    
    if (results.storages.prisma?.status === 'connected' && results.storages.prisma.userCount === 0) {
      recommendations.push('Prisma database is empty. Run seed-production to add users.')
    }
    
    if (results.storages.vercel?.userCount > 0 && results.storages.prisma?.userCount === 0) {
      recommendations.push('Vercel store has users but Prisma is empty. Consider syncing to database.')
    }
    
    if (results.summary.duplicateEmails.length > 0) {
      recommendations.push(`Found duplicate emails across storages: ${results.summary.duplicateEmails.map(([email]) => email).join(', ')}`)
    }
    
    results.recommendations = recommendations
    
    console.log('🎯 Debug completed')
    
    return NextResponse.json(results, { status: 200 })
    
  } catch (error) {
    console.error('❌ Debug error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Debug failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🧹 Starting comprehensive user cleanup...')
    
    const results: any = {
      timestamp: new Date().toISOString(),
      cleanupResults: {}
    }
    
    // 1. Clear Prisma Database (except admin)
    try {
      const prisma = new PrismaClient()
      
      try {
        // Delete all non-admin users
        const deletedUsers = await prisma.user.deleteMany({
          where: {
            isAdmin: false
          }
        })
        
        results.cleanupResults.prisma = {
          status: 'cleaned',
          deletedCount: deletedUsers.count,
          message: 'All non-admin users deleted from Prisma'
        }
        console.log(`💾 Prisma: Deleted ${deletedUsers.count} non-admin users`)
        
      } finally {
        await prisma.$disconnect()
      }
      
    } catch (error) {
      results.cleanupResults.prisma = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      console.log('❌ Prisma cleanup failed')
    }
    
    // 2. Reset File System to default users only
    try {
      const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
      
      const defaultUsers = [
        {
          "id": "admin-001",
          "email": "admin@qart.app",
          "password": "$2b$12$sG81TSiNrDMsafDKzTgI6e3ADFSdPOnm1lPJ8dbZPcD5QsrdugSHK",
          "name": "Admin User",
          "isAdmin": true,
          "isActive": true,
          "createdAt": new Date().toISOString(),
          "lastLoginAt": new Date().toISOString(),
          "emailVerified": true,
          "profile": {
            "slug": "admin-user",
            "title": "Sistem Yöneticisi",
            "bio": "QART Sistem Yöneticisi - Tüm sistem yetkileri",
            "phone": "+90 555 000 0001",
            "companyName": "QART Team",
            "website": "https://qart.app",
            "address": "İstanbul, Türkiye",
            "whatsapp": "+90 555 000 0001",
            "profileImage": "",
            "coverImageUrl": "",
            "logoUrl": "",
            "isPublic": true,
            "theme": "modern"
          }
        },
        {
          "id": "demo-001", 
          "email": "demo@qart.app",
          "password": "$2b$12$zkCJrkabVur5cmn8.dBJw.I8zO2CTiHS5kO8SSaTPcS/SpspuBcCG",
          "name": "Demo User",
          "isAdmin": false,
          "isActive": true,
          "createdAt": new Date().toISOString(),
          "lastLoginAt": new Date().toISOString(),
          "emailVerified": true,
          "profile": {
            "slug": "demo-user",
            "title": "Demo Kullanıcısı",
            "bio": "QART Demo Kullanıcısı - Örnek profil",
            "phone": "+90 555 000 0002",
            "companyName": "Demo Şirketi",
            "website": "https://demo.qart.app",
            "address": "Ankara, Türkiye",
            "whatsapp": "+90 555 000 0002",
            "profileImage": "",
            "coverImageUrl": "",
            "logoUrl": "",
            "isPublic": true,
            "theme": "modern"
          }
        }
      ]
      
      fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2))
      
      results.cleanupResults.fileSystem = {
        status: 'reset',
        userCount: defaultUsers.length,
        message: 'File system reset to default users (admin + demo)'
      }
      console.log('📁 File System: Reset to default users')
      
    } catch (error) {
      results.cleanupResults.fileSystem = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      console.log('❌ File system cleanup failed')
    }
    
    results.summary = {
      message: 'Cleanup completed. All non-admin users removed from all storages.',
      remainingUsers: ['admin@qart.app', 'demo@qart.app'],
      nextStep: 'Run seed-production to add clean users to database'
    }
    
    return NextResponse.json(results, { status: 200 })
    
  } catch (error) {
    console.error('❌ Cleanup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Cleanup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}