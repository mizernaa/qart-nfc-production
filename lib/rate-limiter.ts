// Simple in-memory rate limiter for development
// Production'da Redis veya external service kullanın

interface RateLimit {
  count: number
  resetTime: number
}

class SimpleRateLimiter {
  private requests: Map<string, RateLimit> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const request = this.requests.get(key)

    if (!request) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (now > request.resetTime) {
      // Window expired, reset
      request.count = 1
      request.resetTime = now + this.windowMs
      return true
    }

    if (request.count >= this.maxRequests) {
      return false
    }

    request.count++
    return true
  }

  getRemainingRequests(key: string): number {
    const request = this.requests.get(key)
    if (!request || Date.now() > request.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - request.count)
  }

  getResetTime(key: string): number {
    const request = this.requests.get(key)
    if (!request || Date.now() > request.resetTime) {
      return Date.now()
    }
    return request.resetTime
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, request] of this.requests.entries()) {
      if (now > request.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Rate limiter instances
export const authRateLimiter = new SimpleRateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
export const apiRateLimiter = new SimpleRateLimiter(30, 60 * 1000) // 30 requests per minute
export const fileUploadRateLimiter = new SimpleRateLimiter(3, 60 * 1000) // 3 uploads per minute

// Cleanup expired entries every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup()
  apiRateLimiter.cleanup()
  fileUploadRateLimiter.cleanup()
}, 5 * 60 * 1000)

export { SimpleRateLimiter }