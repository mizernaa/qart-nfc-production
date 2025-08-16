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
  ArrowUp, Menu, X, Send, User, GraduationCap, Package, Sparkles,
  Eye, HeartHandshake, Flame, Crown, Diamond, Gem
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import QRCode from "qrcode"

// Epic Animated Background Component
const EpicBackground = ({ theme }: { theme: any }) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse at top, ${theme?.primaryColor || '#f59e0b'}15, ${theme?.backgroundColor || '#000000'}), 
                      linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}08, ${theme?.secondaryColor || '#d97706'}12, ${theme?.backgroundColor || '#000000'})`
        }}
      />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${theme?.primaryColor || '#f59e0b'}40, transparent)`,
              width: `${120 + Math.random() * 80}px`,
              height: `${120 + Math.random() * 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={theme?.primaryColor || '#f59e0b'} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  )
}

// Epic 3D Card Component with Glow Effects
const EpicCard = ({ children, className = "", theme }: { children: React.ReactNode, className?: string, theme?: any }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x: x * 100, y: y * 100 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: 2
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${theme?.primaryColor || '#f59e0b'}40, transparent 50%)`,
          transform: 'translateZ(-10px)'
        }}
      />
      
      {/* Card Content */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {/* Shine Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${theme?.primaryColor || '#f59e0b'}15, transparent 60%)`
          }}
        />
        {children}
      </div>
    </motion.div>
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

// Server-side function to fetch profile data
async function getProfileData(slug: string) {
  try {
    // Clean slug for Turkish characters
    const cleanSlug = slug
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
    
    console.log('🔧 Server-side profile fetch:', { slug, cleanSlug })
    
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3013'
    const response = await fetch(`${baseUrl}/api/profile/${cleanSlug}`, {
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      console.error('Profile API error:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    if (!data.success) {
      console.error('Profile data error:', data.message)
      return null
    }
    
    console.log('✅ Server-side profile loaded:', data.profile.name)
    return data.profile
  } catch (error) {
    console.error('Server-side profile fetch error:', error)
    return null
  }
}

// Server-side function to fetch theme data  
async function getThemeData(themeId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3013'
    const response = await fetch(`${baseUrl}/api/theme/${themeId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.success ? data.theme : null
  } catch (error) {
    console.error('Theme fetch error:', error)
    return {
      id: "default",
      name: "Default",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#FFFFFF", 
      textColor: "#1F2937"
    }
  }
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
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: theme?.backgroundColor || '#000000',
            color: theme?.textColor || '#ffffff',
            border: `1px solid ${theme?.primaryColor || '#f59e0b'}40`,
            borderRadius: '12px',
            backdropFilter: 'blur(20px)'
          }
        }}
      />
      <EpicBackground theme={theme} />
      
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
                <img src={profile.logoUrl} alt={profile.companyName} className="h-16 w-auto max-w-[200px] object-contain" />
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
              {[
                "Hakkımda",
                ...(profile.companyName || profile.companySector ? ["Hizmetler"] : []),
                ...(profile.companyFoundedYear || profile.companyEmployeeCount ? ["Deneyim"] : []),
                "İletişim"
              ].map((item, i) => (
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
                {[
                  "Hakkımda",
                  ...(profile.companyName || profile.companySector ? ["Hizmetler"] : []),
                  ...(profile.companyFoundedYear || profile.companyEmployeeCount ? ["Deneyim"] : []),
                  "İletişim"
                ].map((item) => (
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

      {/* 🚀 EPIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 z-10">
          {[Crown, Diamond, Sparkles, Gem].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + i * 15}%`,
                color: theme?.primaryColor || '#f59e0b'
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-20">
          {/* 🎯 Left Side - Epic Info Display */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="space-y-10"
          >
            {/* Professional Status Badge - Only show if title exists */}
            {profile.title && (
              <motion.div 
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-xl"
                style={{
                  borderColor: `${theme?.primaryColor || '#f59e0b'}40`,
                  background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}10, ${theme?.secondaryColor || '#d97706'}10)`,
                  boxShadow: `0 8px 32px ${theme?.primaryColor || '#f59e0b'}20`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme?.primaryColor || '#f59e0b' }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme?.primaryColor || '#f59e0b' }}
                >
                  {profile.title || profile.companyName ? 'Profesyonel' : 'Aktif'} • Online
                </span>
                <Eye className="w-4 h-4" style={{ color: theme?.primaryColor || '#f59e0b' }} />
              </motion.div>
            )}

            {/* Epic Name Display */}
            <div className="space-y-4">
              <motion.h1 
                className="text-6xl md:text-8xl font-black leading-normal tracking-tight pb-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.span 
                  className="block bg-clip-text text-transparent relative"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'} 0%, ${theme?.secondaryColor || '#d97706'} 50%, ${theme?.primaryColor || '#f59e0b'} 100%)`,
                    filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: `0 0 30px ${theme?.primaryColor || '#f59e0b'}80`
                  }}
                >
                  {profile.name}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </motion.span>
              </motion.h1>
              
              {/* Title with animation */}
              <motion.p 
                className="text-3xl md:text-4xl font-bold opacity-90 pb-2"
                style={{ color: theme?.textColor || '#ffffff' }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {profile.title}
              </motion.p>
              
              {/* Company with crown */}
              {profile.companyName && (
                <motion.p 
                  className="text-2xl font-semibold flex items-center gap-2"
                  style={{ color: theme?.primaryColor || '#f59e0b' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Crown className="w-6 h-6" />
                  {profile.companyName}
                </motion.p>
              )}
            </div>

            {/* Bio with typewriter effect */}
            <motion.p 
              className="text-xl leading-relaxed"
              style={{ color: theme?.textColor || '#ffffff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {profile.bio}
            </motion.p>

            {/* Epic Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.button
                onClick={handleVCardDownload}
                className="group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}, ${theme?.secondaryColor || '#d97706'})`,
                  boxShadow: `0 10px 30px ${theme?.primaryColor || '#f59e0b'}40`,
                  color: theme?.backgroundColor || '#000000'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 15px 40px ${theme?.primaryColor || '#f59e0b'}60`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <Download className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Rehbere Ekle</span>
                <HeartHandshake className="w-5 h-5 relative z-10" />
              </motion.button>
              
              <motion.button
                onClick={handleShare}
                className="group px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 backdrop-blur-xl"
                style={{
                  border: `2px solid ${theme?.primaryColor || '#f59e0b'}60`,
                  background: `${theme?.primaryColor || '#f59e0b'}10`,
                  color: theme?.textColor || '#ffffff'
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: `${theme?.primaryColor || '#f59e0b'}20`,
                  borderColor: `${theme?.primaryColor || '#f59e0b'}80`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-6 h-6" />
                <span>Paylaş</span>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Epic Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {profile.companyFoundedYear && (
                <EpicCard theme={theme} className="group cursor-pointer">
                  <div className="text-center p-6 space-y-2">
                    <motion.div 
                      className="text-4xl font-black"
                      style={{ color: theme?.primaryColor || '#f59e0b' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {new Date().getFullYear() - parseInt(profile.companyFoundedYear)}+
                    </motion.div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: theme?.textColor || '#ffffff' }}
                    >
                      🏆 Yıllık Deneyim
                    </div>
                  </div>
                </EpicCard>
              )}
              
              {profile.companyEmployeeCount && (
                <EpicCard theme={theme} className="group cursor-pointer">
                  <div className="text-center p-6 space-y-2">
                    <motion.div 
                      className="text-4xl font-black"
                      style={{ color: theme?.primaryColor || '#f59e0b' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {profile.companyEmployeeCount}
                    </motion.div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: theme?.textColor || '#ffffff' }}
                    >
                      👥 Takım Üyesi
                    </div>
                  </div>
                </EpicCard>
              )}
              
              {profile.workingHours ? (
                <EpicCard theme={theme} className="group cursor-pointer">
                  <div className="text-center p-6 space-y-2">
                    <motion.div 
                      className="text-2xl font-black"
                      style={{ color: theme?.primaryColor || '#f59e0b' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {profile.workingHours.weekdays || 'Vardiya'}
                    </motion.div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: theme?.textColor || '#ffffff' }}
                    >
                      📅 Çalışma Saatleri
                    </div>
                  </div>
                </EpicCard>
              ) : (
                <EpicCard theme={theme} className="group cursor-pointer">
                  <div className="text-center p-6 space-y-2">
                    <motion.div 
                      className="text-4xl font-black"
                      style={{ color: theme?.primaryColor || '#f59e0b' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Online
                    </motion.div>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: theme?.textColor || '#ffffff' }}
                    >
                      ⚡ Aktif
                    </div>
                  </div>
                </EpicCard>
              )}
            </motion.div>
          </motion.div>

          {/* 🎨 Right Side - Epic Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="relative"
          >
            {/* Background glow */}
            <div 
              className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
              style={{
                background: `radial-gradient(ellipse, ${theme?.primaryColor || '#f59e0b'}, ${theme?.secondaryColor || '#d97706'})`,
                transform: 'scale(1.1)'
              }}
            />
            
            <EpicCard theme={theme} className="max-w-md mx-auto">
              <div className="relative p-8 space-y-8">
                {/* Header with floating icons */}
                <motion.div 
                  className="text-center relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="absolute -top-2 -right-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Crown className="w-8 h-8" style={{ color: theme?.primaryColor || '#f59e0b' }} />
                    </motion.div>
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme?.textColor || '#ffffff' }}
                  >
                    📱 {profile.companyName ? `${profile.companyName} Kartı` : 'Dijital Kartvizit'}
                  </h3>
                  <div 
                    className="h-1 w-20 mx-auto rounded-full"
                    style={{ background: `linear-gradient(to right, ${theme?.primaryColor || '#f59e0b'}, ${theme?.secondaryColor || '#d97706'})` }}
                  />
                </motion.div>

                {/* Epic Profile Image */}
                <motion.div 
                  className="relative mx-auto w-48 h-48"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
                >
                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-dashed opacity-30"
                    style={{ borderColor: theme?.primaryColor || '#f59e0b' }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-2 rounded-full blur-xl opacity-40 animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${theme?.primaryColor || '#f59e0b'}, ${theme?.secondaryColor || '#d97706'})`
                    }}
                  />
                  
                  {/* Profile image or placeholder */}
                  {profile.profileImage ? (
                    <motion.img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="relative w-full h-full object-cover rounded-full border-4 z-10"
                      style={{ 
                        borderColor: theme?.primaryColor || '#f59e0b',
                        boxShadow: `0 0 40px ${theme?.primaryColor || '#f59e0b'}40`
                      }}
                      whileHover={{ scale: 1.05, rotateZ: 5 }}
                    />
                  ) : (
                    <motion.div 
                      className="relative w-full h-full rounded-full flex items-center justify-center border-4 z-10"
                      style={{
                        background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}, ${theme?.secondaryColor || '#d97706'})`,
                        borderColor: theme?.primaryColor || '#f59e0b',
                        boxShadow: `0 0 40px ${theme?.primaryColor || '#f59e0b'}40`
                      }}
                      whileHover={{ scale: 1.05, rotateZ: 5 }}
                    >
                      <User className="w-20 h-20 text-white/70" />
                    </motion.div>
                  )}
                  
                  {/* Floating sparkles */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + i * 25}%`,
                        color: theme?.primaryColor || '#f59e0b'
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Epic Contact Buttons */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, staggerChildren: 0.1 }}
                >
                  {profile.phone && (
                    <motion.a
                      href={`tel:${profile.phone}`}
                      className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}10, ${theme?.secondaryColor || '#d97706'}10)`,
                        border: `1px solid ${theme?.primaryColor || '#f59e0b'}30`,
                        color: theme?.textColor || '#ffffff'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: `${theme?.primaryColor || '#f59e0b'}20`,
                        borderColor: `${theme?.primaryColor || '#f59e0b'}60`
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: `${theme?.primaryColor || '#f59e0b'}20` }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Phone 
                            className="w-5 h-5"
                            style={{ color: theme?.primaryColor || '#f59e0b' }}
                          />
                        </motion.div>
                        <div>
                          <span className="text-sm opacity-70">Telefon</span>
                          <div className="font-semibold">{profile.phone}</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ChevronRight 
                          className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ color: theme?.primaryColor || '#f59e0b' }}
                        />
                      </motion.div>
                    </motion.a>
                  )}
                  
                  {profile.email && (
                    <motion.a
                      href={`mailto:${profile.email}`}
                      className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}10, ${theme?.secondaryColor || '#d97706'}10)`,
                        border: `1px solid ${theme?.primaryColor || '#f59e0b'}30`,
                        color: theme?.textColor || '#ffffff'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: `${theme?.primaryColor || '#f59e0b'}20`,
                        borderColor: `${theme?.primaryColor || '#f59e0b'}60`
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: `${theme?.primaryColor || '#f59e0b'}20` }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Mail 
                            className="w-5 h-5"
                            style={{ color: theme?.primaryColor || '#f59e0b' }}
                          />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm opacity-70">E-posta</span>
                          <div className="font-semibold truncate">{profile.email}</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      >
                        <ChevronRight 
                          className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ color: theme?.primaryColor || '#f59e0b' }}
                        />
                      </motion.div>
                    </motion.a>
                  )}
                  
                  {profile.whatsapp && (
                    <motion.a
                      href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 backdrop-blur-xl"
                      style={{
                        background: `linear-gradient(135deg, #25D366 10, #128C7E 10)`,
                        border: `1px solid #25D36630`,
                        color: '#ffffff'
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: '#25D366 20',
                        borderColor: '#25D366 60'
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="p-2 rounded-xl bg-green-500/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <MessageCircle className="w-5 h-5 text-green-400" />
                        </motion.div>
                        <div>
                          <span className="text-sm opacity-70">WhatsApp</span>
                          <div className="font-semibold">Mesaj Gönder</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <ChevronRight 
                          className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#25D366' }}
                        />
                      </motion.div>
                    </motion.a>
                  )}
                  
                  {/* QR Code Section */}
                  {qrCodeUrl && (
                    <motion.div
                      className="text-center p-6 rounded-2xl backdrop-blur-xl border"
                      style={{
                        background: `linear-gradient(135deg, ${theme?.primaryColor || '#f59e0b'}05, ${theme?.secondaryColor || '#d97706'}05)`,
                        borderColor: `${theme?.primaryColor || '#f59e0b'}30`
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      <motion.div
                        className="inline-block p-4 rounded-2xl bg-white"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        style={{
                          boxShadow: `0 10px 30px ${theme?.primaryColor || '#f59e0b'}20`
                        }}
                      >
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-32 h-32 mx-auto"
                        />
                      </motion.div>
                      <div className="mt-4">
                        <h4 
                          className="font-bold mb-1"
                          style={{ color: theme?.textColor || '#ffffff' }}
                        >
                          📱 QR Kod ile Bağlan
                        </h4>
                        <p className="text-sm opacity-70" style={{ color: theme?.textColor || '#ffffff' }}>
                          Telefon kamerasıyla tarayın
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </EpicCard>
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
      {(profile.companyDescription || profile.companySlogan || profile.companyLegalName || profile.companySector || profile.companyFoundedYear || profile.companyEmployeeCount) && (
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

            <div className={`grid gap-8 ${
              (profile.companyLegalName || profile.companySector || profile.companyFoundedYear || profile.companyEmployeeCount) && 
              (profile.companyDescription || profile.bio) 
                ? 'md:grid-cols-2' 
                : 'md:grid-cols-1 max-w-2xl mx-auto'
            }`}>
              {/* Company info card - only show if there's company data */}
              {(profile.companyLegalName || profile.companySector || profile.companyFoundedYear || profile.companyEmployeeCount) && (
                <EpicCard theme={theme}>
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
                </EpicCard>
              )}

              {/* Mission card - only show if there's description or bio */}
              {(profile.companyDescription || profile.bio) && (
                <EpicCard theme={theme}>
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
                      {profile.companyDescription ? 'Hakkımızda' : 'Profil'}
                    </h3>
                    <p 
                      className="leading-relaxed opacity-90"
                      style={{ color: theme?.textColor || "#ffffff" }}
                    >
                      {profile.companyDescription || profile.bio}
                    </p>
                  </div>
                </EpicCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section - Only show if company data exists */}
      {(profile.companyName || profile.companySector || profile.companyDescription) && (
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
                  {profile.companySector ? 'Faaliyet Alanımız' : 'Hakkımızda'}
                </span>
              </h2>
              {profile.companyDescription && (
                <p className="text-xl text-gray-400">{profile.companyDescription}</p>
              )}
            </motion.div>

          {/* Only show services section if user has entered company data */}
          {(profile.companyName || profile.companySector || profile.companyDescription) && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.companySector && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <EpicCard theme={theme}>
                    <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                      <Building className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold mb-2">Sektör</h3>
                      <p className="text-gray-400">{profile.companySector}</p>
                    </div>
                  </EpicCard>
                </motion.div>
              )}
              {profile.companyDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <EpicCard theme={theme}>
                    <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                      <Target className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold mb-2">Hizmetlerimiz</h3>
                      <p className="text-gray-400">{profile.companyDescription}</p>
                    </div>
                  </EpicCard>
                </motion.div>
              )}
              {profile.companyEmployeeCount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <EpicCard theme={theme}>
                    <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 transition-all group">
                      <Users className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold mb-2">Ekibimiz</h3>
                      <p className="text-gray-400">{profile.companyEmployeeCount} kişilik profesyonel ekip</p>
                    </div>
                  </EpicCard>
                </motion.div>
              )}
            </div>
          )}
          </div>
        </section>
      )}

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
              <EpicCard theme={theme}>
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
              </EpicCard>

              <EpicCard theme={theme}>
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
              </EpicCard>
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
            {profile.workingHours ? (
              <p className="text-xl text-gray-400">Çalışma saatlerimiz içinde ulaşabilirsiniz</p>
            ) : (
              <p className="text-xl text-gray-400">İletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz</p>
            )}
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className={`grid gap-8 ${qrCodeUrl ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
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
                <EpicCard theme={theme}>
                  <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-cyan-500/20 text-center">
                    <h3 className="text-xl font-bold mb-4">QR Kod ile Paylaş</h3>
                    {qrCodeUrl && (
                      <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg bg-white p-2" />
                    )}
                    <p className="text-sm text-gray-400 mt-4">Kameranızla tarayın</p>
                  </div>
                </EpicCard>
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
              <p className="text-gray-400">© {new Date().getFullYear()} {profile.companyName || profile.name}. Tüm hakları saklıdır.</p>
              {profile.companyLegalName && (
                <p className="text-sm text-gray-500 mt-1">{profile.companyLegalName}</p>
              )}
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