import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const { width, height } = params
    
    // Parse dimensions
    const w = parseInt(width)
    const h = parseInt(height)
    
    // Validate dimensions
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || w > 2000 || h > 2000) {
      return new NextResponse('Invalid dimensions', { status: 400 })
    }
    
    // Generate SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <text x="50%" y="50%" 
              font-family="Arial, sans-serif" 
              font-size="16" 
              fill="#9ca3af" 
              text-anchor="middle" 
              dominant-baseline="middle">
          ${w}×${h}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
    
  } catch (error) {
    console.error('Placeholder error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}