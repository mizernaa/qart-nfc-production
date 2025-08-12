"use client"

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
  Check,
  ChevronRight
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">QART</span>
          </div>
          
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 rounded-xl border border-purple-500/50 text-white hover:bg-purple-500/10 transition-all">
                Giriş Yap
              </button>
            </Link>
            <Link href="/kayit-ol">
              <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Başla
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 mb-8">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Next Generation NFC</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-white mb-2">Dijital</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Kartvizit
              </span>
              <span className="block text-white">Devrimi</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              NFC teknolojisi ile networking'i yeniden tanımlayın. 
              Tek dokunuşla tüm bilgilerinizi paylaşın.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/kayit-ol">
                <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-500/25 transition-all">
                  Ücretsiz Dene
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#features">
                <button className="px-8 py-4 rounded-xl border border-purple-500/50 text-white font-semibold text-lg hover:bg-purple-500/10 transition-all">
                  Özellikleri Keşfet
                </button>
              </Link>
            </div>

            {/* 3D Card Preview */}
            <div className="relative mx-auto w-80 h-48">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-30" />
              <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-purple-500/50 p-6 flex flex-col justify-between shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase">Premium</div>
                    <div className="text-white font-bold">NFC</div>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">QART</div>
                  <div className="flex items-center gap-4">
                    <QrCode className="w-10 h-10 text-purple-400" />
                    <div className="flex-1 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Neden QART?
            </h2>
            <p className="text-xl text-gray-400">
              Geleneksel kartvizitleri geride bırakın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Tek Dokunuş",
                description: "NFC ile anında bilgi paylaşımı",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Globe,
                title: "Dijital Profil",
                description: "Online profilinizi yönetin",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Analitik",
                description: "Detaylı istatistikler",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Shield,
                title: "Güvenli",
                description: "256-bit şifreleme",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Networking",
                description: "Profesyonel ağınızı genişletin",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Zap,
                title: "Hızlı",
                description: "Saniyeler içinde kurulum",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${feature.color.split(' ').join(', ').replace(/from-|to-/g, '')})`
                    }}
                  />
                  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10" />
            <div className="relative bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50 mb-6">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Sınırlı Süre</span>
                </div>
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
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center md:text-right">
                  <div className="text-5xl font-bold text-white mb-2">
                    799₺
                  </div>
                  <div className="text-gray-400 mb-6">Tek seferlik ödeme</div>
                  <Link href="/kayit-ol">
                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg w-full md:w-auto hover:shadow-xl hover:shadow-purple-500/25 transition-all">
                      Hemen Başla
                    </button>
                  </Link>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                🔒 Güvenli ödeme • 📦 Ücretsiz kargo • 🔄 30 gün iade garantisi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
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