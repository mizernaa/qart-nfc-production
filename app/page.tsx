"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButtons, PricingButton, CTAButton } from "@/components/home/ClientButtons"
import AnimatedBackground from "@/components/home/AnimatedBackground"
import AnimatedFeatures from "@/components/home/AnimatedFeatures"
import FAQ from "@/components/home/FAQ"
import { 
  AnimatedCounter, 
  AnimatedText, 
  AnimatedCard, 
  FloatingElement,
  PulseElement,
  GradientText
} from "@/components/home/AnimatedComponents"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  Zap, 
  QrCode, 
  Globe, 
  BarChart3, 
  Shield, 
  Users,
  Smartphone,
  CreditCard,
  ChevronRight,
  Check,
  Star,
  Sparkles
} from "lucide-react"

export default function Home() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  // Sabit particle pozisyonları - hydration hatası önlemek için
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: ((i * 37 + 13) % 100),
    top: ((i * 53 + 29) % 100),
    duration: 5 + (i % 5),
    delay: (i % 5)
  }))

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden" style={{ background: 'var(--background-color)', color: 'var(--text-color)' }}>
      <AnimatedBackground />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 py-20 text-center"
          style={{ y: y1, opacity }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PulseElement>
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 mb-6 border border-purple-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">Yeni Nesil Dijital Kartvizit</span>
              </motion.div>
            </PulseElement>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GradientText className="text-5xl md:text-7xl font-bold">QART NFC</GradientText>
            <br />
            <AnimatedText text="Akıllı Kartvizit Kartı" className="text-white" />
          </motion.h1>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatedFeatures />
          </motion.div>

          <motion.p 
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Geleneksel kartvizitleri unutun! Premium NFC teknolojisi ile networking&apos;i yeniden keşfedin.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <HeroButtons />
          </motion.div>

          {/* 3D Card Preview */}
          <motion.div
            className="mt-16 relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <FloatingElement>
              <div className="relative mx-auto w-64 h-40 transform-gpu perspective-1000">
                <motion.div
                  className="w-full h-full bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-2xl border border-gray-600 relative transform-gpu"
                  animate={{
                    rotateY: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-4 bg-gray-700 rounded opacity-50"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-sm font-bold">NFC</span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <QrCode className="h-12 w-12 text-gray-300" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">QART</span>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </div>
            </FloatingElement>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-block mb-4"
            >
              <Star className="w-12 h-12 text-yellow-400 mx-auto" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🚀 QART NFC Kartının Gücü
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Premium NFC teknolojisi ile tanışın - Networking hiç bu kadar kolay olmamıştı!
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Smartphone,
                title: "🔥 NFC Dokunmatik Teknoloji",
                description: "Kartınızı telefona yaklaştırın, bilgileriniz anında paylaşılsın!",
                highlight: "Sihir gibi kolay."
              },
              {
                icon: QrCode,
                title: "⚡ QR Kod + NFC = Süper Güç",
                description: "Çift teknoloji, çift avantaj! NFC olmayan cihazlar için QR kod desteği.",
                highlight: "%100 uyumluluk garantisi."
              },
              {
                icon: Shield,
                title: "💎 Premium Kalite Kart",
                description: "Su geçirmez, çizilmez, dayanıklı! Cüzdanınızda yıllarca durabilir.",
                highlight: "Profesyonel imaj garantisi."
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={item}>
                <AnimatedCard delay={index * 0.1}>
                  <Card className="border border-gray-600 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                    <CardHeader>
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                        <span className="text-white font-semibold"> {feature.highlight}</span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Info Section */}
      <section className="py-20 bg-black relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🎯 QART NFC Kartı Neden Farklı?
              </h2>
              <p className="text-xl text-gray-300 mb-6 font-medium">
                Kağıt kartvizitler çöpe gidiyor, telefon numaraları kayboluyor? 
                <span className="text-white"> Bu sorunlar artık tarih!</span>
              </p>
              <p className="text-lg text-gray-400 mb-8">
                QART NFC kartı ile bir kez dokunun, kalıcı bağlantı kurun. 
                Bilgileriniz güncel kalır, istatistiklerinizi takip edin!
              </p>
              
              <motion.div 
                className="space-y-4"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {[
                  "🔄 Sınırsız Güncelleme - Bilgileriniz değişti mi? Anında güncellenir!",
                  "📱 Tüm Sosyal Medya - Instagram, LinkedIn, WhatsApp hepsi bir arada!",
                  "📊 Gerçek Zamanlı İstatistik - Kim, ne zaman, nereden baktı? Hepsini görün!",
                  "🌍 Global Erişim - Dünyanın her yerinden 7/24 ulaşılabilir!"
                ].map((text, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center py-2"
                    variants={item}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <span className="text-gray-900 font-bold text-sm">✓</span>
                    </motion.div>
                    <span className="text-gray-200 text-lg">{text.split(' - ')[0]} <strong>{text.split(' - ')[1]}</strong></span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <FloatingElement>
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 text-white border border-gray-500 shadow-2xl relative overflow-hidden">
                  <motion.div 
                    className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔥 HOT!
                  </motion.div>
                  
                  <div className="text-center">
                    <div className="relative mb-6">
                      <motion.div 
                        className="w-32 h-20 bg-gradient-to-br from-gray-800 to-black rounded-lg mx-auto shadow-xl border border-gray-600 relative"
                        whileHover={{ scale: 1.1, rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className="absolute inset-2 bg-gray-700 rounded opacity-50"></div>
                        <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-gray-900 text-xs font-bold">NFC</span>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <QrCode className="h-6 w-6 text-gray-300" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">QART</span>
                        </div>
                      </motion.div>
                      <PulseElement>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <Zap className="h-4 w-4 text-gray-900" />
                        </div>
                      </PulseElement>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-white">💳 QART Premium NFC Kart</h3>
                    <p className="text-gray-300 mb-6 text-lg">
                      <span className="text-white font-semibold">Su geçirmez • Çizilmez • Şık tasarım</span><br/>
                      Cüzdanınıza mükemmel uyum, yıllarca kullanım!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <motion.div 
                        className="bg-gray-800 rounded-lg p-3"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-white font-bold">📐 Boyut</div>
                        <div className="text-gray-300">85x54mm (Standart)</div>
                      </motion.div>
                      <motion.div 
                        className="bg-gray-800 rounded-lg p-3"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-white font-bold">🛡️ Dayanıklılık</div>
                        <div className="text-gray-300">2 Yıl Garanti</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo & Social Proof Section */}
      <section className="py-20 bg-gray-900 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🎯 Nasıl Çalışır? İzleyin!
            </h2>
            <p className="text-lg text-gray-300">
              3 basit adımda dijital networking dünyasına adım atın
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { number: "1", icon: "📱", title: "Kartı Yaklaştır", desc: "QART NFC kartınızı herhangi bir akıllı telefona yaklaştırın" },
              { number: "2", icon: "⚡", title: "Anında Bağlantı", desc: "Profiliniz otomatik olarak açılır, tüm bilgileriniz görülür" },
              { number: "3", icon: "🎉", title: "Kaydet & Takip Et", desc: "Kişiler sizi kaydeder, siz de istatistikleri görürsünüz" }
            ].map((step, index) => (
              <motion.div key={index} className="text-center" variants={item}>
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{step.icon} {step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter value="0" suffix="+" />
                </div>
                <div className="text-gray-300">Mutlu Kullanıcı</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter value="0" suffix="+" />
                </div>
                <div className="text-gray-300">Paylaşım</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter value="100" suffix="%" />
                </div>
                <div className="text-gray-300">Memnuniyet</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Destek</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-black border-t border-gray-700 relative">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <PulseElement>
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full px-4 py-2 mb-6 border border-green-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300 font-medium">Sınırlı Süre Özel Fiyat</span>
              </motion.div>
            </PulseElement>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🚀 Siz de QART Ailesine Katılın!
            </h2>
            <p className="text-xl text-gray-300 mb-4 font-medium">
              Artık kağıt kartvizit dönemi bitti! 
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              QART NFC kartınızla profesyonel imajınızı güçlendirin, 
              networking&apos;i kolaylaştırın ve dijital çağın avantajlarını yaşayın.
            </p>
            
            <motion.div 
              className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-8 mb-8 border border-gray-600"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">💳 Premium QART NFC Kartı</h3>
                  <div className="text-gray-300 space-y-1">
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Ücretsiz dijital profil</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Sınırsız paylaşım</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Detaylı analitik</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>2 yıl garanti</span>
                    </motion.div>
                  </div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Sadece 799₺
                  </motion.div>
                  <div className="text-gray-400 text-sm mb-4">Tek seferlik ödeme</div>
                  <CTAButton />
                </div>
              </div>
            </motion.div>

            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              🔒 Güvenli ödeme • 📦 Ücretsiz kargo • 🔄 30 gün para iade garantisi
            </motion.p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}