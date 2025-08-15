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
  Signal,
  Flame,
  Rainbow,
  Sunrise,
  Hexagon,
  Triangle,
  Square,
  Circle
} from "lucide-react"

export default function YaraticiProfilSayfasi() {
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
  const [experienceYears, setExperienceYears] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [animationPhase, setAnimationPhase] = useState(0)

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

  // Animasyon fazları
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Mouse takibi için etkileşimli efektler
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
    setTimeout(() => setIsVisible(true), 300)
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-spin bg-gradient-to-r from-cyan-500 via-emerald-500 to-yellow-500">
                <div className="w-3 h-3 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent">QART</h2>
            <p className="text-white/80 text-lg animate-pulse">Dijital kartvizit yükleniyor...</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Profil bulunamadı
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <X className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Profil Bulunamadı</h1>
          <p className="text-white/80 mb-8 text-lg">Aradığınız dijital kartvizit mevcut değil veya gizli.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Dinamik Arkaplan Efektleri - Siber Renk Paleti */}
      <div className="absolute inset-0">
        {/* Ana gradient orbs */}
        <div className={`absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-30 transform transition-all duration-6000 ${animationPhase === 0 ? 'translate-x-0 translate-y-0' : animationPhase === 1 ? 'translate-x-32 translate-y-16' : animationPhase === 2 ? 'translate-x-16 translate-y-32' : 'translate-x-8 translate-y-8'}`} />
        <div className={`absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full blur-3xl opacity-25 transform transition-all duration-6000 ${animationPhase === 1 ? 'translate-x-0 translate-y-0' : animationPhase === 2 ? '-translate-x-24 translate-y-12' : animationPhase === 3 ? '-translate-x-12 translate-y-24' : '-translate-x-6 translate-y-6'}`} />
        <div className={`absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full blur-3xl opacity-20 transform transition-all duration-6000 ${animationPhase === 2 ? 'translate-x-0 translate-y-0' : animationPhase === 3 ? 'translate-x-20 -translate-y-8' : animationPhase === 0 ? 'translate-x-10 -translate-y-16' : 'translate-x-5 -translate-y-4'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl opacity-15 transform transition-all duration-6000 ${animationPhase === 3 ? 'translate-x-0 translate-y-0' : animationPhase === 0 ? 'translate-x-16 translate-y-12' : animationPhase === 1 ? 'translate-x-8 translate-y-20' : 'translate-x-4 translate-y-10'}`} />
        
        {/* Mouse takip efekti */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full blur-2xl opacity-10 pointer-events-none transition-all duration-500"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
      </div>

      {/* Üst Gezinme Çubuğu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* QART Logosu */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Diamond className="h-5 w-5 text-black font-bold" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent">QART</div>
            </div>
            
            {/* Canlı Bilgiler */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Çevrimiçi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()} görüntüleme</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
            </div>
            
            {/* Hızlı Eylemler */}
            <div className="flex items-center space-x-3">
              <button
                onClick={shareProfile}
                className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                title="Profili Paylaş"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                title="QR Kod Göster"
              >
                <QrCode className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik - Tam Sayfa Yayılım */}
      <main className="relative pt-20">
        {/* Hero Bölümü - Düzeltilmiş Layout */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
              
              {/* Sol Taraf - Profil Bilgileri */}
              <div className="flex flex-col items-center lg:items-start space-y-8">
                {/* Profil Fotoğrafı Container */}
                <div className="relative">
                  <div className="relative w-56 h-56 mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
                    <div className="absolute inset-2 rounded-full overflow-hidden bg-white">
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt={profile.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <UserCircle className="h-32 w-32 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Çevrimiçi Durum */}
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-3 shadow-xl animate-bounce border-4 border-white">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>

                    {/* Premium Badge */}
                    {profile.isPremium && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black p-3 rounded-full shadow-xl animate-pulse border-4 border-white">
                        <Crown className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                </div>

                {/* İsim ve Ünvan Container */}
                <div className="text-center lg:text-left space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent leading-tight">
                      {profile.name}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                      {profile.title}
                    </h2>
                    {profile.companyName && (
                      <div className="flex items-center justify-center lg:justify-start space-x-3 text-white/70">
                        <Building className="h-6 w-6 flex-shrink-0" />
                        <span className="text-lg font-medium leading-relaxed">{profile.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Biyografi */}
                  <div className="max-w-2xl mx-auto lg:mx-0">
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>

                  {/* Ana İletişim Butonları */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button
                      onClick={handleCall}
                      className="group px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center space-x-3"
                    >
                      <PhoneCall className="h-5 w-5 group-hover:animate-pulse" />
                      <span className="leading-none">Telefon Et</span>
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="group px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center space-x-3"
                    >
                      <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                      <span className="leading-none">WhatsApp</span>
                    </button>

                    <button
                      onClick={handleEmail}
                      className="group px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center space-x-3"
                    >
                      <Mail className="h-5 w-5 group-hover:animate-pulse" />
                      <span className="leading-none">E-posta</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - İstatistikler ve Aksiyonlar */}
              <div className="space-y-8">
                {/* İstatistik Kartları */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Görüntülenme */}
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-black text-white mb-3">
                      {viewCount.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm font-medium mb-3">
                      Profil Görüntülenme
                    </div>
                    <Eye className="h-5 w-5 text-cyan-400 mx-auto animate-pulse" />
                  </div>

                  {/* Durum */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-black text-emerald-400 mb-3">
                      Aktif
                    </div>
                    <div className="text-white/70 text-sm font-medium mb-3">
                      Çevrimiçi Durum
                    </div>
                    <Zap className="h-5 w-5 text-emerald-400 mx-auto animate-pulse" />
                  </div>

                  {/* Deneyim */}
                  <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-black text-yellow-400 mb-3">
                      {experienceYears}+
                    </div>
                    <div className="text-white/70 text-sm font-medium mb-3">
                      Yıl Deneyim
                    </div>
                    <Trophy className="h-5 w-5 text-yellow-400 mx-auto animate-pulse" />
                  </div>

                  {/* Proje */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-black text-orange-400 mb-3">
                      {projectCount}+
                    </div>
                    <div className="text-white/70 text-sm font-medium mb-3">
                      Tamamlanan Proje
                    </div>
                    <Rocket className="h-5 w-5 text-orange-400 mx-auto animate-pulse" />
                  </div>
                </div>

                {/* Aksiyon Butonları */}
                <div className="space-y-4">
                  <button
                    onClick={handleSaveContact}
                    className="w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center space-x-3"
                  >
                    <Download className="h-5 w-5" />
                    <span>Kişilere Kaydet</span>
                  </button>
                  
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center space-x-3"
                  >
                    <Send className="h-5 w-5" />
                    <span>Mesaj Gönder</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Yetkinlik Alanları - Yayılmış Layout */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent leading-tight">
                Uzmanlık Alanlarım
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Yıllara dayanan deneyim ve sürekli öğrenme tutkumla kazandığım profesyonel yetkinliklerim
              </p>
            </div>
            
            {/* Yetkinlik Kartları - Düzgün Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr items-stretch">
              {[
                { 
                  skill: 'Strateji Geliştirme', 
                  icon: Target, 
                  gradient: 'from-cyan-500 to-blue-500',
                  description: 'Vizyoner yaklaşımla geleceği planlama'
                },
                { 
                  skill: 'İnovasyon Yönetimi', 
                  icon: Lightbulb, 
                  gradient: 'from-yellow-500 to-amber-500',
                  description: 'Yaratıcı çözümlerle değişimi yönetme'
                },
                { 
                  skill: 'Liderlik & Mentorluk', 
                  icon: Crown, 
                  gradient: 'from-orange-500 to-red-500',
                  description: 'Ekipleri başarıya ulaştırma sanatı'
                },
                { 
                  skill: 'Dijital Dönüşüm', 
                  icon: Cpu, 
                  gradient: 'from-emerald-500 to-green-500',
                  description: 'Teknoloji ile geleceği şekillendirme'
                },
                { 
                  skill: 'Proje Yönetimi', 
                  icon: CheckCircle, 
                  gradient: 'from-blue-500 to-cyan-500',
                  description: 'Karmaşık projeleri zamanında teslim'
                },
                { 
                  skill: 'Analitik Düşünce', 
                  icon: BarChart3, 
                  gradient: 'from-gray-600 to-gray-700',
                  description: 'Verilerle hikaye anlatma yeteneği'
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.skill}
                    className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col h-full"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl flex-shrink-0`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight flex-shrink-0">{item.skill}</h3>
                    <p className="text-white/70 leading-relaxed text-base flex-grow">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Profesyonel Hizmetler - Yaratıcı Layout */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Sunduğum Hizmetler
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Her projede mükemmellik arayışıyla, size özel çözümler geliştiriyorum
              </p>
            </div>
            
            {/* Hizmet Kartları - Zigzag Layout */}
            <div className="space-y-12">
              {[
                { 
                  title: 'Strateji Danışmanlığı', 
                  description: 'İş süreçlerinizi optimize edip büyüme stratejilerinizi geliştiriyorum. Rekabet analizi, pazar araştırması ve uzun vadeli planlama konularında kapsamlı destek sağlıyorum.', 
                  price: '5.000₺+',
                  icon: Target,
                  gradient: 'from-blue-600 to-cyan-600',
                  features: ['Rekabet Analizi', 'Pazar Araştırması', 'Büyüme Planlaması', 'Risk Yönetimi']
                },
                { 
                  title: 'Dijital Dönüşüm', 
                  description: 'İşletmenizi dijital çağa hazırlayıp rekabet avantajı sağlıyorum. Teknoloji entegrasyonu, süreç otomasyonu ve dijital kültür oluşturma konularında rehberlik ediyorum.', 
                  price: '7.500₺+',
                  icon: Rocket,
                  gradient: 'from-purple-600 to-pink-600',
                  features: ['Teknoloji Entegrasyonu', 'Süreç Otomasyonu', 'Dijital Kültür', 'Veri Analitiği']
                },
                { 
                  title: 'Liderlik Koçluğu', 
                  description: 'Kişisel ve profesyonel gelişiminizi destekleyerek liderlik potansiyelinizi ortaya çıkarıyorum. Ekip yönetimi, iletişim becerileri ve karar verme süreçlerinde mentorluk sağlıyorum.', 
                  price: '3.000₺+',
                  icon: Crown,
                  gradient: 'from-orange-600 to-red-600',
                  features: ['Kişisel Gelişim', 'Ekip Yönetimi', 'İletişim Becerileri', 'Karar Verme']
                }
              ].map((service, index) => {
                const Icon = service.icon
                const isEven = index % 2 === 0
                return (
                  <div
                    key={index}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}
                  >
                    {/* Hizmet Bilgileri */}
                    <div className={`space-y-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-3 min-w-0 flex-1">
                          <h3 className="text-3xl font-bold text-white leading-tight break-words">{service.title}</h3>
                          <span className={`inline-block px-4 py-2 bg-gradient-to-r ${service.gradient} text-white rounded-full text-lg font-bold shadow-lg`}>
                            {service.price}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xl text-white/80 leading-relaxed">{service.description}</p>
                      
                      {/* Özellikler */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-3 text-white/70 py-2"
                          >
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span className="text-base leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => setShowContactForm(true)}
                        className={`px-8 py-4 bg-gradient-to-r ${service.gradient} hover:scale-105 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl flex items-center space-x-3`}
                      >
                        <MessageSquare className="h-5 w-5" />
                        <span>Detaylı Bilgi Al</span>
                      </button>
                    </div>

                    {/* Görsel/İkon Alanı */}
                    <div className={`${!isEven ? 'lg:col-start-1' : ''} flex justify-center`}>
                      <div className={`w-80 h-80 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center shadow-2xl opacity-20 hover:opacity-30 transition-opacity duration-300`}>
                        <Icon className="h-40 w-40 text-white" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* İletişim Bilgileri - Yaratıcı Dizilim */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent leading-tight">
                Benimle İletişime Geçin
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Her türlü soru, öneri ve iş birliği teklifleriniz için 7/24 ulaşabilirsiniz
              </p>
            </div>
            
            {/* İletişim Kartları - Özel Dizilim */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="group bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:-translate-y-4 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">Telefon</h3>
                  <p className="text-white/80 font-medium mb-3 leading-relaxed break-all">{profile.phone}</p>
                  <p className="text-sm text-white/60 leading-relaxed">Anlık arama için tıklayın</p>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:-translate-y-4 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">E-posta</h3>
                  <p className="text-white/80 font-medium mb-3 break-all leading-relaxed">{profile.email}</p>
                  <p className="text-sm text-white/60 leading-relaxed">Detaylı mesaj gönderin</p>
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:-translate-y-4 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">Web Sitesi</h3>
                  <p className="text-white/80 font-medium mb-3 break-all leading-relaxed">{profile.website}</p>
                  <p className="text-sm text-white/60 leading-relaxed">Portfolyoma göz atın</p>
                </a>
              )}

              <div className="group bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:-translate-y-4 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl">
                  <Clock className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">7/24 Destek</h3>
                <p className="text-white/80 font-medium mb-3 leading-relaxed">Her zaman erişilebilir</p>
                <p className="text-sm text-white/60 leading-relaxed">Hızlı dönüş garantisi</p>
              </div>
            </div>

            {/* Adres Bilgisi */}
            {profile.address && (
              <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500">
                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Ofis Adresim</h3>
                      <p className="text-xl text-white/80 leading-relaxed break-words">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sosyal Medya - Dinamik Layout */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Sosyal Medyada Takip Edin
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Güncel içeriklerim, proje gelişimlerim ve sektörel paylaşımlarım için beni takip edin
              </p>
            </div>
            
            {/* Sosyal Medya Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  name: 'LinkedIn', 
                  icon: Linkedin, 
                  gradient: 'from-blue-600 to-blue-700', 
                  url: '#',
                  description: 'Profesyonel ağım',
                  followers: '12.5K'
                },
                { 
                  name: 'Instagram', 
                  icon: Instagram, 
                  gradient: 'from-pink-500 via-red-500 to-yellow-500', 
                  url: '#',
                  description: 'Günlük yaşam',
                  followers: '8.2K'
                },
                { 
                  name: 'Twitter', 
                  icon: Twitter, 
                  gradient: 'from-sky-400 to-sky-600', 
                  url: '#',
                  description: 'Anlık güncellemeler',
                  followers: '15.7K'
                },
                { 
                  name: 'YouTube', 
                  icon: Youtube, 
                  gradient: 'from-red-500 to-red-600', 
                  url: '#',
                  description: 'Eğitim videoları',
                  followers: '4.1K'
                }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:-translate-y-4 transition-all duration-500"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${social.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">{social.name}</h3>
                    <p className="text-white/60 mb-3 leading-relaxed">{social.description}</p>
                    <div className="text-lg font-bold text-white mb-4 leading-relaxed">{social.followers} takipçi</div>
                    <div className="inline-flex items-center text-sm text-white/70 group-hover:text-white transition-colors">
                      <span>Takip Et</span>
                      <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer - Yaratıcı Son */}
        <footer className="relative py-20 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Diamond className="h-8 w-8 text-black font-bold" />
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent">QART</div>
                  <div className="text-sm text-white/60 tracking-widest">DİJİTAL KARTVİZİT</div>
                </div>
              </div>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Geleceğin dijital kartvizit teknolojisi ile profesyonel imajınızı güçlendirin
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 text-white/60">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4 leading-tight">Hızlı Erişim</h4>
                <div className="space-y-3">
                  <div className="leading-relaxed">Ana Sayfa</div>
                  <div className="leading-relaxed">Hakkımda</div>
                  <div className="leading-relaxed">Hizmetler</div>
                  <div className="leading-relaxed">İletişim</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4 leading-tight">QART Özellikleri</h4>
                <div className="space-y-3">
                  <div className="leading-relaxed">NFC Teknolojisi</div>
                  <div className="leading-relaxed">QR Kod Entegrasyonu</div>
                  <div className="leading-relaxed">Anlık Paylaşım</div>
                  <div className="leading-relaxed">Mobil Optimizasyon</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4 leading-tight">Teknoloji</h4>
                <div className="space-y-3">
                  <div className="leading-relaxed">Next.js & React</div>
                  <div className="leading-relaxed">PostgreSQL Database</div>
                  <div className="leading-relaxed">Cloudinary CDN</div>
                  <div className="leading-relaxed">Vercel Hosting</div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <p className="text-white/50 text-sm leading-relaxed text-center md:text-left">
                  © 2024 QART Dijital Kartvizit. Tüm hakları saklıdır. 
                  <span className="mx-2">|</span>
                  Profesyonel dijital çözümler
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-white/50">
                  <span className="leading-relaxed">Güçlü teknoloji ile tasarımlandı</span>
                  <Rocket className="h-3 w-3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Butonlar */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center space-y-4">
        <button
          onClick={() => setShowQR(true)}
          className="group w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
          title="QR Kod Göster"
        >
          <QrCode className="h-7 w-7 group-hover:animate-pulse" />
        </button>
        
        <button
          onClick={shareProfile}
          className="group w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
          title="Profili Paylaş"
        >
          <Share2 className="h-7 w-7 group-hover:animate-pulse" />
        </button>
      </div>

      {/* QR Kod Modalı */}
      {showQR && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 max-w-md w-full shadow-2xl border border-white/20">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-2xl transition-colors group"
            >
              <X className="h-6 w-6 text-white/70 group-hover:text-white" />
            </button>
            
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-pulse">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Dijital Kartvizit QR</h3>
                  <p className="text-white/70">Anında profil erişimi</p>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="Dijital Kartvizit QR Kodu" 
                    className="w-full max-w-56 mx-auto" 
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Bu QR kodu taratarak <strong className="text-white">{profile.name}</strong>'nin dijital kartvizitine anlık ulaşabilir, tüm iletişim bilgilerine erişebilirsiniz.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={shareProfile}
                    className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 group-hover:animate-pulse" />
                        <span>Link Kopyala</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.download = `${profile.name.replace(/\s+/g, '_')}_QART_QR.png`
                      link.href = qrCodeUrl
                      link.click()
                    }}
                    className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5 group-hover:animate-pulse" />
                    <span>QR İndir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* İletişim Formu Modalı */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 max-w-2xl w-full shadow-2xl border border-white/20">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-2xl transition-colors group"
            >
              <X className="h-6 w-6 text-white/70 group-hover:text-white" />
            </button>
            
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Benimle İletişime Geçin</h3>
                <p className="text-white/70">Projeleriniz, sorularınız ve iş birliği önerileriniz için mesaj gönderin</p>
              </div>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-3">Adınız Soyadınız</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="Örnek: Ahmet Yılmaz"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-3">E-posta Adresiniz</label>
                    <input
                      type="email"
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Konu</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Mesaj konunuzu özetleyin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Mesajınız</label>
                  <textarea
                    rows={5}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none backdrop-blur-sm"
                    placeholder="Mesajınızı detaylı bir şekilde yazın... Projeleriniz, sorularınız ve iş birliği önerileriniz için memnuniyetle yardımcı olurum."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-300 font-semibold hover:scale-105"
                  >
                    İptal Et
                  </button>
                  <button
                    type="submit"
                    className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5 group-hover:animate-pulse" />
                    <span>Mesaj Gönder</span>
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