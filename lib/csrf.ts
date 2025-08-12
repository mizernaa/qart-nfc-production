import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// CSRF Token length
const TOKEN_LENGTH = 32

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex')
}

// Validate CSRF token
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  )
}

// Get CSRF token from request
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Check header first
  const headerToken = request.headers.get('x-csrf-token')
  if (headerToken) {
    return headerToken
  }
  
  // Check form data for POST requests
  const contentType = request.headers.get('content-type')
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    // This would need to be handled in the API route after parsing form data
    return null
  }
  
  return null
}

// Get CSRF token from session/cookies
export function getCSRFTokenFromSession(request: NextRequest): string | null {
  const cookies = request.headers.get('cookie')
  if (!cookies) return null
  
  const csrfCookie = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('csrf-token='))
  
  if (!csrfCookie) return null
  
  return csrfCookie.split('=')[1]
}

// Middleware function to add CSRF protection
export function withCSRFProtection(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return handler(request, ...args)
    }
    
    // Skip CSRF for auth endpoints (they have their own protection)
    if (request.url.includes('/api/auth/')) {
      return handler(request, ...args)
    }
    
    const requestToken = getCSRFTokenFromRequest(request)
    const sessionToken = getCSRFTokenFromSession(request)
    
    if (!requestToken || !sessionToken || !validateCSRFToken(requestToken, sessionToken)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'CSRF token validation failed',
          code: 'INVALID_CSRF_TOKEN'
        },
        { status: 403 }
      )
    }
    
    return handler(request, ...args)
  }
}

// API endpoint to get CSRF token
export async function getCSRFTokenEndpoint(request: NextRequest) {
  try {
    const token = generateCSRFToken()
    
    const response = NextResponse.json({
      success: true,
      csrfToken: token
    })
    
    // Set CSRF token as HTTP-only cookie
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}

// React hook for CSRF token - to be used in client components
export const csrfHookTemplate = `
import { useState, useEffect } from 'react'

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null)
  
  useEffect(() => {
    fetchCSRFToken()
  }, [])
  
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('/api/csrf-token')
      const data = await response.json()
      
      if (data.success) {
        setCSRFToken(data.csrfToken)
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error)
    }
  }
  
  return { csrfToken, refreshToken: fetchCSRFToken }
}
`

// Helper function to add CSRF token to fetch requests
export function addCSRFToken(options: RequestInit = {}, csrfToken: string): RequestInit {
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
    },
  }
}