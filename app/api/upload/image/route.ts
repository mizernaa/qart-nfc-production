import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const filename = `${type}_${timestamp}_${sanitizedName}`
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save file to public/uploads directory
    const filePath = path.join(uploadsDir, filename)
    await writeFile(filePath, buffer)
    
    // Create public URL
    const publicUrl = `/uploads/${filename}`
    
    console.log(`✅ File saved locally: ${publicUrl}`)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: publicUrl,
      fileName: file.name,
      type,
      size: file.size
    })

  } catch (error) {
    console.error('Local upload error:', error)
    return NextResponse.json(
      { success: false, message: "Upload failed: " + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}