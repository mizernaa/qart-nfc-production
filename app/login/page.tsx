"use client"

import LoginForm from "./LoginForm"
import { motion } from "framer-motion"
import { Sparkles, Shield, Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full"
          style={{ background: 'var(--gradient-primary)', opacity: 0.1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full"
          style={{ background: 'var(--gradient-secondary)', opacity: 0.1 }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'var(--gradient-primary)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gradient mb-2">
            QART NFC
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-lg">
            Dijital Kartvizit Sistemi
          </p>
          
          <motion.div
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full glass-dark"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            <span className="text-sm font-medium">Hesabınıza Giriş Yapın</span>
          </motion.div>
        </motion.div>

        <LoginForm />

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Güvenli</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Hızlı</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>Modern</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}