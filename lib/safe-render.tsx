'use client'

import { sanitizeHtml, sanitizeText, sanitizeUrl } from './validation'

// Safe text rendering - prevents XSS
export function SafeText({ 
  children, 
  className = '',
  allowHtml = false 
}: { 
  children: string | undefined | null
  className?: string 
  allowHtml?: boolean
}) {
  if (!children) return null
  
  const safeContent = allowHtml 
    ? sanitizeHtml(children) 
    : sanitizeText(children)
    
  if (allowHtml) {
    return (
      <span 
        className={className}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    )
  }
  
  return <span className={className}>{safeContent}</span>
}

// Safe link rendering
export function SafeLink({ 
  href, 
  children, 
  className = '',
  target = '_blank',
  ...props 
}: { 
  href: string | undefined | null
  children: React.ReactNode
  className?: string
  target?: string
  [key: string]: any
}) {
  if (!href) return <span className={className}>{children}</span>
  
  const safeUrl = sanitizeUrl(href)
  if (!safeUrl) return <span className={className}>{children}</span>
  
  return (
    <a 
      href={safeUrl}
      className={className}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

// Safe image rendering
export function SafeImage({ 
  src, 
  alt, 
  className = '',
  fallback = '/placeholder-image.jpg',
  ...props 
}: { 
  src: string | undefined | null
  alt: string
  className?: string
  fallback?: string
  [key: string]: any
}) {
  if (!src) {
    return (
      <img 
        src={fallback}
        alt={alt}
        className={className}
        loading="lazy"
        {...props}
      />
    )
  }
  
  const safeUrl = sanitizeUrl(src)
  if (!safeUrl) {
    return (
      <img 
        src={fallback}
        alt={alt}
        className={className}
        loading="lazy"
        {...props}
      />
    )
  }
  
  return (
    <img 
      src={safeUrl}
      alt={sanitizeText(alt)}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback
      }}
      {...props}
    />
  )
}

// Safe HTML content rendering (for rich text)
export function SafeHtmlContent({ 
  content, 
  className = '' 
}: { 
  content: string | undefined | null
  className?: string
}) {
  if (!content) return null
  
  const safeContent = sanitizeHtml(content)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  )
}

// Phone number formatter and safe link
export function SafePhoneLink({ 
  phone, 
  className = '',
  children 
}: { 
  phone: string | undefined | null
  className?: string
  children?: React.ReactNode
}) {
  if (!phone) return null
  
  const safePhone = sanitizeText(phone)
  const phoneHref = `tel:${safePhone.replace(/[^\d+]/g, '')}`
  
  return (
    <a 
      href={phoneHref}
      className={className}
    >
      {children || safePhone}
    </a>
  )
}

// Email safe link
export function SafeEmailLink({ 
  email, 
  className = '',
  children 
}: { 
  email: string | undefined | null
  className?: string
  children?: React.ReactNode
}) {
  if (!email) return null
  
  const safeEmail = sanitizeText(email)
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(safeEmail)) return null
  
  return (
    <a 
      href={`mailto:${safeEmail}`}
      className={className}
    >
      {children || safeEmail}
    </a>
  )
}