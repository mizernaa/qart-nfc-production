"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/unified-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Giriş başarısız")
        return
      }

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("isLoggedIn", "true")
        
        // Admin ise admin paneline, değilse main dashboard'a yönlendir
        if (data.user.isAdmin) {
          window.location.href = "/admin-panel"
        } else {
          window.location.href = "/main-dashboard"
        }
      } else {
        setError("Giriş başarısız")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:from-blue-300 hover:to-blue-500 transition-all">
            QART
          </h1>
        </Link>
        <h2 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h2>
        <p className="text-gray-400">Hesabınıza giriş yapın</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-400">
            <input
              type="checkbox"
              className="mr-2 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">Beni hatırla</span>
          </label>
          <Link href="/sifremi-unuttum" className="text-sm text-blue-400 hover:text-blue-300">
            Şifremi unuttum
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Henüz hesabınız yok mu?{" "}
          <Link href="/kayit-ol" className="text-blue-400 hover:text-blue-300 font-semibold">
            Kayıt Ol
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="mt-8 flex items-center">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="px-4 text-gray-500 text-sm">veya</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>

      {/* Quick Login Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Güvenli giriş sistemi ile verileriniz korunmaktadır
        </p>
      </div>
    </div>
  )
}