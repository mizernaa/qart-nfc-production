import { NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'
import { vercelUserStore } from '@/lib/vercel-user-store'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting user synchronization...')
    
    // Get all users from file system
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    const usersData = fs.readFileSync(usersFilePath, 'utf-8')
    const fileUsers = JSON.parse(usersData)
    console.log(`📁 Found ${fileUsers.length} users in file system`)
    
    // Get all users from Vercel store
    const vercelUsers = await vercelUserStore.getAllUsers()
    console.log(`☁️ Found ${vercelUsers.length} users in Vercel store`)
    
    // Merge users (avoid duplicates by email)
    const allUsersMap = new Map()
    
    // Add file users first
    fileUsers.forEach((user: any) => {
      allUsersMap.set(user.email.toLowerCase(), user)
    })
    
    // Add Vercel users (skip if already exists)
    vercelUsers.forEach((user: any) => {
      const email = user.email.toLowerCase()
      if (!allUsersMap.has(email)) {
        // Convert Vercel user to file format
        const fileFormatUser = {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLoginAt: user.createdAt,
          emailVerified: true,
          profile: user.profile || {
            slug: user.name.toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c')
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-'),
            title: user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
            bio: `${user.name} - QART dijital kartvizit kullanıcısı`,
            phone: user.profile?.phone || '+90 555 000 0000',
            companyName: user.profile?.companyName || '',
            website: user.profile?.website || '',
            address: '',
            whatsapp: user.profile?.whatsapp || user.profile?.phone || '+90 555 000 0000',
            profileImage: '',
            coverImageUrl: '',
            logoUrl: '',
            isPublic: true,
            theme: 'modern'
          }
        }
        allUsersMap.set(email, fileFormatUser)
      }
    })
    
    // Convert map back to array
    const mergedUsers = Array.from(allUsersMap.values())
    console.log(`✅ Total unique users after merge: ${mergedUsers.length}`)
    
    // Save merged users back to file system
    fs.writeFileSync(usersFilePath, JSON.stringify(mergedUsers, null, 2))
    console.log('💾 Saved merged users to file system')
    
    // Also sync to Vercel store
    for (const user of mergedUsers) {
      const vercelUser = vercelUsers.find(v => v.email.toLowerCase() === user.email.toLowerCase())
      if (!vercelUser) {
        // Add missing user to Vercel store
        await vercelUserStore.createUser({
          email: user.email,
          password: user.password,
          name: user.name,
          isAdmin: user.isAdmin,
          profile: {
            slug: user.profile?.slug || user.name.toLowerCase().replace(/\s+/g, '-'),
            title: user.profile?.title,
            bio: user.profile?.bio,
            phone: user.profile?.phone,
            whatsapp: user.profile?.whatsapp,
            website: user.profile?.website,
            companyName: user.profile?.companyName
          }
        })
        console.log(`➕ Added ${user.email} to Vercel store`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'User synchronization completed',
      stats: {
        fileUsers: fileUsers.length,
        vercelUsers: vercelUsers.length,
        mergedTotal: mergedUsers.length,
        users: mergedUsers.map(u => ({
          email: u.email,
          name: u.name,
          isAdmin: u.isAdmin,
          source: fileUsers.some((f: any) => f.email === u.email) ? 'file' : 'vercel'
        }))
      }
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { success: false, message: 'Synchronization failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Force sync from Vercel to file system
  try {
    console.log('🔄 Force syncing from Vercel store to file system...')
    
    // Get all users from Vercel store
    const vercelUsers = await vercelUserStore.getAllUsers()
    console.log(`☁️ Found ${vercelUsers.length} users in Vercel store`)
    
    // Get current file users
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    const usersData = fs.readFileSync(usersFilePath, 'utf-8')
    const fileUsers = JSON.parse(usersData)
    
    // Create a map of existing file users
    const fileUsersMap = new Map()
    fileUsers.forEach((user: any) => {
      fileUsersMap.set(user.email.toLowerCase(), user)
    })
    
    // Add Vercel users that don't exist in file
    let addedCount = 0
    vercelUsers.forEach((vUser: any) => {
      const email = vUser.email.toLowerCase()
      if (!fileUsersMap.has(email)) {
        const fileFormatUser = {
          id: vUser.id,
          email: vUser.email,
          password: vUser.password,
          name: vUser.name,
          isAdmin: vUser.isAdmin,
          isActive: vUser.isActive,
          createdAt: vUser.createdAt,
          lastLoginAt: vUser.createdAt,
          emailVerified: true,
          profile: vUser.profile || {
            slug: vUser.name.toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c')
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, '-'),
            title: vUser.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
            bio: `${vUser.name} - QART dijital kartvizit kullanıcısı`,
            phone: vUser.profile?.phone || '+90 555 000 0000',
            companyName: vUser.profile?.companyName || '',
            website: vUser.profile?.website || '',
            address: '',
            whatsapp: vUser.profile?.whatsapp || vUser.profile?.phone || '+90 555 000 0000',
            profileImage: '',
            coverImageUrl: '',
            logoUrl: '',
            isPublic: true,
            theme: 'modern'
          }
        }
        fileUsers.push(fileFormatUser)
        addedCount++
        console.log(`➕ Added ${vUser.email} from Vercel to file system`)
      }
    })
    
    // Save updated users to file
    fs.writeFileSync(usersFilePath, JSON.stringify(fileUsers, null, 2))
    
    return NextResponse.json({
      success: true,
      message: `Force sync completed. Added ${addedCount} users from Vercel to file system.`,
      stats: {
        vercelUsers: vercelUsers.length,
        fileUsersBefore: fileUsers.length - addedCount,
        fileUsersAfter: fileUsers.length,
        addedCount
      }
    })
    
  } catch (error) {
    console.error('Force sync error:', error)
    return NextResponse.json(
      { success: false, message: 'Force sync failed' },
      { status: 500 }
    )
  }
}