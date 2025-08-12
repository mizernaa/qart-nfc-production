"use client"

import { useRouter } from "next/navigation"
import { ChevronRight, Zap } from "lucide-react"

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => router.push("/kayit-ol")}
        className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Ücretsiz Başla
        <ChevronRight className="ml-2 h-5 w-5" />
      </button>
      <button
        onClick={() => router.push("/login")}
        className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
  
  const baseClasses = "w-full mt-6 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
    : "bg-blue-600 text-white hover:bg-blue-700"

  return (
    <button
      onClick={() => router.push(href)}
      className={`${baseClasses} ${variantClasses}`}
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
      className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
    >
      Ücretsiz Deneyin
      <Zap className="ml-2 h-5 w-5" />
    </button>
  )
}