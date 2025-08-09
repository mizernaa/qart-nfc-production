import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireAdmin } from './lib/auth'

// Korumalı rotalar
const protectedRoutes = [
  '/main-dashboard',
  '/profile-management',
  '/billing'
]

// Admin rotaları
const adminRoutes = [
  '/admin-panel',
  '/kullanici-yonetimi',
  '/sistem-ayarlari',
  '/detayli-analiz',
  '/kullanici-detay'
]

// API rotaları - authentication gerekli
const protectedApiRoutes = [
  '/api/profile',
  '/api/user',
  '/api/analytics'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Security headers - tüm response'lar için
  const response = NextResponse.next()
  
  // Security headers ekle
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }

  // CSP Header
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Framer Motion için gerekli
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  )

  // Auth routes - login sayfasına yönlendirme yapma
  if (pathname.startsWith('/api/auth/')) {
    return response
  }

  // Stats ve Profile API routes - dashboard internal kullanımı için public
  if (pathname === '/api/stats' || pathname.startsWith('/api/user/stats') || pathname.startsWith('/api/user/profile') || pathname.startsWith('/api/profile/') || pathname.startsWith('/api/upload/') || pathname === '/api/database-debug' || pathname === '/api/init-users' || pathname === '/api/reset-users' || pathname === '/api/fix-passwords' || pathname === '/api/simple-password-fix' || pathname === '/api/raw-password-fix') {
    return response
  }

  // Static files ve public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/kayit-ol' ||
    pathname === '/api/users/register' ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return response
  }

  // Public profile pages ([slug])
  if (pathname.match(/^\/[a-zA-Z0-9-_]+$/)) {
    return response
  }

  // Protected API routes kontrolü
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Admin API routes için admin kontrolü
    if (pathname.startsWith('/api/admin/') && !requireAdmin(user)) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    return response
  }

  // Protected page routes kontrolü
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return response
  }

  // Admin routes kontrolü
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    if (!requireAdmin(user)) {
      return NextResponse.redirect(new URL('/main-dashboard', request.url))
    }
    
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}