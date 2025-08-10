import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Vercel'de localStorage tabanlı auth sistemi kullanıyoruz
    // Bu endpoint şu an için basit bir response döndürsün
    return NextResponse.json({
      success: false,
      message: "Session-based auth - verify endpoint not needed"
    }, { status: 200 })
    
  } catch (error) {
    console.error("❌ Verify error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}