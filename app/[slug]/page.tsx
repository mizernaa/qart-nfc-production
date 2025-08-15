"use client"

import { useEffect, useState, useRef } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Phone, Mail, MapPin, Globe, Calendar, Clock, Download, Share2, 
  Copy, CheckCircle, ExternalLink, ChevronRight, Star, Award,
  Briefcase, Users, Building, Facebook, Instagram, Linkedin, 
  Twitter, Youtube, Github, MessageCircle, Shield, Zap, Target,
  TrendingUp, Heart, Coffee, Rocket, Code, Palette, Camera,
  DollarSign, ShoppingBag, FileText, Play, Pause, Volume2, VolumeX,
  ArrowUp, Menu, X, Send, User, GraduationCap, Package
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import QRCode from "qrcode"

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          >
            <div className="w-1 h-1 bg-cyan-500/30 rounded-full blur-sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

// 3D Card Component
const Card3D = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [transform, setTransform] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTransform(`perspective(1000px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(y - 0.5) * -10}deg)`)
  }

  const handleMouseLeave = () => {
    setTransform("")
  }

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Social Icon Component
const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    LinkedIn: <Linkedin className="w-5 h-5" />,
    Instagram: <Instagram className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    YouTube: <Youtube className="w-5 h-5" />,
    GitHub: <Github className="w-5 h-5" />
  }
  return icons[platform] || <Globe className="w-5 h-5" />
}

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [profile, setProfile] = useState<any>(null)
  const [theme, setTheme] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { slug: rawSlug } = await params
        
        // URL decode and clean slug for Turkish characters
        const decodedSlug = decodeURIComponent(rawSlug)
        const cleanSlug = decodedSlug
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        console.log('🔧 URL Debug:', { rawSlug, decodedSlug, cleanSlug })
        
        const response = await fetch(`/api/profile/${cleanSlug}`)
        if (!response.ok) throw new Error("Profile not found")
        const data = await response.json()
        if (!data.success) throw new Error(data.message)
        setProfile(data.profile)
        
        // Fetch theme data
        if (data.profile.themeId) {
          try {
            const themeResponse = await fetch(`/api/theme/${data.profile.themeId}`)
            if (themeResponse.ok) {
              const themeData = await themeResponse.json()
              if (themeData.success) {
                setTheme(themeData.theme)
              }
            }
          } catch (themeError) {
            console.error("Error fetching theme:", themeError)
            // Use default theme if fetch fails
            setTheme({
              id: "default",
              name: "Default",
              primaryColor: "#3B82F6",
              secondaryColor: "#10B981",
              backgroundColor: "#FFFFFF",
              textColor: "#1F2937",
              font: "Inter",
              layout: "modern",
              subscriptionLevel: "Free",
              isDefault: true
            })
          }
        }
        
        // Generate QR Code
        const qr = await QRCode.toDataURL(window.location.href)
        setQrCodeUrl(qr)
      } catch (error) {
        console.error("Error fetching profile:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full animate-spin" />
          <div className="absolute inset-0 w-20 h-20 border-t-4 border-cyan-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profil Bulunamadı</h1>
          <p className="text-gray-400">Bu profil mevcut değil veya erişilemez durumda.</p>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: profile.name,
        text: profile.bio,
        url: window.location.href
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Link kopyalandı!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVCardDownload = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.companyName}
TEL:${profile.phone}
EMAIL:${profile.email}
URL:${profile.website}
ADR:;;${profile.address};;;${profile.country}
NOTE:${profile.bio}
END:VCARD`
    
    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${profile.slug}.vcf`
    a.click()
  }

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden transition-all duration-300"
      style={{
        backgroundColor: theme?.backgroundColor || "#000000",
        color: theme?.textColor || "#ffffff",
        fontFamily: theme?.font || "Inter"
      }}
    >
      <Toaster position="top-right" />
      <ParticleBackground />
      
      {/* Custom Cursor */}
      <div 
        className="fixed w-6 h-6 border-2 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${scrollY > 100 ? 0.5 : 1})`,
          borderColor: theme?.primaryColor || "#06b6d4"
        }}
      />

      {/* Navigation */}
      <nav 
        className="fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-lg"
        style={{
          backgroundColor: scrollY > 50 ? `${theme?.backgroundColor || "#000000"}E6` : "transparent",
          borderBottom: scrollY > 50 ? `1px solid ${theme?.primaryColor || "#06b6d4"}33` : "none"
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt={profile.companyName} className="h-10 w-auto" />
              ) : (
                <div 
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`
                  }}
                >
                  {profile.companyName || profile.name}
                </div>
              )}
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {["Hakkımda", "Hizmetler", "Deneyim", "İletişim"].map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveSection(item.toLowerCase())}
                  className="transition-colors"
                  style={{
                    color: activeSection === item.toLowerCase() ? 
                      (theme?.primaryColor || "#06b6d4") : 
                      (theme?.textColor || "#ffffff")
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme?.primaryColor || "#06b6d4"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = activeSection === item.toLowerCase() ? 
                      (theme?.primaryColor || "#06b6d4") : 
                      (theme?.textColor || "#ffffff")
                  }}
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleShare}
                className="px-6 py-2 rounded-full hover:shadow-lg transition-all"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`,
                  boxShadow: `0 4px 14px 0 ${theme?.primaryColor || "#06b6d4"}40`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 20px 0 ${theme?.primaryColor || "#06b6d4"}60`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 14px 0 ${theme?.primaryColor || "#06b6d4"}40`
                }}
              >
                Paylaş
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-t border-cyan-500/20"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {["Hakkımda", "Hizmetler", "Deneyim", "İletişim"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveSection(item.toLowerCase())
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 hover:text-cyan-400 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"}, ${theme?.primaryColor || "#06b6d4"})`
                  }}
                >
                  {profile.name}
                </span>
              </h1>
              <p 
                className="text-2xl opacity-80"
                style={{ color: theme?.textColor || "#ffffff" }}
              >
                {profile.title}
              </p>
              {profile.companyName && (
                <p 
                  className="text-xl mt-2"
                  style={{ color: theme?.primaryColor || "#06b6d4" }}
                >
                  {profile.companyName}
                </p>
              )}
            </div>

            <p 
              className="text-lg leading-relaxed opacity-80"
              style={{ color: theme?.textColor || "#ffffff" }}
            >
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleVCardDownload}
                className="px-8 py-3 rounded-full hover:shadow-xl transition-all flex items-center space-x-2"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`,
                  boxShadow: `0 10px 25px ${theme?.primaryColor || "#06b6d4"}40`
                }}
              >
                <Download className="w-5 h-5" />
                <span>Rehbere Ekle</span>
              </button>
              
              <button
                onClick={handleShare}
                className="px-8 py-3 rounded-full hover:opacity-80 transition-all flex items-center space-x-2"
                style={{
                  border: `1px solid ${theme?.primaryColor || "#06b6d4"}80`,
                  backgroundColor: `${theme?.primaryColor || "#06b6d4"}20`
                }}
              >
                <Share2 className="w-5 h-5" />
                <span>Paylaş</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {profile.companyFoundedYear && (
                <div 
                  className="text-center p-4 rounded-xl backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                    border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                  }}
                >
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: theme?.primaryColor || "#06b6d4" }}
                  >
                    {new Date().getFullYear() - parseInt(profile.companyFoundedYear)}+
                  </div>
                  <div 
                    className="text-sm opacity-70"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    Yıllık Deneyim
                  </div>
                </div>
              )}
              {profile.companyEmployeeCount && (
                <div 
                  className="text-center p-4 rounded-xl backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                    border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                  }}
                >
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: theme?.primaryColor || "#06b6d4" }}
                  >
                    {profile.companyEmployeeCount}
                  </div>
                  <div 
                    className="text-sm opacity-70"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    Çalışan
                  </div>
                </div>
              )}
              <div 
                className="text-center p-4 rounded-xl backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                  border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                }}
              >
                <div 
                  className="text-3xl font-bold"
                  style={{ color: theme?.primaryColor || "#06b6d4" }}
                >
                  24/7
                </div>
                <div 
                  className="text-sm opacity-70"
                  style={{ color: theme?.textColor || "#ffffff" }}
                >
                  Erişilebilir
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card3D>
              <div 
                className="relative p-8 rounded-3xl backdrop-blur-sm"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${theme?.primaryColor || "#06b6d4"}1A, ${theme?.secondaryColor || "#3b82f6"}1A)`,
                  border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                }}
              >
                {/* Profile Image */}
                <div className="relative mx-auto w-64 h-64 mb-6">
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`
                    }}
                  />
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="relative w-full h-full object-cover rounded-full border-4"
                      style={{ borderColor: `${theme?.primaryColor || "#06b6d4"}80` }}
                    />
                  ) : (
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`
                      }}
                    >
                      <User className="w-32 h-32 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center justify-between p-4 rounded-xl transition-all group"
                      style={{
                        backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                        color: theme?.textColor || "#ffffff"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}1A`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}0D`
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Phone 
                          className="w-5 h-5"
                          style={{ color: theme?.primaryColor || "#06b6d4" }}
                        />
                        <span>{profile.phone}</span>
                      </div>
                      <ChevronRight 
                        className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: theme?.primaryColor || "#06b6d4" }}
                      />
                    </a>
                  )}
                  
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center justify-between p-4 rounded-xl transition-all group"
                      style={{
                        backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                        color: theme?.textColor || "#ffffff"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}1A`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}0D`
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Mail 
                          className="w-5 h-5"
                          style={{ color: theme?.primaryColor || "#06b6d4" }}
                        />
                        <span className="truncate">{profile.email}</span>
                      </div>
                      <ChevronRight 
                        className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: theme?.primaryColor || "#06b6d4" }}
                      />
                    </a>
                  )}
                  
                  {profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl transition-all group"
                      style={{
                        backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                        color: theme?.textColor || "#ffffff"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}1A`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme?.backgroundColor || "#ffffff"}0D`
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-green-400" />
                        <span>WhatsApp</span>
                      </div>
                      <ChevronRight 
                        className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: theme?.secondaryColor || "#3b82f6" }}
                      />
                    </a>
                  )}
                </div>
              </div>
            </Card3D>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-8 h-12 border-2 border-cyan-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-500 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Company Section */}
      {(profile.companyDescription || profile.companySlogan) && (
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme?.primaryColor || "#06b6d4"}, ${theme?.secondaryColor || "#3b82f6"})`
                  }}
                >
                  Şirket Hakkında
                </span>
              </h2>
              {profile.companySlogan && (
                <p 
                  className="text-xl italic opacity-80"
                  style={{ color: theme?.textColor || "#ffffff" }}
                >
                  "{profile.companySlogan}"
                </p>
              )}
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card3D>
                <div 
                  className="p-8 rounded-2xl backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                    border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                  }}
                >
                  <Building 
                    className="w-12 h-12 mb-4"
                    style={{ color: theme?.primaryColor || "#06b6d4" }}
                  />
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    Kurumsal Bilgiler
                  </h3>
                  <div 
                    className="space-y-3 opacity-90"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    {profile.companyLegalName && (
                      <p>
                        <span style={{ color: theme?.primaryColor || "#06b6d4" }}>Resmi Ünvan:</span> {profile.companyLegalName}
                      </p>
                    )}
                    {profile.companySector && (
                      <p>
                        <span style={{ color: theme?.primaryColor || "#06b6d4" }}>Sektör:</span> {profile.companySector}
                      </p>
                    )}
                    {profile.companyFoundedYear && (
                      <p>
                        <span style={{ color: theme?.primaryColor || "#06b6d4" }}>Kuruluş:</span> {profile.companyFoundedYear}
                      </p>
                    )}
                    {profile.companyEmployeeCount && (
                      <p>
                        <span style={{ color: theme?.primaryColor || "#06b6d4" }}>Çalışan Sayısı:</span> {profile.companyEmployeeCount}
                      </p>
                    )}
                  </div>
                </div>
              </Card3D>

              <Card3D>
                <div 
                  className="p-8 rounded-2xl backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme?.backgroundColor || "#ffffff"}0D`,
                    border: `1px solid ${theme?.primaryColor || "#06b6d4"}33`
                  }}
                >
                  <Target 
                    className="w-12 h-12 mb-4"
                    style={{ color: theme?.primaryColor || "#06b6d4" }}
                  />
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    Misyonumuz
                  </h3>
                  <p 
                    className="leading-relaxed opacity-90"
                    style={{ color: theme?.textColor || "#ffffff" }}
                  >
                    {profile.companyDescription || profile.bio}
                  </p>
                </div>
              </Card3D>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Hizmetlerimiz
              </span>
            </h2>
            <p className="text-xl text-gray-400">Sizin için neler yapabiliriz?</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code, title: "Web Geliştirme", desc: "Modern ve responsive web siteleri" },
              { icon: Palette, title: "UI/UX Tasarım", desc: "Kullanıcı odaklı arayüz tasarımları" },
              { icon: Rocket, title: "Dijital Pazarlama", desc: "Online varlığınızı güçlendirin" },
              { icon: Shield, title: "Güvenlik", desc: "Verilerinizi koruyun" },
              { icon: Zap, title: "Performans", desc: "Hızlı ve optimize çözümler" },
              { icon: Heart, title: "Destek", desc: "7/24 teknik destek" }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                    <service.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      {(profile.address || profile.googleMapsUrl) && (
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Lokasyon
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card3D>
                <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-cyan-500/20">
                  <MapPin className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Adres Bilgileri</h3>
                  <div className="space-y-3 text-gray-300">
                    {profile.address && <p>{profile.address}</p>}
                    {profile.district && <p>{profile.district}</p>}
                    {profile.city && <p>{profile.city}</p>}
                    {profile.postalCode && <p>Posta Kodu: {profile.postalCode}</p>}
                    {profile.country && <p>{profile.country}</p>}
                  </div>

                  {profile.workingHours && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2 text-cyan-400">Çalışma Saatleri</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>Hafta içi: {profile.workingHours.weekdays}</p>
                        <p>Cumartesi: {profile.workingHours.saturday}</p>
                        <p>Pazar: {profile.workingHours.sunday}</p>
                      </div>
                    </div>
                  )}

                  {profile.googleMapsUrl && (
                    <a
                      href={profile.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Haritada Göster</span>
                    </a>
                  )}
                </div>
              </Card3D>

              <Card3D>
                <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-cyan-500/20">
                  <Clock className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Şu Anki Saat</h3>
                  <div className="text-5xl font-bold text-cyan-400 mb-4">
                    {currentTime.toLocaleTimeString('tr-TR')}
                  </div>
                  <p className="text-gray-400">
                    {currentTime.toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </Card3D>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                İletişime Geçin
              </span>
            </h2>
            <p className="text-xl text-gray-400">7/24 ulaşabilirsiniz</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center space-x-4 group">
                    <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <Phone className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Telefon</p>
                      <p className="text-lg">{profile.phone}</p>
                    </div>
                  </a>
                )}

                {profile.alternativePhone && (
                  <a href={`tel:${profile.alternativePhone}`} className="flex items-center space-x-4 group">
                    <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <Phone className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Alternatif Telefon</p>
                      <p className="text-lg">{profile.alternativePhone}</p>
                    </div>
                  </a>
                )}

                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center space-x-4 group">
                    <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <Mail className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">E-posta</p>
                      <p className="text-lg">{profile.email}</p>
                    </div>
                  </a>
                )}

                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                    <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <Globe className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Website</p>
                      <p className="text-lg">{profile.website}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* QR Code */}
              <div className="flex justify-center items-center">
                <Card3D>
                  <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-cyan-500/20 text-center">
                    <h3 className="text-xl font-bold mb-4">QR Kod ile Paylaş</h3>
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg bg-white p-2" />
                    )}
                    <p className="text-sm text-gray-400 mt-4">Kameranızla tarayın</p>
                  </div>
                </Card3D>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-500/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400">© 2024 {profile.name}. Tüm hakları saklıdır.</p>
              <p className="text-sm text-gray-500 mt-1">
                Powered by <span className="text-cyan-400">QART Digital</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-3 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors"
              >
                <ArrowUp className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}