import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Test environment and database connectivity
    const isVercel = process.env.VERCEL === '1'
    const nodeEnv = process.env.NODE_ENV
    const databaseUrl = process.env.DATABASE_URL ? 'Present' : 'Missing'
    
    console.log('🔍 Login Test Debug Info:', {
      isVercel,
      nodeEnv,
      databaseUrl,
      platform: process.platform
    })
    
    // Test database connection
    let dbStatus = 'Unknown'
    let dbError = null
    
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      // Try to connect and get user count
      const userCount = await prisma.user.count()
      dbStatus = `Connected - ${userCount} users`
      await prisma.$disconnect()
    } catch (error) {
      dbStatus = 'Failed'
      dbError = error.message
      console.error('❌ Database connection error:', error)
    }
    
    // Test file system access
    let fileSystemStatus = 'Unknown'
    let fileSystemError = null
    
    try {
      const fs = require('fs')
      const path = require('path')
      const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
      const usersData = fs.readFileSync(usersFilePath, 'utf-8')
      const users = JSON.parse(usersData)
      fileSystemStatus = `Available - ${users.length} users`
    } catch (error) {
      fileSystemStatus = 'Failed'
      fileSystemError = error.message
    }
    
    return NextResponse.json({
      success: true,
      environment: {
        isVercel,
        nodeEnv,
        databaseUrl,
        platform: process.platform
      },
      database: {
        status: dbStatus,
        error: dbError
      },
      fileSystem: {
        status: fileSystemStatus,
        error: fileSystemError
      },
      recommendation: dbStatus.includes('Connected') ? 'Use Prisma Database' : 'Use File System'
    })
    
  } catch (error) {
    console.error('❌ Login test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Test failed",
        error: error.message 
      },
      { status: 500 }
    )
  }
}