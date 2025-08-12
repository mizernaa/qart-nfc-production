"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight,
  Star,
  CreditCard,
  Smartphone,
  QrCode,
  Globe,
  Users,
  BarChart3,
  Check
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">QART</span>
          </motion.div>
          
          <div className="flex gap-4">
            <Link href="/login">
              <motion.button
                className="px-6 py-2 rounded-xl border border-purple-500/30 text-white hover:bg-purple-500/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Giriş Yap
              </motion.button>
            </Link>
            <Link href="/kayit-ol">
              <motion.button
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Başla
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Next Generation NFC</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block text-white mb-2">Dijital</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Kartvizit
              </span>
              <span className="block text-white">Devrimi</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              NFC teknolojisi ile networking'i yeniden tanımlayın. 
              Tek dokunuşla tüm bilgilerinizi paylaşın.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/kayit-ol">
                <motion.button
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ücretsiz Dene
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  className="px-8 py-4 rounded-xl border border-purple-500/30 text-white font-semibold text-lg hover:bg-purple-500/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Özellikleri Keşfet
                </motion.button>
              </Link>
            </motion.div>

            {/* 3D Card Preview */}
            <motion.div
              className="relative mx-auto w-80 h-48"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ rotateY: 15, scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/30 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">PREMIUM</div>
                    <div className="text-white font-bold">NFC</div>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">QART</div>
                  <div className="flex items-center gap-4">
                    <QrCode className="w-10 h-10 text-purple-400" />
                    <div className="flex-1 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Neden QART?
            </h2>
            <p className="text-xl text-gray-400">
              Geleneksel kartvizitleri geride bırakın
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Tek Dokunuş",
                description: "NFC ile anında bilgi paylaşımı",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Globe,
                title: "Dijital Profil",
                description: "Online profilinizi yönetin",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Analitik",
                description: "Detaylı istatistikler",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Shield,
                title: "Güvenli",
                description: "256-bit şifreleme",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Networking",
                description: "Profesyonel ağınızı genişletin",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Zap,
                title: "Hızlı",
                description: "Saniyeler içinde kurulum",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${feature.gradient.replace('from-', '').replace('to-', ', ')})`
                  }}
                />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10" />
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 p-12">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Sınırlı Süre</span>
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Premium QART Kartı
                </h2>
                <p className="text-xl text-gray-400">
                  Profesyonel networking'in anahtarı
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  {[
                    "Premium NFC kart",
                    "Özel tasarım seçenekleri",
                    "Sınırsız profil güncelleme",
                    "Detaylı analitik raporlar",
                    "7/24 destek"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center md:text-right">
                  <div className="text-5xl font-bold text-white mb-2">
                    799₺
                  </div>
                  <div className="text-gray-400 mb-6">Tek seferlik ödeme</div>
                  <Link href="/kayit-ol">
                    <motion.button
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg w-full md:w-auto"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hemen Başla
                    </motion.button>
                  </Link>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                🔒 Güvenli ödeme • 📦 Ücretsiz kargo • 🔄 30 gün iade garantisi
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QART</span>
          </div>
          <p className="text-gray-400 mb-6">
            Dijital networking'in geleceği
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/login" className="text-gray-400 hover:text-purple-400 transition-colors">
              Giriş
            </Link>
            <Link href="/kayit-ol" className="text-gray-400 hover:text-purple-400 transition-colors">
              Kayıt
            </Link>
            <Link href="/main-dashboard" className="text-gray-400 hover:text-purple-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}