"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  return (
    <div className="min-h-screen" style={{
      background: 'var(--background-color, #0F172A)',
      color: 'var(--text-color, #F1F5F9)'
    }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b" style={{
        backgroundColor: 'var(--card-background, #1E293B)',
        borderColor: 'var(--card-border, #334155)'
      }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={{color: 'var(--primary-color, #6366F1)'}}>
            QART NFC
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Giriş Yap</Button>
            </Link>
            <Link href="/kayit-ol">
              <Button style={{backgroundColor: 'var(--primary-color, #6366F1)'}}>
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border" style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderColor: 'var(--primary-color, #6366F1)'
            }}>
              <Sparkles className="w-4 h-4" style={{color: 'var(--primary-color, #6366F1)'}} />
              <span className="text-sm font-medium" style={{color: 'var(--primary-color, #6366F1)'}}>
                Yeni Nesil Dijital Kartvizit
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span style={{
                background: `linear-gradient(135deg, var(--primary-color, #6366F1) 0%, var(--secondary-color, #8B5CF6) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                QART NFC
              </span>
              <br />
              <span style={{color: 'var(--text-color, #F1F5F9)'}}>
                Akıllı Kartvizit Kartı
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Geleneksel kartvizitleri unutun! Premium NFC teknolojisi ile networking'i yeniden keşfedin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/kayit-ol">
                <Button size="lg" className="text-lg px-8 py-3" style={{
                  backgroundColor: 'var(--primary-color, #6366F1)',
                  color: 'white'
                }}>
                  Ücretsiz Başla
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Giriş Yap
                </Button>
              </Link>
            </div>

            {/* 3D Card Preview */}
            <div className="relative mx-auto w-64 h-40">
              <div className="w-full h-full rounded-xl shadow-2xl border relative" style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                borderColor: 'var(--card-border, #334155)'
              }}>
                <div className="absolute inset-4 rounded opacity-50" style={{backgroundColor: 'var(--card-background, #1E293B)'}}></div>
                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-gray-900 text-sm font-bold">NFC</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <QrCode className="h-12 w-12 text-gray-300" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">QART</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{backgroundColor: 'var(--card-background, #1E293B)'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: 'var(--text-color, #F1F5F9)'}}>
              🚀 QART NFC Kartının Gücü
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Premium NFC teknolojisi ile tanışın - Networking hiç bu kadar kolay olmamıştı!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <Card key={index} className="border shadow-xl h-full" style={{
                backgroundColor: 'var(--background-color, #0F172A)',
                borderColor: 'var(--card-border, #334155)'
              }}>
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{
                    background: `linear-gradient(135deg, var(--primary-color, #6366F1) 0%, var(--secondary-color, #8B5CF6) 100%)`
                  }}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl" style={{color: 'var(--text-color, #F1F5F9)'}}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                    <span className="text-white font-semibold"> {feature.highlight}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{backgroundColor: 'var(--background-color, #0F172A)'}}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border" style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderColor: '#22c55e'
            }}>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">Sınırlı Süre Özel Fiyat</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--text-color, #F1F5F9)'}}>
              🚀 Siz de QART Ailesine Katılın!
            </h2>
            <p className="text-xl text-gray-300 mb-4 font-medium">
              Artık kağıt kartvizit dönemi bitti! 
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              QART NFC kartınızla profesyonel imajınızı güçlendirin, 
              networking'i kolaylaştırın ve dijital çağın avantajlarını yaşayın.
            </p>
            
            <div className="rounded-2xl p-8 mb-8 border" style={{
              background: `linear-gradient(135deg, var(--card-background, #1E293B) 0%, var(--background-color, #0F172A) 100%)`,
              borderColor: 'var(--card-border, #334155)'
            }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-color, #F1F5F9)'}}>
                    💳 Premium QART NFC Kartı
                  </h3>
                  <div className="text-gray-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Ücretsiz dijital profil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Sınırsız paylaşım</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Detaylı analitik</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>2 yıl garanti</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--text-color, #F1F5F9)'}}>
                    Sadece 799₺
                  </div>
                  <div className="text-gray-400 text-sm mb-4">Tek seferlik ödeme</div>
                  <Link href="/main-dashboard">
                    <Button size="lg" style={{
                      backgroundColor: 'var(--secondary-color, #8B5CF6)',
                      color: 'white'
                    }}>
                      Ücretsiz Deneyin
                      <Zap className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              🔒 Güvenli ödeme • 📦 Ücretsiz kargo • 🔄 30 gün para iade garantisi
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{
        backgroundColor: 'var(--card-background, #1E293B)',
        borderColor: 'var(--card-border, #334155)'
      }}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4" style={{color: 'var(--primary-color, #6366F1)'}}>
            QART NFC
          </div>
          <p className="text-gray-400 mb-4">
            Dijital networking'in geleceği
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/login" className="text-gray-400 hover:text-white">
              Giriş Yap
            </Link>
            <Link href="/kayit-ol" className="text-gray-400 hover:text-white">
              Kayıt Ol
            </Link>
            <Link href="/main-dashboard" className="text-gray-400 hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}