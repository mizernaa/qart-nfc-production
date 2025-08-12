"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20"
        style={{
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Brand Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            }}
            animate={{ 
              rotate: 360,
              boxShadow: [
                '0 0 20px rgba(99, 102, 241, 0.3)',
                '0 0 40px rgba(139, 92, 246, 0.5)', 
                '0 0 20px rgba(99, 102, 241, 0.3)'
              ]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Shield className="w-10 h-10 text-white relative z-10" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            QART
          </motion.h1>
          
          <motion.p 
            className="text-lg text-purple-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Dijital Kartvizit Sistemi
          </motion.p>
          
          <motion.div
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Premium Giriş</span>
          </motion.div>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ 
            y: -5,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.2)'
          }}
        >
          {/* Gradient Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              padding: '1px',
            }}
            animate={{ 
              rotate: 360,
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Content */}
          <div className="relative z-10">
            {/* Error Message */}
            {error && (
              <motion.div 
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ⚠️
                  </motion.div>
                  {error}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Email Adresiniz
                </label>
                <div className="relative">
                  <motion.input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="ornek@email.com"
                    required
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                    }}
                  />
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    animate={{ 
                      rotate: formData.email ? [0, 10, -10, 0] : 0,
                      color: formData.email ? '#a78bfa' : '#64748b'
                    }}
                  >
                    <Mail className="h-5 w-5" />
                  </motion.div>
                  
                  {/* Focus Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileFocus={{ opacity: 1 }}
                    style={{
                      background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                    }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Şifreniz
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                    }}
                  />
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    animate={{ 
                      rotate: formData.password ? [0, 10, -10, 0] : 0,
                      color: formData.password ? '#a78bfa' : '#64748b'
                    }}
                  >
                    <Lock className="h-5 w-5" />
                  </motion.div>
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{ rotate: showPassword ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="flex items-center text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm select-none">Beni hatırla</span>
                </label>
                <Link 
                  href="/sifremi-unuttum" 
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                >
                  Şifremi unuttum
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden font-semibold py-4 px-6 rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      <span>Giriş Yap</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Register Link */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-slate-400">
                Henüz hesabınız yok mu?{" "}
                <Link 
                  href="/kayit-ol" 
                  className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
                >
                  Kayıt Ol
                </Link>
              </p>
            </motion.div>

            {/* Security Features */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: Shield, text: "256-bit SSL", color: "text-green-400" },
                { icon: Zap, text: "Hızlı Giriş", color: "text-yellow-400" },
                { icon: Sparkles, text: "Premium", color: "text-purple-400" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-1 text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <feature.icon className={`w-3 h-3 ${feature.color}`} />
                  <span className="text-slate-400">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}