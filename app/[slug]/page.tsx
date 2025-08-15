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
  User
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [viewCount, setViewCount] = useState(0)

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
            setViewCount(Math.floor(Math.random() * 500) + 100) // Random view count for demo
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
          width: 256,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
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
    const title = `${profile.name} - QART Dijital Kartvizit`
    const text = profile.bio || `${profile.name}'in dijital kartvizitini görüntüleyin`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        })
      } catch (err) {
        console.error('Paylaşım hatası:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  // Contact action handlers
  const handleCall = () => {
    if (profile.phone) window.open(`tel:${profile.phone}`, '_self')
  }

  const handleWhatsApp = () => {
    if (profile.whatsapp) window.open(`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
  }

  const handleEmail = () => {
    if (profile.email) window.open(`mailto:${profile.email}`, '_self')
  }

  const handleWebsite = () => {
    if (profile.website) window.open(profile.website, '_blank')
  }

  const handleSaveContact = async () => {
    // Create vCard
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.companyName || ''}
TITLE:${profile.title || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email || ''}
URL:${profile.website || ''}
ADR:${profile.address || ''}
NOTE:${profile.bio || ''}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.name.replace(/\s+/g, '_')}_contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Profil yükleniyor...</p>
            <p className="text-gray-400 text-sm">QART Dijital Kartvizit</p>
          </div>
        </div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <ExternalLink className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Profil Bulunamadı</h1>
          <p className="text-gray-400 max-w-md">Bu profil mevcut değil veya gizli olarak ayarlanmış.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Cover Image */}
        {profile.coverImageUrl && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={profile.coverImageUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Top Actions Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Eye className="h-4 w-4" />
              <span>{viewCount.toLocaleString()} görüntüleme</span>
              {profile.isPremium && (
                <>
                  <span className="text-gray-500">•</span>
                  <BadgeCheck className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400">Premium</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={shareProfile}
                className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button 
                onClick={() => setShowQR(!showQR)}
                className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-300"
              >
                <QrCode className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {profile.name}
                  </h1>
                  {profile.isPremium && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-sm font-medium">
                      <Sparkles className="h-4 w-4" />
                      <span>Premium</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xl text-gray-300 mb-2">{profile.title}</p>
                
                {profile.companyName && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Building className="h-4 w-4" />
                    <span>{profile.companyName}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">Aktif Kullanıcı</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Hızlı Yanıt</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">Doğrulanmış</span>
                </div>
              </div>
            </div>

            {/* Company Logo */}
            {profile.logoUrl && (
              <div className="w-24 h-24 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <img 
                  src={profile.logoUrl} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            <button 
              onClick={handleCall}
              className="flex flex-col items-center space-y-2 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-2xl transition-all duration-300 group border border-green-500/30"
            >
              <div className="p-3 bg-green-500 rounded-full group-hover:scale-110 transition-transform">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 font-medium">Ara</span>
            </button>

            <button 
              onClick={handleWhatsApp}
              className="flex flex-col items-center space-y-2 p-4 bg-green-600/20 hover:bg-green-600/30 rounded-2xl transition-all duration-300 group border border-green-600/30"
            >
              <div className="p-3 bg-green-600 rounded-full group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-500 font-medium">WhatsApp</span>
            </button>

            <button 
              onClick={handleEmail}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-2xl transition-all duration-300 group border border-blue-500/30"
            >
              <div className="p-3 bg-blue-500 rounded-full group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <span className="text-blue-400 font-medium">E-posta</span>
            </button>

            <button 
              onClick={handleWebsite}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-2xl transition-all duration-300 group border border-purple-500/30"
            >
              <div className="p-3 bg-purple-500 rounded-full group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-purple-400 font-medium">Website</span>
            </button>

            <button 
              onClick={handleSaveContact}
              className="flex flex-col items-center space-y-2 p-4 bg-gray-500/20 hover:bg-gray-500/30 rounded-2xl transition-all duration-300 group border border-gray-500/30"
            >
              <div className="p-3 bg-gray-500 rounded-full group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-400 font-medium">İletişim</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">QR Kod</h3>
              <p className="text-gray-600">Bu QR kodu taratarak profili paylaşabilirsiniz</p>
            </div>
            
            {qrCodeUrl && (
              <div className="bg-gray-100 p-6 rounded-2xl">
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-48 mx-auto" />
              </div>
            )}
            
            <div className="flex space-x-3">
              <button 
                onClick={copyToClipboard}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                <span>{copySuccess ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-2xl p-2">
          {[
            { id: 'about', label: 'Hakkında', icon: User },
            { id: 'contact', label: 'İletişim', icon: MapPin },
            { id: 'services', label: 'Hizmetler', icon: Briefcase },
            { id: 'social', label: 'Sosyal', icon: Link2 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Bio Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <Star className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">Hakkımda</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {profile.bio || "Bu profil sahibi henüz bir açıklama eklememiş."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              {profile.features && profile.features.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.features.map((feature: any, index: number) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                          <Award className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-purple-400" />
                  İletişim Bilgileri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.phone && (
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                      <Phone className="h-6 w-6 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Telefon</p>
                        <p className="text-white font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                      <Mail className="h-6 w-6 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">E-posta</p>
                        <p className="text-white font-medium">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                      <Globe className="h-6 w-6 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Website</p>
                        <p className="text-white font-medium">{profile.website}</p>
                      </div>
                    </div>
                  )}

                  {profile.address && (
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                      <MapPin className="h-6 w-6 text-red-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Adres</p>
                        <p className="text-white font-medium">{profile.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {profile.services && profile.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.services.map((service: any, index: number) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="p-3 bg-green-500/20 rounded-2xl">
                            <Briefcase className="h-8 w-8 text-green-400" />
                          </div>
                          {service.price && (
                            <div className="px-4 py-2 bg-purple-500/20 rounded-full">
                              <span className="text-purple-400 font-bold">{service.price}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                          <p className="text-gray-400">{service.description}</p>
                        </div>
                        
                        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2">
                          <span>İletişime Geç</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Henüz Hizmet Eklenmemiş</h3>
                  <p className="text-gray-500">Bu profil sahibi henüz hizmet bilgisi eklememis.</p>
                </div>
              )}
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Default social links */}
                {[
                  { name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700', url: '#' },
                  { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', url: '#' },
                  { name: 'Twitter', icon: Twitter, color: 'from-sky-400 to-sky-600', url: '#' },
                  { name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700', url: '#' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <button
                      key={index}
                      onClick={() => window.open(social.url, '_blank')}
                      className={`flex items-center space-x-4 p-6 bg-gradient-to-r ${social.color} rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg`}
                    >
                      <Icon className="h-8 w-8" />
                      <div className="text-left">
                        <p className="font-bold">{social.name}</p>
                        <p className="text-sm opacity-90">Takip Et</p>
                      </div>
                      <ExternalLink className="h-5 w-5 ml-auto" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">QART Dijital Kartvizit</p>
                <p className="text-gray-400 text-sm">Profesyonel dijital çözümler</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Güvenli ve Hızlı</span>
              <span>•</span>
              <span>qart.app</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}