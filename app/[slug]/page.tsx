"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import QRCode from "qrcode"
import { 
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Building,
  Award,
  Star,
  Users,
  Calendar,
  BadgeCheck,
  QrCode,
  Share2,
  Copy,
  Download,
  Check,
  ExternalLink,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  Camera,
  Play,
  ArrowRight,
  Clock,
  CheckCircle,
  Send,
  ThumbsUp,
  Eye,
  Bookmark,
  Link2,
  X,
  User,
  ChevronRight,
  FileText,
  BarChart3,
  Layers,
  Package,
  DollarSign,
  ArrowUpRight,
  Cpu,
  Coffee,
  Rocket,
  Trophy,
  Lightbulb,
  Palette,
  Code,
  Database,
  GitBranch,
  Youtube,
  PenTool,
  Video,
  Image,
  Mic,
  Edit3,
  Headphones,
  Navigation,
  Settings,
  UserCheck,
  UserPlus,
  Menu,
  ChevronDown,
  Activity,
  Command,
  Compass,
  Grid,
  Hash,
  Home,
  Inbox,
  Search,
  Maximize2,
  Globe2,
  MapPinned,
  UserCircle,
  PhoneCall,
  MessageSquare,
  FileCheck,
  FolderOpen,
  Handshake,
  MousePointer2,
  Focus,
  Scan,
  ContactRound,
  GraduationCap,
  Crown,
  Diamond,
  ChevronUp,
  ArrowDown,
  Verified,
  Quote,
  Smartphone,
  Monitor,
  Camera as CameraIcon,
  Wifi,
  Signal
} from "lucide-react"

export default function DijitalKartvizitSayfasi() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const [activeSection, setActiveSection] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [experienceYears, setExperienceYears] = useState(0)
  const [projectCount, setProjectCount] = useState(0)

  // Gerçek zamanlı saat
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Mouse takibi için subtle efektler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll takibi
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Görünürlük animasyonu
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  // Profil verilerini API'den çek
  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) return
      
      try {
        const response = await fetch(`/api/profile/${slug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setProfile(data.profile)
            setViewCount(Math.floor(Math.random() * 25000) + 10000)
            setExperienceYears(Math.floor(Math.random() * 8) + 3)
            setProjectCount(Math.floor(Math.random() * 150) + 50)
          }
        }
      } catch (error) {
        console.error('Profil yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [slug])

  // QR Kod oluşturma
  useEffect(() => {
    const generateQR = async () => {
      if (!profile?.slug) return
      
      try {
        const url = `https://qart-nfc-production.vercel.app/${profile.slug}`
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        })
        setQrCodeUrl(qrDataUrl)
      } catch (err) {
        console.error('QR kod oluşturulamadı:', err)
      }
    }
    
    if (profile) {
      generateQR()
    }
  }, [profile])

  // İletişim işlevleri
  const handleCall = () => {
    if (profile.phone) {
      window.open(`tel:${profile.phone}`, '_self')
    }
  }

  const handleWhatsApp = () => {
    if (profile.whatsapp) {
      const message = encodeURIComponent(`Merhaba ${profile.name}, QART dijital kartvizitinizden ulaşıyorum.`)
      window.open(`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleEmail = () => {
    if (profile.email) {
      const subject = encodeURIComponent(`${profile.name} - İletişim`)
      const body = encodeURIComponent(`Sayın ${profile.name},\n\nQART dijital kartvizitiniz aracılığıyla size ulaşıyorum.\n\nSaygılarımla,`)
      window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_self')
    }
  }

  const handleWebsite = () => {
    if (profile.website) {
      const url = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`
      window.open(url, '_blank')
    }
  }

  const shareProfile = async () => {
    const url = `https://qart-nfc-production.vercel.app/${profile.slug}`
    const title = `${profile.name} - ${profile.title}`
    const text = `${profile.bio || profile.name + ' dijital kartvizit'}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        console.error('Paylaşım hatası:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Kopyalama başarısız:', err)
      }
    }
  }

  const handleSaveContact = async () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.companyName || ''}
TITLE:${profile.title || ''}
TEL;TYPE=WORK,VOICE:${profile.phone || ''}
TEL;TYPE=CELL:${profile.whatsapp || ''}
EMAIL;TYPE=WORK:${profile.email || ''}
URL:${profile.website || ''}
ADR;TYPE=WORK:;;${profile.address || ''};;;;
NOTE:QART Dijital Kartvizit - ${profile.bio || ''}
PHOTO;VALUE=URL:${profile.profileImage || ''}
LOGO;VALUE=URL:${profile.logoUrl || ''}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.name.replace(/\s+/g, '_')}_Kişi.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Yükleme ekranı
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 border-2 border-gray-700 rounded-full animate-spin">
                <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <ContactRound className="h-5 w-5 text-black" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-light text-white tracking-wider">QART</h2>
            <p className="text-gray-400 text-sm">Dijital kartvizit yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  // Profil bulunamadı
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <X className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-light text-white mb-3">Profil Bulunamadı</h1>
          <p className="text-gray-400 mb-6 text-sm">Aradığınız dijital kartvizit mevcut değil veya gizli.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full blur-3xl transform translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full blur-3xl" />
      </div>
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* QART Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <Diamond className="h-4 w-4 text-white" />
              </div>
              <div className="text-xl font-bold text-gray-900 tracking-tight">QART</div>
            </div>
            
            {/* Anlık Bilgiler */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Çevrimiçi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()} görüntülenme</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
            </div>
            
            {/* Hızlı Aksiyonlar */}
            <div className="flex items-center space-x-3">
              <button
                onClick={shareProfile}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                title="Profili Paylaş"
              >
                <Share2 className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                title="QR Kod Göster"
              >
                <QrCode className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="relative pt-20">
        {/* Hero Bölümü - Tam Sayfa Akışkan Tasarım */}
        <section className="relative min-h-screen flex items-center justify-center py-20">
          <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
            {/* Hero Profil Alanı */}
            <div className="mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <UserCircle className="h-24 w-24 md:h-28 md:w-28 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Çevrimiçi Durumu */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-green-500 rounded-full p-3 shadow-lg border-4 border-white">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Premium Badge */}
                {profile.isPremium && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-3 rounded-full shadow-xl">
                    <Crown className="h-6 w-6" />
                  </div>
                )}
              </div>
            </div>

            {/* İsim ve Başlık */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light">{profile.title}</p>
              {profile.companyName && (
                <div className="flex items-center justify-center space-x-3 text-gray-500 text-lg">
                  <Building className="h-5 w-5" />
                  <span className="font-medium">{profile.companyName}</span>
                </div>
              )}
            </div>

            {/* Biyografi */}
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                {profile.bio}
              </p>
            </div>

            {/* Profesyonel İstatistikler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{viewCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Profil Görüntülenmesi</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Aktif</div>
                <div className="text-sm text-gray-600 font-medium">Çevrimiçi Durumu</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{experienceYears}+</div>
                <div className="text-sm text-gray-600 font-medium">Yıl Deneyim</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{projectCount}+</div>
                <div className="text-sm text-gray-600 font-medium">Tamamlanan Proje</div>
              </div>
            </div>

            {/* Ana İletişim Butonları */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button
                onClick={handleCall}
                className="group flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">Telefon Et</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="group flex items-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">WhatsApp</span>
              </button>

              <button
                onClick={handleEmail}
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">E-posta Gönder</span>
              </button>

              <button
                onClick={handleWebsite}
                className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Globe className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">Web Sitesi</span>
              </button>
            </div>

            {/* İletişim Kartları */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={handleSaveContact}
                className="group bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
              >
                <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Kişilere Kaydet</span>
              </button>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
              >
                <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Mesaj Gönder</span>
              </button>
            </div>
          </div>
        </section>

        {/* Uzmanlık Ve Yetenekler Bölümü */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Uzmanlık Alanlarım</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Yillarım süren deneyim ve sürekli gelişim anlayışımla kazandığım profesyonel yetkinliklerim</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { skill: 'Strateji Geliştirme', icon: Target, color: 'from-blue-500 to-blue-600' },
                { skill: 'İnovasyon Yönetimi', icon: Lightbulb, color: 'from-yellow-500 to-orange-500' },
                { skill: 'Liderlik & Yönetim', icon: Crown, color: 'from-purple-500 to-purple-600' },
                { skill: 'Dijital Pazarlama', icon: TrendingUp, color: 'from-green-500 to-green-600' },
                { skill: 'Teknoloji & İnovasyon', icon: Cpu, color: 'from-indigo-500 to-indigo-600' },
                { skill: 'Proje Yönetimi', icon: Briefcase, color: 'from-red-500 to-red-600' }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.skill}
                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.skill}</h3>
                    <p className="text-gray-600">Uzman seviyede deneyim ve derin bilgi birikimi</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Profesyonel Hizmetler */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sunduğum Hizmetler</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Müşterilerime en kaliteli ve profesyonel hizmetleri sunmak için her projede azami özen gösteriyorum</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Strateji Danışmanlığı', 
                  description: 'İş süreçlerinizi optimize edip büyüme stratejilerinizi geliştiriyorum', 
                  price: '5.000₺+',
                  icon: Target,
                  color: 'from-blue-500 to-blue-600'
                },
                { 
                  title: 'Dijital Dönüşüm', 
                  description: 'İşletmenizi dijital çağa hazırlayıp rekabet avantajı sağlıyorum', 
                  price: '7.500₺+',
                  icon: Rocket,
                  color: 'from-purple-500 to-purple-600'
                },
                { 
                  title: 'Proje Yönetimi', 
                  description: 'Karmaşık projelerinizi baştan sona yönetip başarıya ulaştırıyorum', 
                  price: '4.000₺+',
                  icon: CheckCircle,
                  color: 'from-green-500 to-green-600'
                },
                { 
                  title: 'Eğitim & Koçluk', 
                  description: 'Ekibinizi geliştirip performansını artırmak için kişisel koçluk hizmeti', 
                  price: '2.500₺+',
                  icon: GraduationCap,
                  color: 'from-orange-500 to-red-500'
                },
                { 
                  title: 'Analiz & Raporlama', 
                  description: 'Verilerinizi analiz edip aksiyon alabileceğiniz detaylı raporlar hazırlıyorum', 
                  price: '3.000₺+',
                  icon: BarChart3,
                  color: 'from-indigo-500 to-indigo-600'
                },
                { 
                  title: 'İnovasyon Geliştirme', 
                  description: 'Yenilikçi çözümler geliştirip işletmenizde sürdürülebilir değişim yaratıyorum', 
                  price: '6.000₺+',
                  icon: Lightbulb,
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((service, index) => {
                const Icon = service.icon
                return (
                  <div
                    key={index}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                        {service.price}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                    
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Detaylı Bilgi Al</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* İletişim Ve Konu Bilgileri */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Benimle İletişime Geçin</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Her türlü soru, öneri ve iş birliği teklifleriniz için 7/24 ulaşabilirsiniz</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Telefon</h3>
                  <p className="text-gray-600 font-medium">{profile.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">Anlık aram için tıklayın</p>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">E-posta</h3>
                  <p className="text-gray-600 font-medium break-all">{profile.email}</p>
                  <p className="text-sm text-gray-500 mt-2">Detaylı mesaj gönderin</p>
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Web Sitesi</h3>
                  <p className="text-gray-600 font-medium break-all">{profile.website}</p>
                  <p className="text-sm text-gray-500 mt-2">Portfolyoma göz atın</p>
                </a>
              )}

              <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">7/24 Destek</h3>
                <p className="text-gray-600 font-medium">Her zaman erişilebilir</p>
                <p className="text-sm text-gray-500 mt-2">Hızlı dönüş garantisi</p>
              </div>
            </div>

            {profile.address && (
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ofis Adresim</h3>
                      <p className="text-gray-600 text-lg">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sosyal Medya Ve Takip */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sosyal Medyada Takip Edin</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Güncel içeriklerim, proje gelişimlerim ve sektörel paylaşımlarım için beni takip edin</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  name: 'LinkedIn', 
                  icon: Linkedin, 
                  gradient: 'from-blue-600 to-blue-700', 
                  url: '#',
                  description: 'Profesyonel ağım'
                },
                { 
                  name: 'Instagram', 
                  icon: Instagram, 
                  gradient: 'from-pink-500 via-red-500 to-yellow-500', 
                  url: '#',
                  description: 'Günlük yaşam'
                },
                { 
                  name: 'Twitter', 
                  icon: Twitter, 
                  gradient: 'from-sky-400 to-sky-600', 
                  url: '#',
                  description: 'Anlık güncellemeler'
                },
                { 
                  name: 'YouTube', 
                  icon: Youtube, 
                  gradient: 'from-red-500 to-red-600', 
                  url: '#',
                  description: 'Eğitim videoları'
                }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center hover:scale-105 hover:-translate-y-2"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${social.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{social.name}</h3>
                    <p className="text-gray-600">{social.description}</p>
                    <div className="mt-4 inline-flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span>Takip Et</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Modern Footer */}
        <footer className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            {/* QART Logo & Brand */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-xl">
                  <Diamond className="h-8 w-8 text-black" />
                </div>
                <div>
                  <div className="text-4xl font-bold tracking-tight">QART</div>
                  <div className="text-sm text-gray-400 tracking-widest">DİJİTAL KART</u0130ZİT</div>
                </div>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Geleceğin dijital kartvizit teknolojisi ile profesyonel imajınızı güçlendirin
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Hızlı Erişim</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Ana Sayfa</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Hakkımda</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Hizmetler</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">İletişim</a>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">QART Özellikleri</h3>
                <div className="space-y-2">
                  <div className="text-gray-400">NFC Teknolojisi</div>
                  <div className="text-gray-400">QR Kod Entegrasyonu</div>
                  <div className="text-gray-400">Anlık Payllaşım</div>
                  <div className="text-gray-400">Mobil Optimizasyon</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Teknoloji</h3>
                <div className="space-y-2">
                  <div className="text-gray-400">Next.js & React</div>
                  <div className="text-gray-400">PostgreSQL Database</div>
                  <div className="text-gray-400">Cloudinary CDN</div>
                  <div className="text-gray-400">Vercel Hosting</div>
                </div>
              </div>
            </div>

            {/* Copyright & Social */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <p className="text-gray-500 text-sm">
                  © 2024 QART Dijital Kartvizit. Tüm hakları saklıdır. 
                  <span className="mx-2">|</span>
                  Profesyonel dijital çözümler
                </p>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>Güçlü teknoloji ile tasarımlandı</span>
                  <Rocket className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating QR Butonu */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center space-y-3">
        <button
          onClick={() => setShowQR(true)}
          className="group w-16 h-16 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 border border-gray-700"
          title="QR Kod Göster"
        >
          <QrCode className="h-7 w-7 group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={shareProfile}
          className="group w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
          title="Profili Paylaş"
        >
          <Share2 className="h-7 w-7 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* QR Kod modalı */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">QR Kod</h3>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Kod" className="w-full max-w-48 mx-auto" />
                )}
              </div>
              
              <p className="text-gray-600">
                Bu QR kodu taratarak dijital kartvizite anında erişim sağlayabilirsiniz
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={shareProfile}
                  className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copySuccess ? 'Kopyalandı!' : 'Paylaş'}</span>
                </button>
                
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `${profile.name.replace(/\s+/g, '_')}_QR.png`
                    link.href = qrCodeUrl
                    link.click()
                  }}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>İndir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* İletişim formu modalı */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">İletişime Geç</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adınız</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Adınızı girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    Mesaj Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}