import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { apiRateLimiter } from "@/lib/rate-limiter"
import { getClientIP } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { success: false, message: "Too many requests" },
        { status: 429 }
      )
    }

    // Token verification
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isActive: user.isActive
      }
    })
    
  } catch (error) {
    console.error("❌ Verify error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}