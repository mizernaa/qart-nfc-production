"use client"

import { useEffect, useState, useRef } from "react"
import QRCode from "qrcode"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import autoTable from "jspdf-autotable"
import { 
  User,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  TrendingUp,
  Database,
  FileText,
  DollarSign,
  Eye,
  MousePointer,
  Clock,
  Copy,
  ExternalLink,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Building,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  Calendar,
  Link2,
  Share2,
  Download,
  RefreshCw,
  PieChart,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  Award,
  Star,
  MessageSquare,
  CheckCircle,
  QrCode,
  Check,
  Camera
} from "lucide-react"

export default function MainDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [expandedProfile, setExpandedProfile] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  // Profil Data - API'den çekilir
  const [profile, setProfile] = useState<any>({
    name: "",
    email: "",
    slug: "",
    isPremium: false,
    subscriptionPlan: "Free"
  })

  // Detaylı Analytics Verileri - API'den çekilir
  const [analytics, setAnalytics] = useState({
    // Özet İstatistikler
    overview: {
      totalViews: 0,
      viewsToday: 0,
      viewsThisWeek: 0,
      viewsThisMonth: 0,
      uniqueVisitors: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      conversionRate: 0,
      profileShares: 0,
      contactClicks: 0,
      growth: {
        views: 0,
        visitors: 0,
        clicks: 0,
        duration: 0
      }
    },

    // Son 7 günlük trend
    viewsTrend: [
      { date: "Pzt", views: 0, visitors: 0 },
      { date: "Sal", views: 0, visitors: 0 },
      { date: "Çrş", views: 0, visitors: 0 },
      { date: "Prş", views: 0, visitors: 0 },
      { date: "Cum", views: 0, visitors: 0 },
      { date: "Cmt", views: 0, visitors: 0 },
      { date: "Paz", views: 0, visitors: 0 }
    ],

    // Cihaz dağılımı
    deviceStats: [
      { device: "Mobil", views: 0, percentage: 0, icon: Smartphone, color: "bg-blue-500" },
      { device: "Masaüstü", views: 0, percentage: 0, icon: Monitor, color: "bg-gray-500" },
      { device: "Tablet", views: 0, percentage: 0, icon: Tablet, color: "bg-purple-500" }
    ],

    // Ülke dağılımı
    countryStats: [
      { country: "Türkiye", views: 0, percentage: 0, flag: "🇹🇷" },
      { country: "Almanya", views: 0, percentage: 0, flag: "🇩🇪" },
      { country: "ABD", views: 0, percentage: 0, flag: "🇺🇸" },
      { country: "İngiltere", views: 0, percentage: 0, flag: "🇬🇧" },
      { country: "Fransa", views: 0, percentage: 0, flag: "🇫🇷" }
    ],

    // Sosyal medya tıklamaları
    socialClicks: [
      { platform: "LinkedIn", clicks: 0, percentage: 0, icon: Linkedin, color: "text-blue-600" },
      { platform: "Instagram", clicks: 0, percentage: 0, icon: Instagram, color: "text-pink-600" },
      { platform: "WhatsApp", clicks: 0, percentage: 0, icon: Phone, color: "text-green-600" },
      { platform: "GitHub", clicks: 0, percentage: 0, icon: Github, color: "text-gray-800" },
      { platform: "Twitter", clicks: 0, percentage: 0, icon: Twitter, color: "text-sky-500" }
    ],

    // Trafik kaynakları
    referrerStats: [
      { source: "Direkt Erişim", views: 0, percentage: 0 },
      { source: "QR Kod", views: 0, percentage: 0 },
      { source: "LinkedIn", views: 0, percentage: 0 },
      { source: "Instagram", views: 0, percentage: 0 },
      { source: "Google", views: 0, percentage: 0 }
    ]
  })

  // Kullanıcı profilini API'den çek
  const fetchUserProfile = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProfile(data.profile)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Kullanıcı analitiklerini API'den çek
  const fetchUserAnalytics = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/user/stats?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAnalytics(data.analytics)
        }
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const tempUser = localStorage.getItem("tempUser")
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        
        // Eğer tempUser varsa, admin müşteri görünümündedir
        if (tempUser) {
          const originalUser = JSON.parse(tempUser)
          // Geçici kullanıcı verisini kullan ama admin olduğunu hatırla
          setUser({ ...userData, wasAdmin: true, originalUser })
        } else if (userData.isAdmin) {
          // Normal admin girişi, admin paneline yönlendir
          window.location.href = "/admin-panel"
          return
        } else {
          // Normal kullanıcı
          setUser(userData)
          fetchUserProfile(userData.email) // Kullanıcı profilini çek
          fetchUserAnalytics(userData.email) // Kullanıcı analitiklerini çek
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    } else {
      // Giriş yapmamışsa login sayfasına yönlendir
      window.location.href = "/login"
      return
    }
    
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    window.location.href = "/login"
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    setEditMode(false)
    alert("Profil başarıyla güncellendi!")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    if (user?.email) {
      await fetchUserProfile(user.email) // Profili yenile
      await fetchUserAnalytics(user.email) // Analitikleri yenile
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  // QR Kod oluşturma
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `https://qart.app/${user?.isAdmin ? 'admin-profile' : profile.slug}`
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        setQrCodeUrl(qrDataUrl)
      } catch (err) {
        console.error('QR kod oluşturulamadı:', err)
      }
    }
    
    if (user && profile.slug) {
      generateQR()
    }
  }, [user, profile.slug])

  // Link kopyalama
  const copyToClipboard = async () => {
    try {
      const url = `https://qart.app/${user?.isAdmin ? 'admin-profile' : profile.slug}`
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Kopyalama başarısız:', err)
    }
  }

  // QR Kod indirme fonksiyonu
  const downloadQRCode = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.download = `qart-qr-${profile.slug}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Gelişmiş rapor indirme
  const downloadDetailedReport = async () => {
    const pdf = new jsPDF()
    
    // Font ayarları - Türkçe karakter desteği için
    pdf.setFont('helvetica', 'normal')
    
    // Başlık ve logo alanı
    pdf.setFillColor(59, 130, 246) // Blue-600
    pdf.rect(0, 0, 210, 30, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.text('QART Profil Analitik Raporu', 20, 20)
    
    // Profil bilgileri bölümü
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(16)
    pdf.text('Profil Bilgileri', 20, 45)
    pdf.setFontSize(12)
    pdf.text('Isim: ' + profile.name, 20, 55)
    pdf.text('Sirket: ' + profile.companyName, 20, 65)
    pdf.text('E-posta: ' + (user?.email || 'Belirtilmemis'), 20, 75)
    pdf.text('URL: https://qart.app/' + (user?.isAdmin ? 'admin-profile' : profile.slug), 20, 85)
    pdf.text('Premium Uyelik: ' + (profile.isPremium ? 'Aktif' : 'Pasif') + ' (' + profile.subscriptionPlan + ')', 20, 95)
    
    // İstatistikler başlığı
    pdf.setFontSize(16)
    pdf.text('Detayli Etkilesim Istatistikleri', 20, 115)
    
    // Ana metrikler
    pdf.setFontSize(12)
    let yPos = 125
    pdf.text('Toplam Goruntulenme: ' + analytics.overview.totalViews.toLocaleString(), 20, yPos)
    yPos += 10
    pdf.text('Benzersiz Ziyaretci: ' + analytics.overview.uniqueVisitors.toLocaleString(), 20, yPos)
    yPos += 10
    pdf.text('Ortalama Oturum Suresi: ' + formatDuration(analytics.overview.averageSessionDuration), 20, yPos)
    yPos += 10
    pdf.text('Iletisim Tiklamasi: ' + analytics.overview.contactClicks, 20, yPos)
    yPos += 10
    pdf.text('Profil Paylasimi: ' + analytics.overview.profileShares, 20, yPos)
    yPos += 10
    pdf.text('Donusum Orani: %' + analytics.overview.conversionRate, 20, yPos)
    yPos += 10
    pdf.text('Bounce Rate: %' + analytics.overview.bounceRate, 20, yPos)
    
    // Büyüme oranları
    yPos += 15
    pdf.setFontSize(14)
    pdf.text('Buyume Oranlari:', 20, yPos)
    pdf.setFontSize(12)
    yPos += 10
    pdf.text('Goruntulenme Artisi: %' + analytics.overview.growth.views, 25, yPos)
    yPos += 8
    pdf.text('Ziyaretci Artisi: %' + analytics.overview.growth.visitors, 25, yPos)
    yPos += 8
    pdf.text('Tiklama Artisi: %' + analytics.overview.growth.clicks, 25, yPos)
    
    // Cihaz dağılımı
    yPos += 15
    pdf.setFontSize(14)
    pdf.text('Cihaz Dagilimi:', 20, yPos)
    pdf.setFontSize(12)
    analytics.deviceStats.forEach((device) => {
      yPos += 10
      const deviceName = device.device === 'Masaüstü' ? 'Masaustu' : device.device
      pdf.text(deviceName + ': ' + device.views.toLocaleString() + ' (%' + device.percentage + ')', 25, yPos)
    })
    
    // Yeni sayfa
    pdf.addPage()
    
    // Ülke dağılımı
    yPos = 30
    pdf.setFontSize(14)
    pdf.text('Ulke Dagilimi:', 20, yPos)
    pdf.setFontSize(12)
    analytics.countryStats.forEach((country) => {
      yPos += 10
      const countryName = country.country === 'Türkiye' ? 'Turkiye' : 
                          country.country === 'İngiltere' ? 'Ingiltere' : country.country
      pdf.text(countryName + ': ' + country.views.toLocaleString() + ' (%' + country.percentage + ')', 25, yPos)
    })
    
    // Sosyal medya tıklamaları
    yPos += 15
    pdf.setFontSize(14)
    pdf.text('Sosyal Medya Tiklamalari:', 20, yPos)
    pdf.setFontSize(12)
    analytics.socialClicks.forEach((social) => {
      yPos += 10
      pdf.text(social.platform + ': ' + social.clicks + ' (%' + social.percentage + ')', 25, yPos)
    })
    
    // Trafik kaynakları
    yPos += 15
    pdf.setFontSize(14)
    pdf.text('Trafik Kaynaklari:', 20, yPos)
    pdf.setFontSize(12)
    analytics.referrerStats.forEach((referrer) => {
      yPos += 10
      const sourceName = referrer.source === 'Direkt Erişim' ? 'Direkt Erisim' : 
                        referrer.source === 'Ziyaretçi Artışı' ? 'Ziyaretci Artisi' : referrer.source
      pdf.text(sourceName + ': ' + referrer.views.toLocaleString() + ' (%' + referrer.percentage + ')', 25, yPos)
    })
    
    // QR Kod ekleme
    if (qrCodeUrl) {
      yPos += 20
      pdf.setFontSize(14)
      pdf.text('Profil QR Kodu:', 20, yPos)
      pdf.addImage(qrCodeUrl, 'PNG', 20, yPos + 5, 40, 40)
      pdf.setFontSize(10)
      pdf.text('QR kodu telefonla taratarak', 65, yPos + 15)
      pdf.text('profilinize hizlica erisebilirsiniz.', 65, yPos + 25)
    }
    
    // Footer bilgileri
    const currentDate = new Date()
    pdf.setFontSize(8)
    pdf.setTextColor(128, 128, 128)
    pdf.text('Rapor Tarihi: ' + currentDate.toLocaleDateString('tr-TR') + ' ' + currentDate.toLocaleTimeString('tr-TR'), 20, 280)
    pdf.text('Bu rapor QART Dijital Kartvizit Platformu tarafindan otomatik olusturulmustur.', 20, 285)
    
    // PDF'i indir
    const fileName = `${profile.slug}-detayli-rapor-${Date.now()}.pdf`
    pdf.save(fileName)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">QART Dashboard</h1>
                <p className="text-gray-400 text-sm">Profesyonel Dijital Kartvizit Yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Notice - if admin is viewing as customer */}
        {user?.wasAdmin && (
          <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-xl p-4 mb-6 border border-orange-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-orange-300">Admin olarak müşteri panelini görüntülüyorsunuz</p>
                  <p className="text-xs text-gray-400">Bu, müşterilerin gördüğü panel görünümüdür</p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Admin paneline geri dön
                  const originalUser = user.originalUser || JSON.parse(localStorage.getItem("tempUser") || "{}")
                  localStorage.setItem("user", JSON.stringify(originalUser))
                  localStorage.removeItem("tempUser")
                  window.location.href = "/admin-panel"
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition flex items-center space-x-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Admin Paneline Dön</span>
              </button>
            </div>
          </div>
        )}

        {/* User Welcome & Profile Section */}
        {user && (
          <div className="mb-8">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hoş geldiniz, {user.name}!</h2>
                    <p className="text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                        ✓ Aktif
                      </span>
                      {profile.isPremium && (
                        <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30">
                          💎 Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Son giriş</p>
                  <p className="text-sm text-gray-400">Bugün, 09:45</p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <a
                  href="/profile-management"
                  className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-600/30 rounded-xl p-4 hover:from-blue-600/30 hover:to-blue-700/30 transition group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <User className="h-6 w-6 text-blue-400 group-hover:scale-110 transition" />
                    <span className="text-sm font-medium text-gray-300">Profil Yönetimi</span>
                  </div>
                </a>

                <a
                  href="/page-layout"
                  className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-600/30 rounded-xl p-4 hover:from-purple-600/30 hover:to-purple-700/30 transition group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Settings className="h-6 w-6 text-purple-400 group-hover:scale-110 transition" />
                    <span className="text-sm font-medium text-gray-300">Sayfa Düzeni</span>
                  </div>
                </a>

                <a
                  href="/billing"
                  className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-600/30 rounded-xl p-4 hover:from-green-600/30 hover:to-green-700/30 transition group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CreditCard className="h-6 w-6 text-green-400 group-hover:scale-110 transition" />
                    <span className="text-sm font-medium text-gray-300">Abonelik</span>
                  </div>
                </a>

                <button
                  onClick={downloadDetailedReport}
                  className="bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-600/30 rounded-xl p-4 hover:from-orange-600/30 hover:to-orange-700/30 transition group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Download className="h-6 w-6 text-orange-400 group-hover:scale-110 transition" />
                    <span className="text-sm font-medium text-gray-300">Detaylı Rapor</span>
                  </div>
                </button>
              </div>

              {/* Public Profile Link ve QR Kod */}
              <div className="bg-black/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center text-sm font-medium text-gray-300">
                    <ExternalLink className="h-4 w-4 mr-2 text-blue-400" />
                    Public Profil Linkiniz
                  </label>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-400">qart.app'da yayında</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={`https://qart.app/${user.isAdmin ? 'admin-profile' : profile.slug}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-mono text-sm border border-gray-700"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 transition"
                  >
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copySuccess ? 'Kopyalandı!' : 'Kopyala'}</span>
                  </button>
                  <a
                    href={`/${user.isAdmin ? 'admin-profile' : profile.slug}`}
                    target="_blank"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-1 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Önizle</span>
                  </a>
                </div>
                
                {/* QR Kod Bölümü */}
                {qrCodeUrl && (
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <QrCode className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">NFC Kart QR Kodu</h4>
                          <p className="text-xs text-gray-500">Bu QR kodu NFC kartınıza yazdırın</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative group">
                          <div className="absolute -top-32 right-0 bg-white p-3 rounded-lg shadow-xl hidden group-hover:block z-10 border">
                            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                            <p className="text-xs text-center mt-2 text-gray-700">QR Kod Önizlemesi</p>
                          </div>
                          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg transition flex items-center space-x-2">
                            <Camera className="h-4 w-4" />
                            <span>Göster</span>
                          </button>
                        </div>
                        <button 
                          onClick={downloadQRCode}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>İndir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <span className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {analytics.overview.growth.views}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{analytics.overview.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Toplam Görüntülenme</p>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {analytics.overview.growth.visitors}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{analytics.overview.uniqueVisitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Benzersiz Ziyaretçi</p>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <MousePointer className="h-5 w-5 text-green-400" />
                    <span className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {analytics.overview.growth.clicks}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{analytics.overview.contactClicks}</p>
                  <p className="text-xs text-gray-400">İletişim Tıklaması</p>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <span className="text-xs text-red-400 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      {Math.abs(analytics.overview.growth.duration)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatDuration(analytics.overview.averageSessionDuration)}</p>
                  <p className="text-xs text-gray-400">Ortalama Süre</p>
                </div>
              </div>
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Views Trend Chart */}
              <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    Haftalık Görüntülenme Trendi
                  </h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="flex items-center text-gray-400">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mr-1"></div>
                      Görüntülenme
                    </span>
                    <span className="flex items-center text-gray-400">
                      <div className="h-2 w-2 bg-purple-500 rounded-full mr-1"></div>
                      Ziyaretçi
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {analytics.viewsTrend.map((day) => (
                    <div key={day.date} className="flex items-center">
                      <span className="text-sm text-gray-400 w-12">{day.date}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-800 rounded-full h-8 relative overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-end pr-3"
                            style={{ width: `${(day.views / 200) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">{day.views}</span>
                          </div>
                          <div 
                            className="absolute top-0 left-0 h-full bg-purple-600/30 rounded-full"
                            style={{ width: `${(day.visitors / 200) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-20 text-right">{day.visitors} ziyaretçi</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Stats */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-400" />
                  Cihaz Dağılımı
                </h3>
                <div className="space-y-4">
                  {analytics.deviceStats.map((device) => {
                    const getDeviceIcon = (deviceName: string) => {
                      switch(deviceName) {
                        case 'Mobil': return Smartphone
                        case 'Masaüstü': return Monitor  
                        case 'Tablet': return Tablet
                        default: return Monitor
                      }
                    }
                    
                    const getDeviceColor = (deviceName: string) => {
                      switch(deviceName) {
                        case 'Mobil': return 'bg-blue-500'
                        case 'Masaüstü': return 'bg-gray-500'
                        case 'Tablet': return 'bg-purple-500'
                        default: return 'bg-gray-500'
                      }
                    }
                    
                    const Icon = getDeviceIcon(device.device)
                    const colorClass = getDeviceColor(device.device)
                    
                    return (
                      <div key={device.device}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-300">{device.device}</span>
                          </div>
                          <span className="text-sm font-medium text-white">{device.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Country Stats */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-400" />
                  Ülke Dağılımı
                </h3>
                <div className="space-y-3">
                  {analytics.countryStats.map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{country.flag}</span>
                        <span className="text-sm text-gray-300">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-white">{country.views}</span>
                        <span className="text-xs text-gray-500 ml-2">%{country.percentage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Clicks */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-400" />
                  Sosyal Medya Tıklamaları
                </h3>
                <div className="space-y-3">
                  {analytics.socialClicks.map((social) => {
                    const getSocialIcon = (platform: string) => {
                      switch(platform) {
                        case 'LinkedIn': return Linkedin
                        case 'Instagram': return Instagram
                        case 'WhatsApp': return Phone
                        case 'GitHub': return Github
                        case 'Twitter': return Twitter
                        default: return Link2
                      }
                    }
                    
                    const getSocialColor = (platform: string) => {
                      switch(platform) {
                        case 'LinkedIn': return 'text-blue-600'
                        case 'Instagram': return 'text-pink-600'
                        case 'WhatsApp': return 'text-green-600'
                        case 'GitHub': return 'text-gray-400'
                        case 'Twitter': return 'text-sky-500'
                        default: return 'text-gray-400'
                      }
                    }
                    
                    const Icon = getSocialIcon(social.platform)
                    const colorClass = getSocialColor(social.platform)
                    
                    return (
                      <div key={social.platform} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className={`h-4 w-4 mr-2 ${colorClass}`} />
                          <span className="text-sm text-gray-300">{social.platform}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-white">{social.clicks}</span>
                          <span className="text-xs text-gray-500 ml-2">%{social.percentage}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-400" />
                  Trafik Kaynakları
                </h3>
                <div className="space-y-3">
                  {analytics.referrerStats.map((referrer) => (
                    <div key={referrer.source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">{referrer.source}</span>
                        <span className="text-sm font-medium text-white">{referrer.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full"
                          style={{ width: `${referrer.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Performance Metrics */}
            <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                Performans Özeti
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">%{analytics.overview.conversionRate}</div>
                  <div className="text-xs text-gray-400 mt-1">Dönüşüm Oranı</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">%{analytics.overview.bounceRate}</div>
                  <div className="text-xs text-gray-400 mt-1">Bounce Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{analytics.overview.profileShares}</div>
                  <div className="text-xs text-gray-400 mt-1">Paylaşım</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{analytics.overview.viewsToday}</div>
                  <div className="text-xs text-gray-400 mt-1">Bugünkü Görüntüleme</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}