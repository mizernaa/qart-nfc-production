import Link from "next/link"
import { 
  CreditCard,
  Smartphone,
  QrCode,
  Globe,
  Users,
  BarChart3,
  Check,
  Star,
  Menu,
  X,
  ArrowRight,
  Shield,
  Zap,
  Clock
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">QART</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition">Özellikler</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition">Fiyatlar</a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition">İletişim</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden sm:block">
                <button className="text-gray-600 hover:text-purple-600 transition">
                  Giriş Yap
                </button>
              </Link>
              <Link href="/kayit-ol">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                  Ücretsiz Başla
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-purple-50 rounded-full px-4 py-1 mb-6">
              <Zap className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-600">Yeni Nesil Dijital Kartvizit</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Dijital Çağda<br />
              <span className="gradient-text">Profesyonel Networking</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              NFC teknolojisi ile kartınızı okutun, tüm bilgileriniz anında paylaşılsın. 
              Kağıt kartvizit devri bitti!
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kayit-ol">
                <button className="w-full sm:w-auto gradient-bg text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition">
                Demo İzle
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-green-500" />
                SSL Güvenlik
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-500" />
                10,000+ Kullanıcı
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                4.9/5 Puan
              </div>
            </div>
          </div>
          
          {/* Hero Image - Card Preview */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 lg:p-12">
              <div className="bg-white rounded-xl shadow-2xl max-w-md mx-auto p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">QART Card</h3>
                    <p className="text-gray-500">Premium Digital</p>
                  </div>
                  <QrCode className="h-12 w-12 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Smartphone className="h-8 w-8 text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">NFC Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Neden QART'ı Seçmelisiniz?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern iş dünyasının ihtiyaçlarına göre tasarlandı
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "NFC Teknolojisi",
                description: "Telefonunuza dokundurun, bilgileriniz anında aktarılsın"
              },
              {
                icon: QrCode,
                title: "QR Kod Desteği",
                description: "NFC olmayan cihazlar için QR kod ile paylaşım"
              },
              {
                icon: Globe,
                title: "Online Profil",
                description: "Dijital profilinizi istediğiniz zaman güncelleyin"
              },
              {
                icon: BarChart3,
                title: "Detaylı Analitik",
                description: "Kartınızın kaç kez görüntülendiğini takip edin"
              },
              {
                icon: Shield,
                title: "Güvenli Altyapı",
                description: "256-bit SSL şifreleme ile verileriniz güvende"
              },
              {
                icon: Clock,
                title: "Hızlı Kurulum",
                description: "5 dakikada hazır, ömür boyu kullanım"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition card-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-gray-600">
              3 basit adımda dijital kartvizitiniz hazır
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kayıt Olun</h3>
              <p className="text-gray-600">
                30 saniyede ücretsiz hesap oluşturun
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profil Oluşturun</h3>
              <p className="text-gray-600">
                Bilgilerinizi ve sosyal medya hesaplarınızı ekleyin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Paylaşmaya Başlayın</h3>
              <p className="text-gray-600">
                NFC kartınızla tek dokunuşta paylaşın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-gray-600">
              Tek seferlik ödeme, ömür boyu kullanım
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="gradient-bg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Premium Paket</h3>
                <div className="text-5xl font-bold mb-2">799₺</div>
                <p className="opacity-90">Tek seferlik ödeme</p>
              </div>
              
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {[
                    "Premium NFC kart (Kargo dahil)",
                    "Sınırsız profil güncelleme",
                    "Detaylı ziyaretçi analitiği",
                    "Özel tasarım seçenekleri",
                    "7/24 teknik destek",
                    "Ömür boyu garanti"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/kayit-ol">
                  <button className="w-full gradient-bg text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">
                    Hemen Satın Al
                  </button>
                </Link>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  30 gün para iade garantisi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Dijital Dönüşümünüzü Başlatın
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Binlerce profesyonel QART kullanıyor. Siz de aramıza katılın!
          </p>
          <Link href="/kayit-ol">
            <button className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-flex items-center">
              Ücretsiz Deneyin
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="h-8 w-8 text-purple-500" />
                <span className="ml-2 text-xl font-bold text-white">QART</span>
              </div>
              <p className="text-sm">
                Dijital kartvizit çözümleri ile networking'i kolaylaştırıyoruz.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Kariyer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition">Gizlilik</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 QART. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}