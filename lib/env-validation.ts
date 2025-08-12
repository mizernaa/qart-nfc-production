import { z } from 'zod'

// Environment variables validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // Authentication
  NEXTAUTH_URL: z.string().url('NextAuth URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_LIFETIME_PRICE_ID: z.string().optional(),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url('Site URL must be a valid URL'),
  
  // Security
  ENABLE_DEBUG: z.string().optional().transform(val => val === 'true'),
  RATE_LIMIT_ENABLED: z.string().optional().transform(val => val !== 'false'),
  SECURITY_HEADERS_ENABLED: z.string().optional().transform(val => val !== 'false'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    
    // Production-specific validation
    if (env.NODE_ENV === 'production') {
      // Check for production-ready secrets
      if (env.NEXTAUTH_SECRET?.includes('development') || 
          env.NEXTAUTH_SECRET?.includes('test') ||
          env.NEXTAUTH_SECRET?.length < 64) {
        throw new Error('Production NEXTAUTH_SECRET must be strong and unique')
      }
      
      // Check for test keys in production
      if (env.STRIPE_SECRET_KEY?.includes('test')) {
        console.warn('⚠️ WARNING: Using test Stripe keys in production!')
      }
      
      // Ensure HTTPS in production
      if (!env.NEXTAUTH_URL.startsWith('https://')) {
        throw new Error('NEXTAUTH_URL must use HTTPS in production')
      }
      
      if (!env.NEXT_PUBLIC_SITE_URL.startsWith('https://')) {
        throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS in production')
      }
    }
    
    return env
  } catch (error) {
    console.error('❌ Environment validation failed:')
    if (error instanceof z.ZodError) {
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
      })
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

// Export validated environment variables
export const env = validateEnv()

// Security check utilities
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

export function isDebugEnabled(): boolean {
  return env.ENABLE_DEBUG === true
}

export function isRateLimitEnabled(): boolean {
  return env.RATE_LIMIT_ENABLED === true
}

export function areSecurityHeadersEnabled(): boolean {
  return env.SECURITY_HEADERS_ENABLED === true
}

// Sensitive data masking for logs
export function maskSensitiveData(data: any): any {
  if (typeof data === 'string') {
    // Mask email addresses
    data = data.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***')
    
    // Mask API keys
    if (data.includes('sk_') || data.includes('pk_') || data.includes('re_')) {
      return data.substring(0, 8) + '***'
    }
    
    // Mask secrets
    if (data.length > 32 && (data.includes('secret') || data.includes('key'))) {
      return data.substring(0, 8) + '***'
    }
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked = { ...data }
    Object.keys(masked).forEach(key => {
      if (key.toLowerCase().includes('password') || 
          key.toLowerCase().includes('secret') || 
          key.toLowerCase().includes('key')) {
        masked[key] = '***'
      }
    })
    return masked
  }
  
  return data
}

// Log environment status (safe)
console.log('🔧 Environment Status:')
console.log(`  - Node Environment: ${env.NODE_ENV}`)
console.log(`  - Debug Mode: ${isDebugEnabled()}`)
console.log(`  - Rate Limiting: ${isRateLimitEnabled()}`)
console.log(`  - Security Headers: ${areSecurityHeadersEnabled()}`)
console.log(`  - Database: ${env.DATABASE_URL.includes('file:') ? 'SQLite' : 'External'}`)
console.log(`  - Site URL: ${env.NEXT_PUBLIC_SITE_URL}`)

if (isProduction()) {
  console.log('✅ Running in production mode with security measures enabled')
} else {
  console.log('⚠️ Running in development mode - ensure security for production!')
}