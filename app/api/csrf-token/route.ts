import { NextRequest } from "next/server"
import { getCSRFTokenEndpoint } from "@/lib/csrf"
import { authenticateRequest } from "@/lib/auth"
import { apiRateLimiter } from "@/lib/rate-limiter"
import { getClientIP } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return new Response(
        JSON.stringify({ success: false, message: "Too many requests" }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Authentication required for CSRF token
    const user = await authenticateRequest(request)
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return getCSRFTokenEndpoint(request)
  } catch (error) {
    console.error('CSRF token endpoint error:', error)
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}