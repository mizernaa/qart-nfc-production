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

export default function PublicProfilePage() {
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
    <div className="min-h-screen bg-white">
      {/* Üst menü */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <Diamond className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-black text-sm tracking-wide">QART</span>
            </div>
            
            {/* Bilgiler */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{currentTime}</span>
              </div>
            </div>
            
            {/* Aksiyonlar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={shareProfile}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Paylaş"
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="QR Kod"
              >
                <QrCode className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="pt-16">
        {/* Hero bölümü */}
        <section className="relative bg-gradient-to-br from-gray-50 to-white py-12 md:py-20">
          {/* Kapak görseli */}
          {profile.coverImageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img 
                src={profile.coverImageUrl} 
                alt="Kapak" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
          )}

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            {/* Profil fotoğrafı */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <UserCircle className="h-16 w-16 md:h-20 md:w-20 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Online durum */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Premium rozet */}
              {profile.isPremium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-1 rounded-full shadow-lg">
                  <Crown className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* İsim ve ünvan */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-2">{profile.title}</p>
              {profile.companyName && (
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <Building className="h-4 w-4" />
                  <span>{profile.companyName}</span>
                </div>
              )}
            </div>

            {/* Biyografi */}
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              {profile.bio}
            </p>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{viewCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Görüntülenme</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Aktif</div>
                <div className="text-xs text-gray-500">Durum</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5+</div>
                <div className="text-xs text-gray-500">Yıl Deneyim</div>
              </div>
            </div>

            {/* Hızlı iletişim butonları */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={handleCall}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PhoneCall className="h-4 w-4" />
                <span className="font-medium">Ara</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">WhatsApp</span>
              </button>

              <button
                onClick={handleEmail}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">E-posta</span>
              </button>

              <button
                onClick={handleWebsite}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">Website</span>
              </button>
            </div>

            {/* Kişilere kaydet butonu */}
            <button
              onClick={handleSaveContact}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Download className="h-4 w-4" />
              <span>Kişilere Kaydet</span>
            </button>
          </div>
        </section>

        {/* Uzmanlık alanları */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Uzmanlık Alanları</h2>
              <p className="text-gray-600">Profesyonel deneyim ve yetkinlik alanlarım</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Strateji Geliştirme', 'İnovasyon Yönetimi', 'Liderlik', 'Dijital Pazarlama', 'Teknoloji', 'Proje Yönetimi'].map((skill, index) => (
                <div
                  key={skill}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-center group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors">
                    <Award className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="text-gray-900 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hizmetler */}
        {profile.services && profile.services.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hizmetlerim</h2>
                <p className="text-gray-600">Sunduğum profesyonel hizmetler</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {profile.services.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      {service.price && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {service.price}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className="w-full bg-gray-900 hover:bg-black text-white py-3 px-6 rounded-xl font-medium transition-all duration-300"
                    >
                      Detaylı Bilgi Al
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* İletişim bilgileri */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
              <p className="text-gray-600">Benimle iletişime geçmek için</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p className="text-gray-900 font-medium">{profile.phone}</p>
                  </div>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-posta</p>
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                  </div>
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  className="flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="text-gray-900 font-medium">{profile.website}</p>
                  </div>
                </a>
              )}

              {profile.address && (
                <div className="flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adres</p>
                    <p className="text-gray-900 font-medium">{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sosyal medya */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sosyal Medya</h2>
              <p className="text-gray-600">Sosyal medya hesaplarımdan takip edebilirsiniz</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600 hover:bg-blue-700', url: '#' },
                { name: 'Instagram', icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700', url: '#' },
                { name: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600', url: '#' },
                { name: 'Facebook', icon: Facebook, color: 'bg-blue-700 hover:bg-blue-800', url: '#' }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    className={`group flex flex-col items-center space-y-3 p-6 ${social.color} text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                  >
                    <Icon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{social.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Diamond className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">QART</span>
            </div>
            <p className="text-gray-400 mb-4">Dijital Kartvizit Çözümleri</p>
            <p className="text-gray-500 text-sm">© 2024 QART. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>

      {/* Floating QR butonu */}
      <button
        onClick={() => setShowQR(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        title="QR Kod"
      >
        <QrCode className="h-6 w-6" />
      </button>

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