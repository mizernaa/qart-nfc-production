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
  ExternalLink
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)

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
            dark: '#000000',
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

  // QR Kod indirme
  const downloadQRCode = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.download = `qart-qr-${profile.slug}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      // Fallback to copy
      copyToClipboard()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Profil Bulunamadı</h1>
          <p className="text-gray-400">Bu profil mevcut değil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="relative">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sol: Şirket Bilgileri */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-6">
                  {profile.logoUrl ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 backdrop-blur-sm border border-gray-700">
                      <img 
                        src={profile.logoUrl} 
                        alt={`${profile.companyName || profile.name} Logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : profile.profileImage ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 backdrop-blur-sm border border-gray-700">
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-white">
                        {profile.companyName || profile.name}
                      </h1>
                      {profile.isPremium && (
                        <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full">
                          <BadgeCheck className="h-4 w-4 text-white mr-1" />
                          <span className="text-xs font-medium text-white">PRO</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xl text-blue-400 mb-4">
                      {profile.title}
                    </p>
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {profile.bio}
                    </p>

                    {/* İstatistikler */}
                    {profile.stats && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{profile.stats.customers}</div>
                          <div className="text-sm text-gray-400">Müşteri</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{profile.stats.projects}</div>
                          <div className="text-sm text-gray-400">Proje</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{profile.stats.experience}</div>
                          <div className="text-sm text-gray-400">Deneyim</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{profile.stats.employees}</div>
                          <div className="text-sm text-gray-400">Çalışan</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ: İletişim Kartı */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">İletişim Bilgileri</h3>
                  
                  <div className="space-y-4">
                    {profile.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm text-gray-400">Telefon</div>
                          <div className="text-white font-medium">{profile.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {profile.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-400">E-mail</div>
                          <div className="text-white font-medium">{profile.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="text-sm text-gray-400">Website</div>
                          <div className="text-white font-medium">{profile.website}</div>
                        </div>
                      </div>
                    )}
                    
                    {(profile.address || profile.city) && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-red-500 mt-1" />
                        <div>
                          <div className="text-sm text-gray-400">Adres</div>
                          <div className="text-white">
                            {profile.address && <div>{profile.address}</div>}
                            <div>{profile.city}, {profile.country}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Ara
                      </a>
                    )}
                    
                    {profile.phone && (
                      <a
                        href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    )}
                  </div>

                  {/* QR Kod ve Share Butonları */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white">Bu Profili Paylaş</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowQR(!showQR)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                          title="QR Kod"
                        >
                          <QrCode className="h-4 w-4 text-gray-300" />
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                          title="Linki Kopyala"
                        >
                          {copySuccess ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-300" />}
                        </button>
                        <button
                          onClick={shareProfile}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                          title="Paylaş"
                        >
                          <Share2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* QR Kod Modal */}
                    {showQR && qrCodeUrl && (
                      <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-32 h-32 mx-auto mb-3 bg-white p-2 rounded"
                        />
                        <p className="text-xs text-gray-400 mb-3">
                          Bu QR kodu taratarak profile erişin
                        </p>
                        <button
                          onClick={downloadQRCode}
                          className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          QR Kod İndir
                        </button>
                      </div>
                    )}

                    {/* Profil URL */}
                    <div className="mt-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={`https://qart-nfc-production.vercel.app/${profile.slug}`}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-mono border border-gray-700"
                        />
                        <button
                          onClick={() => window.open(`https://qart-nfc-production.vercel.app/${profile.slug}`, '_blank')}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                          title="Yeni Sekmede Aç"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hizmetler */}
        {profile.services && profile.services.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Hizmetlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.services.map((service: any, index: number) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Özellikler */}
        {profile.features && profile.features.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Özelliklerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.features.map((feature: any, index: number) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {typeof feature === 'object' ? feature.title : feature}
                  </h3>
                  {typeof feature === 'object' && feature.description && (
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}