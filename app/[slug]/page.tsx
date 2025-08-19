"use client"

import { useEffect, useState } from "react"
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
  Eye, HeartHandshake, Flame, Crown, Diamond, Gem, QrCode
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import QRCode from "qrcode"

export default function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("about")

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { slug: rawSlug } = await params
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

        console.log('📱 Fetching profile for slug:', cleanSlug)
        
        const response = await fetch(`/api/profile/${cleanSlug}`)
        const data = await response.json()

        if (data.success) {
          console.log('✅ Profile data loaded:', data.profile)
          setProfile(data.profile)
          
          // Generate QR Code
          const currentUrl = window.location.href
          const qr = await QRCode.toDataURL(currentUrl, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          setQrCodeUrl(qr)
        } else {
          console.error('❌ Profile not found')
          notFound()
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [params])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Copy profile link
  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Link kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Share profile
  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.name || 'Dijital Kartvizit',
          text: `${profile?.name} - ${profile?.title || 'Dijital Kartvizit'}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      copyProfileLink()
    }
  }

  // Add to contacts
  const addToContacts = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile?.name || ''}
ORG:${profile?.companyName || ''}
TITLE:${profile?.title || ''}
TEL:${profile?.phone || ''}
EMAIL:${profile?.email || ''}
URL:${profile?.website || ''}
ADR:;;${profile?.address || ''};${profile?.city || ''};${profile?.district || ''};${profile?.postalCode || ''};${profile?.country || ''}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile?.name || 'contact'}.vcf`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Kişi kaydedildi!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return notFound()
  }

  const socialIcons: any = {
    LinkedIn: Linkedin,
    Instagram: Instagram,
    Facebook: Facebook,
    Twitter: Twitter,
    YouTube: Youtube,
    GitHub: Github
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Toaster position="top-center" />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareProfile}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Share2 className="w-6 h-6" />
        </motion.button>
        {profile?.phone && (
          <motion.a
            href={`https://wa.me/${profile.whatsapp || profile.phone}`}
            target="_blank"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.a>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          {profile.profileImage && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                {profile.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Name & Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {profile.name}
          </motion.h1>

          {profile.title && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-6"
            >
              {profile.title}
            </motion.p>
          )}

          {profile.companyName && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-gray-400 mb-8"
            >
              <Building className="w-5 h-5" />
              <span className="text-lg">{profile.companyName}</span>
            </motion.div>
          )}

          {/* Bio */}
          {profile.bio && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={addToContacts}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Kişilere Ekle
            </button>
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-8 py-3 bg-white/10 backdrop-blur rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Ara
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-8 py-3 bg-white/10 backdrop-blur rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                E-posta
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Contact Info */}
        {(profile.phone || profile.email || profile.website || profile.address) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">İletişim Bilgileri</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="bg-white/5 backdrop-blur rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Telefon</p>
                      <p className="text-lg font-semibold">{profile.phone}</p>
                    </div>
                  </div>
                </a>
              )}
              
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="bg-white/5 backdrop-blur rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">E-posta</p>
                      <p className="text-lg font-semibold">{profile.email}</p>
                    </div>
                  </div>
                </a>
              )}
              
              {profile.website && (
                <a href={profile.website} target="_blank" className="bg-white/5 backdrop-blur rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Web Sitesi</p>
                      <p className="text-lg font-semibold">{profile.website}</p>
                    </div>
                  </div>
                </a>
              )}
              
              {profile.address && (
                <div className="bg-white/5 backdrop-blur rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Adres</p>
                      <p className="text-lg font-semibold">{profile.address}</p>
                      {(profile.city || profile.district) && (
                        <p className="text-gray-400">{profile.district} {profile.city}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Company Info */}
        {(profile.companyDescription || profile.companySlogan || profile.companySector) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Şirket Bilgileri</h2>
            <div className="bg-white/5 backdrop-blur rounded-xl p-8">
              {profile.companySlogan && (
                <p className="text-xl text-gray-300 italic mb-6 text-center">"{profile.companySlogan}"</p>
              )}
              {profile.companyDescription && (
                <p className="text-gray-300 mb-6 leading-relaxed">{profile.companyDescription}</p>
              )}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {profile.companySector && (
                  <div className="text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-gray-400 text-sm">Sektör</p>
                    <p className="font-semibold">{profile.companySector}</p>
                  </div>
                )}
                {profile.companyFoundedYear && (
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <p className="text-gray-400 text-sm">Kuruluş Yılı</p>
                    <p className="font-semibold">{profile.companyFoundedYear}</p>
                  </div>
                )}
                {profile.companyEmployeeCount && (
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-gray-400 text-sm">Çalışan Sayısı</p>
                    <p className="font-semibold">{profile.companyEmployeeCount}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Social Media */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Sosyal Medya</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {profile.socialLinks.map((link: any, index: number) => {
                const Icon = socialIcons[link.platform] || Globe
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* QR Code */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">QR Kod</h2>
          <div className="bg-white/5 backdrop-blur rounded-xl p-8 text-center">
            <div className="bg-white rounded-xl p-4 inline-block mb-6">
              <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
            </div>
            <p className="text-gray-400 mb-4">QR kodu taratarak profili kolayca paylaşabilirsiniz</p>
            <button
              onClick={copyProfileLink}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
            </button>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} QART Digital Business Card
          </p>
        </div>
      </footer>
    </div>
  )
}