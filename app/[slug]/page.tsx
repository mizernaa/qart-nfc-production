"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getThemeById, getDefaultTheme, type Theme } from "@/lib/themes"
import { applyTheme } from "@/lib/themes"
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
  BadgeCheck
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>(getDefaultTheme())

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
            
            // Profilde tema ID varsa o temayı uygula
            if (data.profile?.themeId) {
              const profileTheme = getThemeById(data.profile.themeId)
              if (profileTheme) {
                setTheme(profileTheme)
              }
            }
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
  
  // Tema değiştiğinde CSS değişkenlerini uygula
  useEffect(() => {
    if (theme && typeof document !== 'undefined') {
      const root = document.documentElement
      const themeStyles = applyTheme(theme)
      
      Object.entries(themeStyles).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
      
      // Body background'ı da ayarla
      if (theme.backgroundGradient) {
        document.body.style.background = theme.backgroundGradient
      } else {
        document.body.style.backgroundColor = theme.backgroundColor
      }
    }
  }, [theme])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
      </div>
    )
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>Profil Bulunamadı</h1>
          <p style={{ color: theme.textColor, opacity: 0.7 }}>Bu profil mevcut değil.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: theme.backgroundGradient || theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      <div className="relative">
        {/* Hero Section */}
        <div 
          className="relative border-b"
          style={{ 
            background: `linear-gradient(to right, ${theme.primaryColor}20, ${theme.secondaryColor}20)`,
            borderColor: `${theme.primaryColor}30`
          }}>
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