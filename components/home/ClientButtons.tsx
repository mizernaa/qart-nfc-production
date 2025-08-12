"use client"

import { useRouter } from "next/navigation"
import { ChevronRight, Zap } from "lucide-react"

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => router.push("/kayit-ol")}
        className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--primary-color, #6366F1)',
          '--tw-ring-color': 'var(--primary-color, #6366F1)'
        }}
      >
        Ücretsiz Başla
        <ChevronRight className="ml-2 h-5 w-5" />
      </button>
      <button
        onClick={() => router.push("/login")}
        className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--card-background, #1E293B)',
          color: 'var(--text-color, #F1F5F9)',
          borderColor: 'var(--card-border, #334155)',
          '--tw-ring-color': 'var(--secondary-color, #8B5CF6)'
        }}
      >
        Giriş Yap
      </button>
    </div>
  )
}

export function PricingButton({ href, variant, children }: {
  href: string
  variant?: "default" | "outline"
  children: React.ReactNode
}) {
  const router = useRouter()
  
  const baseClasses = "w-full mt-6 px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105"
  
  const styles = variant === "outline" 
    ? {
        backgroundColor: 'var(--card-background, #1E293B)',
        color: 'var(--text-color, #F1F5F9)',
        borderColor: 'var(--card-border, #334155)',
        '--tw-ring-color': 'var(--secondary-color, #8B5CF6)'
      }
    : {
        backgroundColor: 'var(--primary-color, #6366F1)',
        color: 'white',
        '--tw-ring-color': 'var(--primary-color, #6366F1)'
      }

  return (
    <button
      onClick={() => router.push(href)}
      className={`${baseClasses} ${variant === "outline" ? "border" : ""}`}
      style={styles}
    >
      {children}
    </button>
  )
}

export function CTAButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/main-dashboard")}
      className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: 'var(--secondary-color, #8B5CF6)',
        color: 'white',
        '--tw-ring-color': 'var(--secondary-color, #8B5CF6)'
      }}
    >
      Ücretsiz Deneyin
      <Zap className="ml-2 h-5 w-5" />
    </button>
  )
}