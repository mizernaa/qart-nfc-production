"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Shield,
  Fingerprint,
  Zap
} from "lucide-react"

export default function LoginPage() {
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
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="absolute top-8 left-8 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">QART</span>
        </Link>
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Side - Welcome Text */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm">Premium Dijital Kartvizit</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                Hoş Geldiniz
              </h1>
              
              <p className="text-xl text-gray-400">
                QART ile dijital networking deneyiminizi bir üst seviyeye taşıyın.
              </p>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">256-bit Güvenlik</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">Biyometrik Destek</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20" />
              
              {/* Card */}
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Giriş Yapın
                  </h2>
                  <p className="text-gray-400">
                    Hesabınıza erişim sağlayın
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Adresiniz
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="ornek@email.com"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Şifreniz
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-12 pr-12 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-purple-600 bg-black border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm">Beni hatırla</span>
                    </label>
                    <Link 
                      href="/sifremi-unuttum" 
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Şifremi unuttum
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Giriş yapılıyor...
                        </>
                      ) : (
                        <>
                          Giriş Yap
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </span>
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-gray-500 text-sm">veya</span>
                  <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-gray-400">
                    Henüz hesabınız yok mu?{" "}
                    <Link 
                      href="/kayit-ol" 
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      Kayıt Olun
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span>🔒 256-bit SSL</span>
          <span>⚡ Hızlı Giriş</span>
          <span>✨ Premium Deneyim</span>
        </div>
      </motion.div>

      {/* CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}