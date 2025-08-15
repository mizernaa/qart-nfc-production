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
  Handshake
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
            setViewCount(Math.floor(Math.random() * 5000) + 1000) // Demo için
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
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
            dark: '#1e293b',
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

  // Link kopyalama
  const copyToClipboard = async () => {
    try {
      const url = `https://qart-nfc-production.vercel.app/${profile.slug}`
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Kopyalama başarısız:', err)
    }
  }

  // Share API
  const shareProfile = async () => {
    const url = `https://qart-nfc-production.vercel.app/${profile.slug}`
    const title = `${profile.name} - ${profile.title}`
    const text = profile.bio || `${profile.name} dijital kartvizit`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        console.error('Paylaşım hatası:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  // Contact handlers
  const handleCall = () => {
    if (profile.phone) window.open(`tel:${profile.phone}`, '_self')
  }

  const handleWhatsApp = () => {
    if (profile.whatsapp) {
      const message = encodeURIComponent(`Merhaba ${profile.name}, QART dijital kartvizitinizden ulaşıyorum.`)
      window.open(`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleEmail = () => {
    if (profile.email) {
      const subject = encodeURIComponent('İletişim - QART Dijital Kartvizit')
      const body = encodeURIComponent(`Merhaba ${profile.name},\n\nQART dijital kartvizitinizden ulaşıyorum.\n\n`)
      window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_self')
    }
  }

  const handleWebsite = () => {
    if (profile.website) {
      const url = profile.website.startsWith('http') ? profile.website : `https://${profile.website}`
      window.open(url, '_blank')
    }
  }

  const handleSaveContact = async () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.companyName || ''}
TITLE:${profile.title || ''}
TEL;TYPE=WORK,VOICE:${profile.phone || ''}
EMAIL;TYPE=WORK:${profile.email || ''}
URL:${profile.website || ''}
ADR;TYPE=WORK:;;${profile.address || ''};;;;
NOTE:${profile.bio || ''}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.name.replace(/\s+/g, '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 rounded-full animate-spin border-t-slate-800"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full border-t-blue-600 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-800 font-semibold text-lg">Profil yükleniyor</p>
            <p className="text-slate-500 text-sm mt-1">QART Business Card</p>
          </div>
        </div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <X className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Profil Bulunamadı</h1>
          <p className="text-slate-600 mb-8">Aradığınız profil mevcut değil veya gizli olarak ayarlanmış.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Name */}
            <div className="flex items-center space-x-3">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-semibold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.title}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={shareProfile}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
              >
                <QrCode className="h-5 w-5" />
              </button>
              <button
                onClick={handleSaveContact}
                className="hidden sm:flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-600 rounded-full blur-3xl"></div>
        </div>

        {/* Cover Image (if exists) */}
        {profile.coverImageUrl && (
          <div className="absolute inset-0 opacity-10">
            <img 
              src={profile.coverImageUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl bg-white shadow-xl p-1">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    <UserCircle className="h-20 w-20 text-slate-400" />
                  </div>
                )}
              </div>
              {profile.isPremium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {/* Name & Title */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-slate-600 font-medium mb-1">{profile.title}</p>
                {profile.companyName && (
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Building className="h-5 w-5" />
                    <span className="font-medium">{profile.companyName}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                {profile.bio}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Durum</p>
                    <p className="font-semibold text-slate-900">Aktif</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Görüntülenme</p>
                    <p className="font-semibold text-slate-900">{viewCount.toLocaleString('tr-TR')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Deneyim</p>
                    <p className="font-semibold text-slate-900">5+ Yıl</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex flex-col space-y-3">
              <button
                onClick={handleCall}
                className="flex items-center space-x-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-green-600/20"
              >
                <PhoneCall className="h-5 w-5" />
                <span>Ara</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center space-x-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center space-x-3 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-slate-800/20"
              >
                <Mail className="h-5 w-5" />
                <span>E-posta</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden grid grid-cols-3 gap-3 mt-8">
            <button
              onClick={handleCall}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200"
            >
              <PhoneCall className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Ara</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200"
            >
              <MessageCircle className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
            </button>
            <button
              onClick={handleEmail}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
            >
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">E-posta</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-20 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: Grid },
              { id: 'about', label: 'Hakkında', icon: User },
              { id: 'services', label: 'Hizmetler', icon: Briefcase },
              { id: 'contact', label: 'İletişim', icon: Phone },
              { id: 'social', label: 'Sosyal', icon: Share2 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-slate-900 text-slate-900 bg-slate-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Müşteri', value: '500+', icon: Users, color: 'blue' },
                  { label: 'Proje', value: '150+', icon: Briefcase, color: 'green' },
                  { label: 'Deneyim', value: '5+ Yıl', icon: Award, color: 'purple' },
                  { label: 'Başarı Oranı', value: '%98', icon: TrendingUp, color: 'amber' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  const colorClasses = {
                    blue: 'bg-blue-50 text-blue-600',
                    green: 'bg-green-50 text-green-600',
                    purple: 'bg-purple-50 text-purple-600',
                    amber: 'bg-amber-50 text-amber-600'
                  }
                  return (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
                      <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                      <p className="text-slate-500 font-medium">{stat.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-amber-500" />
                  Öne Çıkan Özellikler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.features?.map((feature: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                        <p className="text-slate-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Hemen İletişime Geçin</h3>
                    <p className="text-slate-300">Projeleriniz için profesyonel çözümler sunuyoruz.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-all duration-200"
                    >
                      Mesaj Gönder
                    </button>
                    <button
                      onClick={handleCall}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-5 w-5" />
                      <span>Hemen Ara</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Hakkımda</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {profile.bio || "Profesyonel iş deneyimimle müşterilerime en iyi hizmeti sunmayı hedefliyorum."}
                  </p>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Uzmanlık Alanları</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Strateji', 'Yönetim', 'Pazarlama', 'Dijital Dönüşüm', 'İnovasyon', 'Liderlik'].map((skill) => (
                      <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Deneyim</h4>
                  <div className="space-y-4">
                    {[
                      { year: '2020 - Günümüz', title: 'Kurucu & CEO', company: profile.companyName || 'Şirket Adı' },
                      { year: '2018 - 2020', title: 'Kıdemli Danışman', company: 'Global Consulting' },
                      { year: '2015 - 2018', title: 'Proje Yöneticisi', company: 'Tech Solutions' }
                    ].map((exp, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">{exp.year}</p>
                          <h5 className="font-semibold text-slate-900">{exp.title}</h5>
                          <p className="text-slate-600">{exp.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.services?.map((service: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      {service.price && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-semibold">
                          {service.price}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h4>
                    <p className="text-slate-600 mb-4">{service.description}</p>
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      Detaylı Bilgi Al
                    </button>
                  </div>
                ))}
              </div>

              {!profile.services?.length && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Hizmetler Yakında</h3>
                  <p className="text-slate-600">Hizmet detayları yakında eklenecektir.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h3>
                  <div className="space-y-4">
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Telefon</p>
                          <p className="font-semibold text-slate-900">{profile.phone}</p>
                        </div>
                      </a>
                    )}

                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">E-posta</p>
                          <p className="font-semibold text-slate-900">{profile.email}</p>
                        </div>
                      </a>
                    )}

                    {profile.website && (
                      <a href={profile.website} target="_blank" className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Globe className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Website</p>
                          <p className="font-semibold text-slate-900">{profile.website}</p>
                        </div>
                      </a>
                    )}

                    {profile.address && (
                      <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Adres</p>
                          <p className="font-semibold text-slate-900">{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Hızlı Mesaj</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Adınız</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Adınızı girin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Mesajınız</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Mesajınızı yazın..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      Gönder
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Sosyal Medya</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600', url: '#' },
                    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', url: '#' },
                    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 to-pink-600', url: '#' },
                    { name: 'Facebook', icon: Facebook, color: 'bg-blue-700', url: '#' },
                    { name: 'YouTube', icon: Youtube, color: 'bg-red-600', url: '#' },
                    { name: 'GitHub', icon: GitBranch, color: 'bg-slate-800', url: '#' }
                  ].map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all duration-200 group"
                      >
                        <div className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{social.name}</p>
                          <p className="text-sm text-slate-500">@{profile.slug}</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <p className="font-bold">QART Business Card</p>
                <p className="text-sm text-slate-400">Dijital kartvizit çözümleri</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>© 2024 QART</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Şartlar</a>
            </div>
          </div>
        </div>
      </footer>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">QR Kod</h3>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-64 mx-auto" />
              )}
            </div>
            
            <p className="text-center text-slate-600 mb-6">
              Bu QR kodu taratarak dijital kartvizite erişebilirsiniz
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                <span>{copySuccess ? 'Kopyalandı' : 'Linki Kopyala'}</span>
              </button>
              
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.download = `${profile.name.replace(/\s+/g, '_')}_QR.png`
                  link.href = qrCodeUrl
                  link.click()
                }}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">İletişim Formu</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adınız *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Adınızı girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">E-posta *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Konu *</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                  <option>Genel Bilgi</option>
                  <option>İş Teklifi</option>
                  <option>İşbirliği</option>
                  <option>Diğer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mesajınız *</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Mesajınızı yazın..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                >
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}