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
  Wifi,
  Signal,
  Battery,
  Smartphone,
  Monitor,
  CreditCard,
  Fingerprint,
  Lock,
  Unlock,
  Key
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const parallaxRef = useRef<HTMLDivElement>(null)

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Visibility animation
  useEffect(() => {
    setIsVisible(true)
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
            setViewCount(Math.floor(Math.random() * 10000) + 2500)
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

  // Contact handlers with enhanced UX
  const handleCall = () => {
    if (profile.phone) {
      // Add haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50)
      window.open(`tel:${profile.phone}`, '_self')
    }
  }

  const handleWhatsApp = () => {
    if (profile.whatsapp) {
      const message = encodeURIComponent(`🌟 Merhaba ${profile.name}!\n\nQART dijital kartvizitinizden ulaşıyorum. Size nasıl yardımcı olabilirim?\n\n✨ QART ile tanıştım`)
      window.open(`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleEmail = () => {
    if (profile.email) {
      const subject = encodeURIComponent(`✉️ ${profile.name} - QART Kartvizit İletişimi`)
      const body = encodeURIComponent(`Sayın ${profile.name},\n\nQART dijital kartvizitiniz aracılığıyla size ulaşıyorum.\n\n📱 Profil: https://qart-nfc-production.vercel.app/${profile.slug}\n\nİyi günler dilerim.\n`)
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
    const title = `🌟 ${profile.name} - ${profile.title}`
    const text = `📱 ${profile.bio || profile.name + ' dijital kartvizit'}\n\n✨ QART ile tanışın`

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
NOTE:📱 QART Dijital Kartvizit\\n${profile.bio || ''}\\n✨ https://qart-nfc-production.vercel.app/${profile.slug}
PHOTO;VALUE=URL:${profile.profileImage || ''}
LOGO;VALUE=URL:${profile.logoUrl || ''}
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/${profile.slug}
X-SOCIALPROFILE;TYPE=twitter:https://twitter.com/${profile.slug}
X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${profile.slug}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.name.replace(/\s+/g, '_')}_QART_Contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Loading state with stunning animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-500/25 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 text-center">
          {/* Stunning Loader */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin"></div>
              {/* Middle Ring */}
              <div className="absolute inset-2 border-4 border-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
              {/* Inner Ring */}
              <div className="absolute inset-4 border-4 border-pink-400 rounded-full animate-ping"></div>
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center transform rotate-45 animate-pulse">
                  <CreditCard className="h-8 w-8 text-white transform -rotate-45" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                QART
              </span>
            </h2>
            <p className="text-white/80 text-lg font-medium">Dijital kartvizit yükleniyor...</p>
            <div className="flex items-center justify-center space-x-1 text-white/60">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 text-center max-w-md px-6">
          <div className="w-32 h-32 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm border border-red-500/30">
            <X className="h-16 w-16 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Profil Bulunamadı</h1>
          <p className="text-white/70 mb-8 text-lg">Aradığınız dijital kartvizit mevcut değil veya gizli olarak ayarlanmış.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-300 font-semibold text-lg shadow-2xl shadow-red-500/25 transform hover:scale-105"
          >
            🏠 Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dynamic Background with Parallax */}
      <div className="fixed inset-0 z-0">
        {/* Animated Gradient Background */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x / window.innerWidth * 100}% ${mousePosition.y / window.innerHeight * 100}%, 
                rgba(147, 51, 234, 0.3) 0%, 
                rgba(59, 130, 246, 0.2) 25%, 
                rgba(16, 185, 129, 0.1) 50%, 
                rgba(0, 0, 0, 0.9) 100%
              )
            `
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div 
                className="w-1 h-1 bg-white/20 rounded-full"
                style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
              />
            </div>
          ))}
        </div>

        {/* Cover Image with Parallax */}
        {profile.coverImageUrl && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <img 
              src={profile.coverImageUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        )}
      </div>

      {/* Top Status Bar (iPhone Style) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
            <span className="text-white/80 text-xs">QART</span>
          </div>
          
          <div className="text-white font-medium">{currentTime}</div>
          
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4 text-white" />
            <Signal className="h-4 w-4 text-white" />
            <div className="flex items-center space-x-1">
              <Battery className="h-4 w-4 text-white" />
              <span className="text-xs text-white/80">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Hero Card Section */}
        <section className="min-h-screen flex items-center justify-center p-6 relative">
          {/* Digital Business Card */}
          <div 
            className={`relative transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{
              transform: `
                translateY(${scrollY * 0.1}px) 
                rotateX(${mousePosition.y / window.innerHeight * 5 - 2.5}deg) 
                rotateY(${mousePosition.x / window.innerWidth * 5 - 2.5}deg)
              `,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Card Container */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-3xl blur opacity-75 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-md overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="300" fill="url(#grid)" />
                  </svg>
                </div>

                {/* QART Branding */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-bold">QART</span>
                  </div>
                </div>

                {/* Premium Badge */}
                {profile.isPremium && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      <span>PREMIUM</span>
                    </div>
                  </div>
                )}

                {/* Profile Section */}
                <div className="relative mt-6 text-center">
                  {/* Profile Image with Holographic Effect */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-full blur opacity-75 animate-spin-slow"></div>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <UserCircle className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Online Status */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="space-y-2 mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      {profile.name}
                    </h1>
                    <p className="text-white/80 font-medium">{profile.title}</p>
                    {profile.companyName && (
                      <div className="flex items-center justify-center space-x-2 text-white/60">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{profile.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{viewCount.toLocaleString()}</div>
                      <div className="text-xs text-white/60">Görüntüleme</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">AKTİF</div>
                      <div className="text-xs text-white/60">Durum</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">5+</div>
                      <div className="text-xs text-white/60">Yıl</div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-white/70 text-sm leading-relaxed mb-6 px-2">
                    {profile.bio}
                  </p>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={handleCall}
                      className="group relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <PhoneCall className="h-4 w-4 group-hover:animate-bounce" />
                        <span className="font-medium">Ara</span>
                      </div>
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/25"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <MessageCircle className="h-4 w-4 group-hover:animate-bounce" />
                        <span className="font-medium">WhatsApp</span>
                      </div>
                    </button>

                    <button
                      onClick={handleEmail}
                      className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="h-4 w-4 group-hover:animate-bounce" />
                        <span className="font-medium">E-posta</span>
                      </div>
                    </button>

                    <button
                      onClick={handleWebsite}
                      className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Globe className="h-4 w-4 group-hover:animate-bounce" />
                        <span className="font-medium">Website</span>
                      </div>
                    </button>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setShowQR(true)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                    >
                      <QrCode className="h-5 w-5 text-white" />
                    </button>
                    
                    <button
                      onClick={shareProfile}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                    >
                      <Share2 className="h-5 w-5 text-white" />
                    </button>
                    
                    <button
                      onClick={handleSaveContact}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Kişilere Kaydet</span>
                    </button>
                  </div>
                </div>

                {/* Company Logo */}
                {profile.logoUrl && (
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-xl p-2 backdrop-blur-sm border border-white/20">
                    <img 
                      src={profile.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-contain opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
            <ChevronDown className="h-6 w-6" />
          </div>
        </section>

        {/* Additional Information Sections */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Skills & Expertise */}
            <div 
              className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-8 backdrop-blur-md border border-white/20 transform transition-all duration-1000 hover:scale-105"
              style={{
                transform: `translateY(${Math.max(0, scrollY - 400) * 0.1}px)`
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Uzmanlık Alanları</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Strateji', 'İnovasyon', 'Liderlik', 'Pazarlama', 'Teknoloji', 'Yönetim'].map((skill, index) => (
                  <div
                    key={skill}
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105 hover:bg-purple-500/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-white font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Showcase */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-8 backdrop-blur-md border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Hizmetlerimiz</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {profile.services.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        {service.price && (
                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {service.price}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                      <p className="text-white/70 text-sm mb-4">{service.description}</p>
                      
                      <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium">
                        Detaylı Bilgi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-8 backdrop-blur-md border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">İletişim Bilgileri</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Telefon</p>
                      <p className="text-white font-semibold">{profile.phone}</p>
                    </div>
                  </a>
                )}

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">E-posta</p>
                      <p className="text-white font-semibold">{profile.email}</p>
                    </div>
                  </a>
                )}

                {profile.address && (
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl md:col-span-2">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Adres</p>
                      <p className="text-white font-semibold">{profile.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-8 backdrop-blur-md border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Sosyal Medya</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', url: '#' },
                  { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', url: '#' },
                  { name: 'Twitter', icon: Twitter, color: 'from-sky-400 to-blue-500', url: '#' },
                  { name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600', url: '#' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      className={`group flex flex-col items-center space-y-3 p-4 bg-gradient-to-br ${social.color} rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white group-hover:animate-bounce" />
                      <span className="text-white font-medium text-sm">{social.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating QR Button */}
      <button
        onClick={() => setShowQR(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 animate-pulse"
      >
        <QrCode className="h-6 w-6 text-white" />
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-sm w-full border border-white/20 shadow-2xl">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">QR Kod</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-6">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-64 mx-auto" />
                )}
              </div>
              
              <p className="text-white/70">
                Bu QR kodu taratarak dijital kartvizite anında erişim sağlayabilirsiniz
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={shareProfile}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copySuccess ? 'Kopyalandı!' : 'Paylaş'}</span>
                </button>
                
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `${profile.name.replace(/\s+/g, '_')}_QART_QR.png`
                    link.href = qrCodeUrl
                    link.click()
                  }}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>İndir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}