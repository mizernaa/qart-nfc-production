import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Bu endpoint frontend'te localStorage temizleme talimatı verir
    return NextResponse.json({
      success: true,
      message: "Session temizleme talimatları",
      instructions: [
        "1. Browser'da F12 ile Developer Tools aç",
        "2. Application/Storage sekmesine git", 
        "3. Local Storage'a tıkla",
        "4. localStorage.clear() konsola yaz",
        "5. Sayfayı yenile (F5)",
        "6. Logout yap ve tekrar giriş dene"
      ],
      jsCommand: "localStorage.clear(); window.location.href='/login';"
    })
    
  } catch (error) {
    console.error("❌ Clear session error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "LocalStorage session temizleme endpoint'i",
    usage: "POST request gönder",
    note: "Bu endpoint sadece temizleme talimatları verir"
  })
}