import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CentralUserStore } from '@/lib/central-user-store'

const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 Unified registration attempt:', { email: body.email, name: body.name })

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Geçersiz bilgiler: " + validation.error.issues.map(i => i.message).join(', ')
      }, { status: 400 })
    }

    const { email, password, name } = validation.data
    
    try {
      // Register using central store
      const newUser = await CentralUserStore.registerUser(email, password, name, false)
      
      if (!newUser) {
        return NextResponse.json({
          success: false,
          message: "Kullanıcı oluşturulamadı"
        }, { status: 500 })
      }

      console.log("✅ User registered successfully:", email)

      return NextResponse.json({
        success: true,
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          slug: newUser.profile.slug
        }
      })
      
    } catch (error: any) {
      if (error.message === 'Bu email adresi zaten kullanılıyor') {
        return NextResponse.json({
          success: false,
          message: error.message
        }, { status: 409 })
      }
      
      throw error
    }

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Kayıt işlemi sırasında hata oluştu. Lütfen tekrar deneyin.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}