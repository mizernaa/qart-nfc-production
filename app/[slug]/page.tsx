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
  ChevronUp
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
  const cardRef = useRef<HTMLDivElement>(null)

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for subtle effects
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
      // Update active section based on scroll
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index)
        }
      })
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Visibility animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
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
            setViewCount(Math.floor(Math.random() * 15000) + 5000)
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

  // Contact handlers
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
      const body = encodeURIComponent(`Sayın ${profile.name},\n\nQART dijital kartvizitiniz aracılığıyla size ulaşıyorum.\n\nProfil: https://qart-nfc-production.vercel.app/${profile.slug}\n\nSaygılarımla,`)
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
    link.download = `${profile.name.replace(/\s+/g, '_')}_Contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Stunning loading animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Professional Loader */}
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              {/* Elegant spinning ring */}
              <div className="absolute inset-0 border-2 border-gray-700 rounded-full animate-spin">
                <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
              </div>
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <ContactRound className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-light text-white tracking-wider">
              QART
            </h2>
            <p className="text-gray-400 font-light">Loading digital business card...</p>
          </div>
        </div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-8">
            <X className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-light text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-8">The digital business card you're looking for doesn't exist or is private.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Sophisticated Background */}
      <div className="fixed inset-0 z-0">
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x / window.innerWidth * 100}% ${mousePosition.y / window.innerHeight * 100}%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 70%)`
          }}
        />
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute border border-white/20"
                style={{
                  left: `${(i % 4) * 25}%`,
                  top: `${Math.floor(i / 4) * 20}%`,
                  width: '25%',
                  height: '20%',
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              />
            ))}
          </div>
        </div>

        {/* Cover image with sophisticated overlay */}
        {profile.coverImageUrl && (
          <div 
            className="absolute inset-0 opacity-15"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <img 
              src={profile.coverImageUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>
        )}
      </div>

      {/* Premium Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Diamond className="h-4 w-4 text-black" />
              </div>
              <span className="font-light text-sm tracking-widest">QART</span>
            </div>
            
            {/* Time & Status */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={shareProfile}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Share Profile"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="QR Code"
              >
                <QrCode className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Hero Business Card */}
        <section 
          data-section
          className="min-h-screen flex items-center justify-center p-6 relative"
        >
          <div 
            ref={cardRef}
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              transform: `
                translateY(${scrollY * 0.05}px) 
                perspective(1000px) 
                rotateX(${(mousePosition.y - window.innerHeight / 2) / 50}deg) 
                rotateY(${(mousePosition.x - window.innerWidth / 2) / 50}deg)
              `
            }}
          >
            {/* Premium Business Card */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 via-white to-gray-600 rounded-2xl blur-sm opacity-50"></div>
              
              {/* Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                {/* Card Header */}
                <div className="relative p-8 pb-6">
                  {/* Premium indicator */}
                  {profile.isPremium && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-gray-400 to-gray-200 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Crown className="h-3 w-3" />
                        <span>PREMIUM</span>
                      </div>
                    </div>
                  )}

                  {/* Profile Image */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-600 shadow-xl">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <UserCircle className="h-14 w-14 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Status indicator */}
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="text-center space-y-3">
                    <h1 className="text-3xl font-light text-white tracking-wide">
                      {profile.name}
                    </h1>
                    <p className="text-gray-300 font-light text-lg">{profile.title}</p>
                    {profile.companyName && (
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Building className="h-4 w-4" />
                        <span className="text-sm font-light">{profile.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-center text-gray-400 text-sm leading-relaxed mt-4 px-4">
                    {profile.bio}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="border-t border-gray-700 px-8 py-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-white font-light text-lg">{viewCount.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs font-light">VIEWS</div>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-light text-lg">ONLINE</div>
                      <div className="text-gray-500 text-xs font-light">STATUS</div>
                    </div>
                    <div>
                      <div className="text-white font-light text-lg">5+</div>
                      <div className="text-gray-500 text-xs font-light">YEARS</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-700 p-6">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={handleCall}
                      className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span className="font-light">Call</span>
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="group bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-light">WhatsApp</span>
                    </button>

                    <button
                      onClick={handleEmail}
                      className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="font-light">Email</span>
                    </button>

                    <button
                      onClick={handleWebsite}
                      className="group bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="font-light">Website</span>
                    </button>
                  </div>

                  {/* Save Contact */}
                  <button
                    onClick={handleSaveContact}
                    className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Save to Contacts</span>
                  </button>
                </div>

                {/* Company Logo */}
                {profile.logoUrl && (
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
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

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 animate-bounce">
            <ChevronDown className="h-5 w-5" />
          </div>
        </section>

        {/* Professional Information */}
        <section data-section className="py-20 px-6">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* Expertise */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-10 border border-gray-800 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-light text-white">Expertise</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Strategy', 'Innovation', 'Leadership', 'Marketing', 'Technology', 'Management'].map((skill, index) => (
                  <div
                    key={skill}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <span className="text-white font-light">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-10 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-light text-white">Services</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {profile.services.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        {service.price && (
                          <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-light">
                            {service.price}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-light text-white mb-2">{service.title}</h4>
                      <p className="text-gray-400 text-sm mb-4 font-light">{service.description}</p>
                      
                      <button 
                        onClick={() => setShowContactForm(true)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300 font-light"
                      >
                        Learn More
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-10 border border-gray-800 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                  <ContactRound className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-light text-white">Contact</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-light">Phone</p>
                      <p className="text-white font-light">{profile.phone}</p>
                    </div>
                  </a>
                )}

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-light">Email</p>
                      <p className="text-white font-light">{profile.email}</p>
                    </div>
                  </a>
                )}

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-light">Website</p>
                      <p className="text-white font-light">{profile.website}</p>
                    </div>
                  </a>
                )}

                {profile.address && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl md:col-span-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-light">Address</p>
                      <p className="text-white font-light">{profile.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-10 border border-gray-800 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-light text-white">Connect</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'LinkedIn', icon: Linkedin, url: '#' },
                  { name: 'Instagram', icon: Instagram, url: '#' },
                  { name: 'Twitter', icon: Twitter, url: '#' },
                  { name: 'Facebook', icon: Facebook, url: '#' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      className="group flex flex-col items-center space-y-3 p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                      <span className="text-white font-light text-sm">{social.name}</span>
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
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        title="QR Code"
      >
        <QrCode className="h-5 w-5" />
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-sm w-full border border-gray-700 shadow-2xl">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-2xl font-light text-white">QR Code</h3>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-48 mx-auto" />
                )}
              </div>
              
              <p className="text-gray-400 font-light">
                Scan this QR code to instantly access the digital business card
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={shareProfile}
                  className="flex-1 bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copySuccess ? 'Copied!' : 'Share'}</span>
                </button>
                
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `${profile.name.replace(/\s+/g, '_')}_QR.png`
                    link.href = qrCodeUrl
                    link.click()
                  }}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-lg w-full border border-gray-700 shadow-2xl">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-white">Get in Touch</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    placeholder="Your message..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-light"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Send Message
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