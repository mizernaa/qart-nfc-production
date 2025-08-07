import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Input sanitization
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  })
}

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim()
}

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol')
    }
    
    return parsedUrl.href
  } catch {
    return ''
  }
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Geçerli bir email adresi girin')
    .max(255, 'Email adresi çok uzun')
    .toLowerCase()
    .transform(sanitizeText),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(128, 'Şifre çok uzun')
})

export const profileSchema = z.object({
  companyName: z.string()
    .max(100, 'Şirket adı çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  title: z.string()
    .max(100, 'Başlık çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  bio: z.string()
    .max(500, 'Bio çok uzun')
    .optional()
    .transform(val => val ? sanitizeHtml(val) : val),
  phone: z.string()
    .max(20, 'Telefon numarası çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  email: z.string()
    .email('Geçerli bir email adresi girin')
    .max(255, 'Email adresi çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  website: z.string()
    .max(500, 'Website URL çok uzun')
    .optional()
    .transform(val => val ? sanitizeUrl(val) : val),
  address: z.string()
    .max(500, 'Adres çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  taxNumber: z.string()
    .max(50, 'Vergi numarası çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val),
  invoiceAddress: z.string()
    .max(500, 'Fatura adresi çok uzun')
    .optional()
    .transform(val => val ? sanitizeText(val) : val)
})

export const socialLinkSchema = z.object({
  platform: z.string()
    .min(1, 'Platform adı gerekli')
    .max(50, 'Platform adı çok uzun')
    .transform(sanitizeText),
  url: z.string()
    .url('Geçerli bir URL girin')
    .max(500, 'URL çok uzun')
    .transform(sanitizeUrl),
  isVisible: z.boolean().default(true),
  order: z.number().int().min(0).max(999).default(0)
})

export const customFieldSchema = z.object({
  name: z.string()
    .min(1, 'Alan adı gerekli')
    .max(100, 'Alan adı çok uzun')
    .transform(sanitizeText),
  value: z.string()
    .max(500, 'Değer çok uzun')
    .transform(sanitizeText),
  type: z.enum(['text', 'url', 'email', 'phone']).default('text'),
  isVisible: z.boolean().default(true),
  order: z.number().int().min(0).max(999).default(0)
})

export const cardSchema = z.object({
  nfcId: z.string()
    .min(1, 'NFC ID gerekli')
    .max(100, 'NFC ID çok uzun')
    .transform(sanitizeText),
  isActive: z.boolean().default(true)
})

// File validation
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // File size check (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { isValid: false, error: 'Dosya boyutu 5MB\'den küçük olmalı' }
  }

  // File type check
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Sadece JPEG, PNG ve WebP dosyaları kabul edilir' }
  }

  // File name check
  const fileName = file.name.toLowerCase()
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
    return { isValid: false, error: 'Geçersiz dosya uzantısı' }
  }

  // Additional security checks would go here in production:
  // - File signature (magic bytes) validation
  // - Virus scanning
  // - Content inspection

  return { isValid: true }
}

// CSRF token validation
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // Simple CSRF validation - production'da daha güçlü olmalı
  return token === sessionToken && token.length >= 16
}