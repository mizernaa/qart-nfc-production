"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Phone, Mail, Globe, MapPin, Clock, Star, MessageSquare,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Github,
  ChevronRight, Download, Share2, Calendar, Users, Award,
  ShoppingBag, FileText, CreditCard, Building2, Briefcase,
  QrCode, ExternalLink, Copy, CheckCircle, Navigation,
  DollarSign, TrendingUp, Package, Shield, Heart, Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("overview")
  const [slug, setSlug] = useState<string>("")

  useEffect(() => {
    const getSlugAndFetch = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
      fetchProfile(resolvedParams.slug)
    }
    getSlugAndFetch()
  }, [params])

  const fetchProfile = async (profileSlug: string) => {
    try {
      const response = await fetch(`/api/profile/${profileSlug}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.profile) {
          setProfile(data.profile)
          if (data.profile.theme) {
            fetchTheme(data.profile.themeId || data.profile.theme)
          }
        }
      } else {
        notFound()
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const fetchTheme = async (themeId: string) => {
    try {
      const response = await fetch(`/api/theme/${themeId}`)
      if (response.ok) {
        const data = await response.json()
        setTheme(data)
      }
    } catch (error) {
      console.error("Error fetching theme:", error)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: profile?.name || profile?.companyName,
        text: profile?.bio || profile?.companySlogan,
        url: window.location.href
      })
    }
  }

  const getSectionIcon = (section: string) => {
    switch(section) {
      case "overview": return <Building2 className="w-4 h-4" />
      case "contact": return <Phone className="w-4 h-4" />
      case "social": return <Share2 className="w-4 h-4" />
      case "services": return <Briefcase className="w-4 h-4" />
      case "experience": return <Award className="w-4 h-4" />
      case "education": return <Award className="w-4 h-4" />
      case "features": return <Star className="w-4 h-4" />
      case "ecommerce": return <ShoppingBag className="w-4 h-4" />
      case "documents": return <FileText className="w-4 h-4" />
      case "billing": return <CreditCard className="w-4 h-4" />
      case "location": return <MapPin className="w-4 h-4" />
      default: return <ChevronRight className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return notFound()
  }

  const themeColors = theme ? {
    primary: theme.primaryColor || "#3B82F6",
    secondary: theme.secondaryColor || "#8B5CF6",
    background: theme.backgroundColor || "#030712",
    text: theme.textColor || "#F9FAFB",
    accent: theme.accentColor || "#10B981"
  } : {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    background: "#030712",
    text: "#F9FAFB",
    accent: "#10B981"
  }

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        backgroundColor: themeColors.background,
        color: themeColors.text 
      }}
    >
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {profile.logoUrl && (
                <Image
                  src={profile.logoUrl}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              )}
              <h1 className="text-xl font-bold" style={{ color: themeColors.primary }}>
                {profile.companyName || profile.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                  color: themeColors.background
                }}
              >
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Cover Image */}
            {profile.coverImageUrl && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={profile.coverImageUrl}
                  alt="Cover"
                  fill
                  className="object-cover opacity-30"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden ring-4 ring-white/20">
                    {profile.profileImage ? (
                      <Image
                        src={profile.profileImage}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-4xl font-bold"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {profile.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  {profile.isPremium && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full">
                      PRO
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                    {profile.name}
                  </h1>
                  {profile.title && (
                    <p className="text-xl mb-4 opacity-80">{profile.title}</p>
                  )}
                  {profile.companyName && (
                    <p className="text-lg mb-2 flex items-center justify-center lg:justify-start gap-2">
                      <Building2 className="w-5 h-5" style={{ color: themeColors.accent }} />
                      {profile.companyName}
                    </p>
                  )}
                  {profile.companySlogan && (
                    <p className="text-lg italic opacity-70">{profile.companySlogan}</p>
                  )}
                  {profile.bio && (
                    <p className="mt-4 text-base opacity-80 max-w-2xl">{profile.bio}</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-3">
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:scale-105 transition"
                      style={{ backgroundColor: themeColors.primary + "20" }}
                    >
                      <Phone className="w-5 h-5" style={{ color: themeColors.primary }} />
                      <span>Ara</span>
                    </a>
                  )}
                  {profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:scale-105 transition"
                      style={{ backgroundColor: "#25D366" + "20" }}
                    >
                      <MessageSquare className="w-5 h-5" style={{ color: "#25D366" }} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:scale-105 transition"
                      style={{ backgroundColor: themeColors.secondary + "20" }}
                    >
                      <Mail className="w-5 h-5" style={{ color: themeColors.secondary }} />
                      <span>E-posta</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Navigation */}
      <div className="sticky top-16 z-40 backdrop-blur-xl bg-black/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {[
              "overview", "contact", "social", "services", "experience",
              "education", "features", "ecommerce", "documents", "billing", "location"
            ].filter(section => {
              // Only show sections that have data
              switch(section) {
                case "overview": return true // Always show overview
                case "contact": return profile.phone || profile.email || profile.website || profile.alternativePhone
                case "social": return profile.socialLinks && profile.socialLinks.length > 0
                case "services": return profile.services && profile.services.length > 0
                case "experience": return profile.experiences && profile.experiences.length > 0
                case "education": return profile.educations && profile.educations.length > 0
                case "features": return profile.features && profile.features.length > 0
                case "ecommerce": return profile.shopUrl || profile.catalogUrl
                case "documents": return profile.cvUrl || profile.portfolioUrl || profile.brochureUrl
                case "billing": return profile.companyTitle || profile.taxNumber || (profile.bankAccounts && profile.bankAccounts.length > 0)
                case "location": return profile.address || profile.googleMapsUrl || profile.workingHours
                default: return false
              }
            }).map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  activeSection === section 
                    ? "bg-white/20" 
                    : "hover:bg-white/10"
                }`}
              >
                {getSectionIcon(section)}
                <span className="capitalize">
                  {section === "overview" ? "Genel Bakış" :
                   section === "contact" ? "İletişim" :
                   section === "social" ? "Sosyal Medya" :
                   section === "services" ? "Hizmetler" :
                   section === "experience" ? "Deneyim" :
                   section === "education" ? "Eğitim" :
                   section === "features" ? "Özellikler" :
                   section === "ecommerce" ? "E-Ticaret" :
                   section === "documents" ? "Belgeler" :
                   section === "billing" ? "Fatura" :
                   section === "location" ? "Konum" : section}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Company Info */}
                {(profile.companyDescription || profile.companySector || profile.companyFoundedYear) && (
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Building2 style={{ color: themeColors.primary }} />
                      Şirket Bilgileri
                    </h2>
                    {profile.companyDescription && (
                      <p className="mb-4 opacity-80">{profile.companyDescription}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {profile.companySector && (
                        <div>
                          <p className="text-sm opacity-60">Sektör</p>
                          <p className="font-medium">{profile.companySector}</p>
                        </div>
                      )}
                      {profile.companyFoundedYear && (
                        <div>
                          <p className="text-sm opacity-60">Kuruluş Yılı</p>
                          <p className="font-medium">{profile.companyFoundedYear}</p>
                        </div>
                      )}
                      {profile.companyEmployeeCount && (
                        <div>
                          <p className="text-sm opacity-60">Çalışan Sayısı</p>
                          <p className="font-medium">{profile.companyEmployeeCount}</p>
                        </div>
                      )}
                      {profile.companyLegalName && (
                        <div>
                          <p className="text-sm opacity-60">Ticari Ünvan</p>
                          <p className="font-medium">{profile.companyLegalName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Dynamic Stats - Only show if user has relevant data */}
                {(profile.companyFoundedYear || profile.companyEmployeeCount || profile.googleRating) && (
                  <div className="grid grid-cols-3 gap-4">
                    {profile.companyFoundedYear && (
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <Award className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.accent }} />
                        <p className="text-2xl font-bold">{new Date().getFullYear() - parseInt(profile.companyFoundedYear)}+</p>
                        <p className="text-sm opacity-60">Yıllık Tecrübe</p>
                      </div>
                    )}
                    {profile.companyEmployeeCount && (
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <Users className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.accent }} />
                        <p className="text-2xl font-bold">{profile.companyEmployeeCount}</p>
                        <p className="text-sm opacity-60">Çalışan</p>
                      </div>
                    )}
                    {profile.googleRating && (
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <Star className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.accent }} />
                        <p className="text-2xl font-bold">{profile.googleRating}</p>
                        <p className="text-sm opacity-60">Google Rating</p>
                      </div>
                    )}
                    {/* Show a default stat card if no specific data is available */}
                    {!profile.companyFoundedYear && !profile.companyEmployeeCount && !profile.googleRating && (
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: themeColors.accent }} />
                        <p className="text-2xl font-bold">Aktif</p>
                        <p className="text-sm opacity-60">Durum</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Contact Section */}
            {activeSection === "contact" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Phone style={{ color: themeColors.primary }} />
                    İletişim Bilgileri
                  </h2>
                  <div className="space-y-4">
                    {profile.phone && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5" style={{ color: themeColors.primary }} />
                          <div>
                            <p className="text-sm opacity-60">Telefon</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                        <a
                          href={`tel:${profile.phone}`}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                        >
                          Ara
                        </a>
                      </div>
                    )}
                    {profile.alternativePhone && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5" style={{ color: themeColors.primary }} />
                          <div>
                            <p className="text-sm opacity-60">Alternatif Telefon</p>
                            <p className="font-medium">{profile.alternativePhone}</p>
                          </div>
                        </div>
                        <a
                          href={`tel:${profile.alternativePhone}`}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                        >
                          Ara
                        </a>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5" style={{ color: themeColors.secondary }} />
                          <div>
                            <p className="text-sm opacity-60">E-posta</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                        <a
                          href={`mailto:${profile.email}`}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                        >
                          Mail Gönder
                        </a>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="text-sm opacity-60">Web Sitesi</p>
                            <p className="font-medium">{profile.website}</p>
                          </div>
                        </div>
                        <a
                          href={profile.website}
                          target="_blank"
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                        >
                          Ziyaret Et
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Media Section */}
            {activeSection === "social" && profile.socialLinks && profile.socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Share2 style={{ color: themeColors.primary }} />
                    Sosyal Medya
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.socialLinks.map((link: any, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        {link.platform === "LinkedIn" && <Linkedin className="w-6 h-6" style={{ color: "#0A66C2" }} />}
                        {link.platform === "Instagram" && <Instagram className="w-6 h-6" style={{ color: "#E4405F" }} />}
                        {link.platform === "Twitter" && <Twitter className="w-6 h-6" style={{ color: "#1DA1F2" }} />}
                        {link.platform === "Facebook" && <Facebook className="w-6 h-6" style={{ color: "#1877F2" }} />}
                        {link.platform === "YouTube" && <Youtube className="w-6 h-6" style={{ color: "#FF0000" }} />}
                        {link.platform === "GitHub" && <Github className="w-6 h-6" />}
                        <span className="font-medium">{link.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services Section */}
            {activeSection === "services" && profile.services && profile.services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase style={{ color: themeColors.primary }} />
                    Hizmetlerimiz
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.services.map((service: any, index: number) => (
                      <motion.div 
                        key={index} 
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                      >
                        {service.image && (
                          <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                            <Image
                              src={service.image}
                              alt={service.name}
                              width={400}
                              height={160}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-xl">{service.name}</h3>
                          {service.price && (
                            <span className="text-sm font-bold px-3 py-1.5 rounded-full animate-pulse" style={{ 
                              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                              color: themeColors.background 
                            }}>
                              {service.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-80 line-clamp-3">{service.description}</p>
                        <button className="mt-4 w-full py-2 rounded-lg font-medium transition hover:scale-105" style={{
                          backgroundColor: themeColors.primary + '20',
                          color: themeColors.primary
                        }}>
                          Detaylı Bilgi
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && profile.experiences && profile.experiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award style={{ color: themeColors.primary }} />
                    Deneyimler
                  </h2>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    
                    <div className="space-y-6">
                      {profile.experiences.map((exp: any, index: number) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex gap-4"
                        >
                          {/* Timeline dot */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ 
                              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                            }}>
                              <Briefcase className="w-6 h-6" style={{ color: themeColors.background }} />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-5 hover:from-white/15 hover:to-white/10 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-xl mb-1">{exp.title}</h3>
                                <p className="font-medium text-lg" style={{ color: themeColors.accent }}>{exp.company}</p>
                              </div>
                              <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/10">
                                {exp.period}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm opacity-80 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Education Section */}
            {activeSection === "education" && profile.educations && profile.educations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award style={{ color: themeColors.primary }} />
                    Eğitim
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.educations.map((edu: any, index: number) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all border border-white/10 hover:border-white/20 overflow-hidden"
                      >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                          <Award className="w-full h-full" style={{ color: themeColors.primary }} />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-xl mb-1">{edu.degree}</h3>
                              <p className="font-medium text-lg" style={{ color: themeColors.accent }}>
                                {edu.school}
                              </p>
                            </div>
                            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ 
                              backgroundColor: themeColors.primary + '20',
                              color: themeColors.primary
                            }}>
                              {edu.year}
                            </span>
                          </div>
                          {edu.description && (
                            <p className="text-sm opacity-80 leading-relaxed mt-3">{edu.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features Section */}
            {activeSection === "features" && profile.features && profile.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star style={{ color: themeColors.primary }} />
                    Özellikler
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.features.map((feature: any, index: number) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all border border-white/10 hover:border-white/20 overflow-hidden group"
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0" style={{
                            background: `radial-gradient(circle at 50% 50%, ${themeColors.primary}20, transparent 70%)`
                          }} />
                        </div>
                        
                        <div className="relative z-10 flex items-start gap-4">
                          {feature.icon ? (
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ 
                              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                            }}>
                              <span className="text-2xl">{feature.icon}</span>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ 
                              backgroundColor: themeColors.accent + '20' 
                            }}>
                              <Star className="w-6 h-6" style={{ color: themeColors.accent }} />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{feature.name}</h3>
                            {feature.description && (
                              <p className="text-sm opacity-80 leading-relaxed">{feature.description}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* E-Commerce Section */}
            {activeSection === "ecommerce" && (profile.shopUrl || profile.catalogUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <ShoppingBag style={{ color: themeColors.primary }} />
                    E-Ticaret
                  </h2>
                  <div className="space-y-4">
                    {profile.shopUrl && (
                      <a
                        href={profile.shopUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">Online Mağaza</p>
                            <p className="text-sm opacity-60">Ürünlerimizi keşfedin</p>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {profile.catalogUrl && (
                      <a
                        href={profile.catalogUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">Ürün Kataloğu</p>
                            <p className="text-sm opacity-60">Tüm ürünlerimiz</p>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Documents Section */}
            {activeSection === "documents" && (profile.cvUrl || profile.portfolioUrl || profile.brochureUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText style={{ color: themeColors.primary }} />
                    Belgeler
                  </h2>
                  <div className="space-y-4">
                    {profile.cvUrl && (
                      <a
                        href={profile.cvUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">CV / Özgeçmiş</p>
                            <p className="text-sm opacity-60">PDF formatında indir</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">Portfolyo</p>
                            <p className="text-sm opacity-60">Çalışmalarımızı inceleyin</p>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {profile.brochureUrl && (
                      <a
                        href={profile.brochureUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">Broşür</p>
                            <p className="text-sm opacity-60">Şirket broşürü</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Section */}
            {activeSection === "billing" && (profile.companyTitle || profile.taxNumber) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard style={{ color: themeColors.primary }} />
                    Fatura Bilgileri
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {profile.companyTitle && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">Firma Ünvanı</p>
                        <p className="font-medium">{profile.companyTitle}</p>
                      </div>
                    )}
                    {profile.taxOffice && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">Vergi Dairesi</p>
                        <p className="font-medium">{profile.taxOffice}</p>
                      </div>
                    )}
                    {profile.taxNumber && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">Vergi Numarası</p>
                        <p className="font-medium">{profile.taxNumber}</p>
                      </div>
                    )}
                    {profile.tradeRegisterNo && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">Ticaret Sicil No</p>
                        <p className="font-medium">{profile.tradeRegisterNo}</p>
                      </div>
                    )}
                    {profile.mersisNo && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">MERSİS No</p>
                        <p className="font-medium">{profile.mersisNo}</p>
                      </div>
                    )}
                    {profile.billingAddress && (
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm opacity-60">Fatura Adresi</p>
                        <p className="font-medium">{profile.billingAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bank Accounts */}
                {profile.bankAccounts && profile.bankAccounts.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <DollarSign style={{ color: themeColors.secondary }} />
                      Banka Hesapları
                    </h3>
                    <div className="space-y-3">
                      {profile.bankAccounts.map((account: any, index: number) => (
                        <div key={index} className="p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{account.bankName}</p>
                              <p className="text-sm opacity-60">{account.accountName}</p>
                              <p className="text-sm font-mono mt-1">{account.iban}</p>
                            </div>
                            <button
                              onClick={() => handleCopy(account.iban)}
                              className="p-2 rounded-lg hover:bg-white/10 transition"
                            >
                              {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Location Section */}
            {activeSection === "location" && (profile.address || profile.googleMapsUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MapPin style={{ color: themeColors.primary }} />
                    Konum Bilgileri
                  </h2>
                  <div className="space-y-4">
                    {profile.address && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 mt-1" style={{ color: themeColors.accent }} />
                          <div className="flex-1">
                            <p className="font-medium mb-1">Adres</p>
                            <p className="opacity-80">{profile.address}</p>
                            {(profile.district || profile.city) && (
                              <p className="opacity-60 text-sm mt-1">
                                {profile.district && `${profile.district}, `}
                                {profile.city} {profile.postalCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {profile.workingHours && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 mt-1" style={{ color: themeColors.accent }} />
                          <div className="flex-1">
                            <p className="font-medium mb-2">Çalışma Saatleri</p>
                            <div className="space-y-1 text-sm opacity-80">
                              {profile.workingHours.weekdays && (
                                <p>Hafta içi: {profile.workingHours.weekdays}</p>
                              )}
                              {profile.workingHours.saturday && (
                                <p>Cumartesi: {profile.workingHours.saturday}</p>
                              )}
                              {profile.workingHours.sunday && (
                                <p>Pazar: {profile.workingHours.sunday}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.googleMapsUrl && (
                      <a
                        href={profile.googleMapsUrl}
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Navigation className="w-6 h-6" style={{ color: themeColors.accent }} />
                          <div>
                            <p className="font-medium">Google Maps'te Görüntüle</p>
                            <p className="text-sm opacity-60">Yol tarifi al</p>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <QrCode style={{ color: themeColors.primary }} />
                QR Kod
              </h3>
              <div className="bg-white p-4 rounded-xl">
                <div className="aspect-square relative">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-center mt-3 opacity-60">
                QR kodu tarayarak profili paylaşın
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Hızlı Bilgiler</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Durum</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Üyelik</span>
                  <span style={{ color: themeColors.accent }}>
                    {profile.isPremium ? "Premium" : "Standart"}
                  </span>
                </div>
                {/* Only show view count if we have analytics data */}
                {profile.viewCount && (
                  <div className="flex items-center justify-between">
                    <span className="opacity-60">Profil Görüntüleme</span>
                    <span>{profile.viewCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: themeColors.primary }} />
              <span className="font-medium">Powered by QART NFC</span>
            </div>
            <p className="text-sm opacity-60">
              Dijital kartvizit teknolojisi ile güçlendirilmiştir
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}