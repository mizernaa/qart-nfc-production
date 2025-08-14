import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
        { status: 500 }
      )
    }

    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Generate unique public_id
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').replace(/\.[^/.]+$/, "")
    const publicId = `qart/${type}/${timestamp}_${sanitizedName}`
    
    console.log('📤 Uploading to Cloudinary:', publicId)
    
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64, {
      public_id: publicId,
      folder: `qart/${type}`,
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit", quality: "auto" },
        { fetch_format: "auto" }
      ]
    })
    
    console.log('✅ Cloudinary upload successful:', uploadResult.secure_url)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Cloudinary",
      url: uploadResult.secure_url,
      fileName: file.name,
      type,
      size: file.size,
      cloudinaryId: uploadResult.public_id
    })

  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { success: false, message: "Upload failed: " + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}