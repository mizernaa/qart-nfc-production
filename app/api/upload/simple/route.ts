import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const filename = `upload-${timestamp}${ext}`
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)
    
    // Return public URL
    const url = `/uploads/${filename}`
    
    console.log(`✅ File uploaded: ${filename}`)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: url,
      fileName: filename
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    )
  }
}