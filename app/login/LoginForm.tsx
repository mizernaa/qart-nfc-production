"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

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
      const response = await fetch("/api/auth/db-login", {
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
    <motion.div 
      className="max-w-md w-full card-premium p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >

      {/* Error Message */}
      {error && (
        <motion.div 
          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
            Email
          </label>
          <div className="relative">
            <motion.input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 glass-dark rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                color: 'var(--text-color)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
              placeholder="ornek@email.com"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
            Şifre
          </label>
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full pl-10 pr-10 py-3 glass-dark rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{ 
                color: 'var(--text-color)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
              placeholder="••••••••"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              whileHover={{ scale: 1.1, color: 'var(--primary-color)' }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Remember & Forgot */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center" style={{ color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              className="mr-2 rounded focus:ring-2 transition-all"
              style={{ 
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--card-border)',
                '--tw-ring-color': 'var(--primary-color)'
              }}
            />
            <span className="text-sm">Beni hatırla</span>
          </label>
          <Link 
            href="/sifremi-unuttum" 
            className="text-sm hover:underline transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            Şifremi unuttum
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full btn-premium font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Giriş yapılıyor...
            </>
          ) : (
            <>
              Giriş Yap
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </motion.button>
      </form>

      {/* Register Link */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p style={{ color: 'var(--text-muted)' }}>
          Henüz hesabınız yok mu?{" "}
          <Link 
            href="/kayit-ol" 
            className="font-semibold hover:underline transition-colors"
            style={{ color: 'var(--primary-color)' }}
          >
            Kayıt Ol
          </Link>
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="mt-8 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex-1 border-t" style={{ borderColor: 'var(--card-border)' }}></div>
        <span className="px-4 text-sm" style={{ color: 'var(--text-muted)' }}>veya</span>
        <div className="flex-1 border-t" style={{ borderColor: 'var(--card-border)' }}></div>
      </motion.div>

      {/* Quick Login Info */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Güvenli giriş sistemi ile verileriniz korunmaktadır
        </p>
      </motion.div>
    </motion.div>
  )
}