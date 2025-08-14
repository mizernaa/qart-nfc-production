import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcbqaoiiw',
  api_key: process.env.CLOUDINARY_API_KEY || '975913678824262',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LTsv_LDwxTIU5t5Kua_YBTEf1TY',
})

// Debug configuration
console.log('🔧 Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Using fallback',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Using fallback',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Using fallback'
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
    
    // Define transformations based on upload type
    let transformation: any[] = []
    
    switch (type) {
      case 'profile':
        // Profile photos: 150x150 square, cropped to face
        transformation = [
          { width: 150, height: 150, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
          { radius: "max" } // Make it circular
        ]
        break
        
      case 'logo':
        // Company logos: max 200x200, maintain aspect ratio, transparent background
        transformation = [
          { width: 200, height: 200, crop: "fit", background: "transparent" },
          { quality: "auto", fetch_format: "auto" }
        ]
        break
        
      case 'cover':
        // Cover images: 1200x400 banner format
        transformation = [
          { width: 1200, height: 400, crop: "fill", gravity: "center" },
          { quality: "auto", fetch_format: "auto" }
        ]
        break
        
      case 'gallery':
        // Gallery images: max 800x600, maintain aspect ratio
        transformation = [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ]
        break
        
      default:
        // General images: max 1000x1000
        transformation = [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ]
        break
    }
    
    // Upload to Cloudinary with specific transformations
    const uploadResult = await cloudinary.uploader.upload(base64, {
      public_id: publicId,
      folder: `qart/${type}`,
      resource_type: "image",
      transformation
    })
    
    console.log('✅ Cloudinary upload successful:', uploadResult.secure_url)

    // Get optimized dimensions info
    const getOptimizedInfo = (type: string) => {
      switch (type) {
        case 'profile':
          return { dimensions: '150x150', format: 'Circular profile photo', features: ['Face detection', 'Auto crop', 'Circular shape'] }
        case 'logo':
          return { dimensions: '200x200 max', format: 'Company logo', features: ['Maintain aspect ratio', 'Transparent background', 'Auto quality'] }
        case 'cover':
          return { dimensions: '1200x400', format: 'Cover banner', features: ['Center crop', 'Banner format', 'Auto quality'] }
        case 'gallery':
          return { dimensions: '800x600 max', format: 'Gallery image', features: ['Maintain aspect ratio', 'Auto quality', 'Optimized size'] }
        default:
          return { dimensions: '1000x1000 max', format: 'General image', features: ['Size limit', 'Auto quality', 'Format optimization'] }
      }
    }

    const optimizedInfo = getOptimizedInfo(type)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Cloudinary",
      url: uploadResult.secure_url,
      fileName: file.name,
      type,
      size: file.size,
      cloudinaryId: uploadResult.public_id,
      optimized: {
        dimensions: optimizedInfo.dimensions,
        format: optimizedInfo.format,
        features: optimizedInfo.features,
        originalSize: file.size,
        cloudinarySize: uploadResult.bytes
      }
    })

  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { success: false, message: "Upload failed: " + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}