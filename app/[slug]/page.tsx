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
  DollarSign, TrendingUp, Package, Shield, Heart, Zap,
  Sparkles, Crown, Diamond, Gem, Eye, ArrowRight,
  GraduationCap, MapPinIcon, PhoneCall, Send, Compass
} from "lucide-react"
import Image from "next/image"

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  // Process theme settings and get theme configuration
  const getThemeConfig = () => {
    // Default theme configuration
    const defaultTheme = {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6', 
        accent: '#06b6d4',
        background: '#0f172a',
        text: '#e2e8f0'
      },
      layout: 'centered',
      animation: 'smooth',
      typography: 'sans',
      visibility: {
        sections: {
          hero: true,
          contact: true,
          services: true,
          experience: true,
          education: true,
          features: true,
          social: true,
          location: true,
          qrCode: true
        },
        elements: {
          profileImage: true,
          coverImage: true,
          companyLogo: true,
          name: true,
          title: true,
          bio: true,
          companyName: true,
          companySlogan: true,
          phone: true,
          whatsapp: true,
          email: true,
          website: true,
          address: true,
          workingHours: true,
          socialLinks: true,
          bankAccounts: true,
          downloadCV: true,
          shareButton: true,
          viewCount: true,
          premiumBadge: true
        }
      },
      advanced: {
        animations: { enabled: true, speed: 'normal', type: 'smooth' },
        spacing: { padding: 'normal', margins: 'normal' },
        shadows: { enabled: true, intensity: 'medium' },
        borders: { style: 'rounded', width: 'normal' },
        filters: { blur: false, grayscale: false, brightness: 100 }
      }
    }
    
    // If user has theme settings, merge with defaults
    if (profile?.themeSettings) {
      try {
        const userSettings = typeof profile.themeSettings === 'string' 
          ? JSON.parse(profile.themeSettings) 
          : profile.themeSettings
        
        return {
          colors: { ...defaultTheme.colors, ...userSettings.colors },
          layout: userSettings.layout || defaultTheme.layout,
          animation: userSettings.animation || defaultTheme.animation,
          typography: userSettings.typography || defaultTheme.typography,
          visibility: {
            sections: { ...defaultTheme.visibility.sections, ...userSettings.visibility?.sections },
            elements: { ...defaultTheme.visibility.elements, ...userSettings.visibility?.elements }
          },
          advanced: {
            animations: { ...defaultTheme.advanced.animations, ...userSettings.advanced?.animations },
            spacing: { ...defaultTheme.advanced.spacing, ...userSettings.advanced?.spacing },
            shadows: { ...defaultTheme.advanced.shadows, ...userSettings.advanced?.shadows },
            borders: { ...defaultTheme.advanced.borders, ...userSettings.advanced?.borders },
            filters: { ...defaultTheme.advanced.filters, ...userSettings.advanced?.filters }
          }
        }
      } catch (error) {
        console.error('Error parsing theme settings:', error)
        return defaultTheme
      }
    }
    
    return defaultTheme
  }

  // Get theme configuration
  const themeConfig = getThemeConfig()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-xl text-gray-400">Profil yükleniyor...</p>
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen text-white overflow-hidden" 
         style={{ background: `linear-gradient(135deg, ${themeConfig.colors.background}, #000000)` }}>
      
      {/* Basic Hero Section with Theme Colors */}
      {themeConfig.visibility.sections.hero && (
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 20% 80%, ${themeConfig.colors.primary} 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, ${themeConfig.colors.secondary} 0%, transparent 50%), 
                           radial-gradient(circle at 40% 40%, ${themeConfig.colors.accent} 0%, transparent 50%)`
              }}
            />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {themeConfig.visibility.elements.name && (
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-black mb-4 leading-tight"
                style={{ 
                  color: themeConfig.colors.text 
                }}
              >
                {profile?.name || 'Kullanıcı'}
              </motion.h1>
            )}
            
            {themeConfig.visibility.elements.title && profile?.title && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-400 mb-4"
              >
                {profile.title}
              </motion.p>
            )}
            
            {themeConfig.visibility.elements.bio && profile?.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                {profile.bio}
              </motion.p>
            )}
            
            {/* Basic Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {profile?.phone && (
                <motion.a
                  href={`tel:${profile.phone}`}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all"
                  style={{ 
                    background: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})` 
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <span>Ara</span>
                </motion.a>
              )}
              
              {profile?.email && (
                <motion.a
                  href={`mailto:${profile.email}`}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-all"
                  style={{ 
                    background: `linear-gradient(to right, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent})` 
                  }}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </motion.a>
              )}
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Simplified Contact Info */}
      {themeConfig.visibility.sections.contact && (profile?.phone || profile?.email || profile?.website) && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" 
                  style={{ color: themeConfig.colors.primary }}>
                İletişim
              </h2>
            </motion.div>
            
            <div className="grid gap-4">
              {profile?.phone && (
                <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Phone className="w-5 h-5" style={{ color: themeConfig.colors.primary }} />
                  <span className="text-gray-300">Telefon: </span>
                  <a href={`tel:${profile.phone}`} className="text-blue-400 hover:text-blue-300">
                    {profile.phone}
                  </a>
                </div>
              )}
              
              {profile?.email && (
                <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Mail className="w-5 h-5" style={{ color: themeConfig.colors.secondary }} />
                  <span className="text-gray-300">Email: </span>
                  <a href={`mailto:${profile.email}`} className="text-blue-400 hover:text-blue-300">
                    {profile.email}
                  </a>
                </div>
              )}
              
              {profile?.website && (
                <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Globe className="w-5 h-5" style={{ color: themeConfig.colors.accent }} />
                  <span className="text-gray-300">Website: </span>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-400 hover:text-blue-300">
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}