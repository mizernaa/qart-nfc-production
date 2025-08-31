"use client"

import { useEffect, useState, useRef } from "react"
import { notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
import Link from "next/link"

// Epic Background Component
const EpicBackground = ({ colors }: { colors: any }) => (
  <div className="fixed inset-0 z-0">
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        background: `radial-gradient(circle at 20% 80%, ${colors?.primary || '#3b82f6'} 0%, transparent 50%), 
                     radial-gradient(circle at 80% 20%, ${colors?.secondary || '#8b5cf6'} 0%, transparent 50%), 
                     radial-gradient(circle at 40% 40%, ${colors?.accent || '#06b6d4'} 0%, transparent 50%)`
      }}
    />
    {/* Floating particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-blue-400/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() > 0.5 ? 30 : -30, 0],
          opacity: [0.2, 0.8, 0.2]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
)

// Epic Card Component
const EpicCard = ({ children, className = "", delay = 0, hover = true }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={hover ? { y: -5, scale: 1.02 } : {}}
    className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 
                shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group ${className}`}
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {children}
  </motion.div>
)

// Epic Hero Section
const EpicHero = ({ profile, themeConfig }: any) => {
  const floatingIcons = [Crown, Diamond, Sparkles, Gem]
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Cover Image Background */}
      {profile?.coverImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={profile.coverImageUrl}
            alt="Cover"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />
        </div>
      )}
      
      {!profile?.coverImageUrl && (
        <EpicBackground colors={themeConfig.colors} />
      )}
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Floating Icons */}
        {floatingIcons.map((Icon, i) => (
          <motion.div
            key={i}
            className={`absolute w-8 h-8 text-blue-400/30`}
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + (i % 2) * 20}%`
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            <Icon />
          </motion.div>
        ))}
        
        {/* Profile Image */}
        {profile?.profileImage && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="mx-auto mb-8"
          >
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
              <div className="absolute inset-1 bg-black rounded-full overflow-hidden">
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Status Badge */}
        {themeConfig.visibility.elements.premiumBadge && profile?.isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 
                       border border-amber-400/30 rounded-full text-amber-300 mb-6"
          >
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Kullanıcı</span>
          </motion.div>
        )}
        
        {/* Name with epic animation */}
        {themeConfig.visibility.elements.name && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-4 leading-tight"
          >
            <span 
              className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(to right, ${themeConfig.colors.text}, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {profile?.name || 'Kullanıcı'}
            </span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block ml-2 text-blue-400"
            >
              ✨
            </motion.span>
          </motion.h1>
        )}
        
        {/* Company Logo and Name */}
        {(profile?.companyName || profile?.logoUrl) && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center mb-6"
          >
            {/* Company Logo */}
            {profile?.logoUrl && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
                className="mb-4"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl animate-pulse opacity-30" />
                  <div className="absolute inset-1 bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-400/30">
                    <Image
                      src={profile.logoUrl}
                      alt={profile.companyName || "Company Logo"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Company Name */}
            {profile?.companyName && (
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-blue-200">
                  {profile.companyName}
                </h2>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Bio with typewriter effect */}
        {(profile?.bio || profile?.companySlogan) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {profile.bio || profile.companySlogan}
          </motion.p>
        )}
        
        {/* Action Buttons */}
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
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 
                         text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Ara</span>
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.a>
          )}
          
          {profile?.whatsapp && (
            <motion.a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 
                         text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>WhatsApp</span>
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// Epic Contact Section
const EpicContact = ({ profile, themeConfig }: any) => {
  const [copied, setCopied] = useState('')
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }
  
  const contactItems = [
    { type: 'phone', value: profile?.phone, icon: Phone, label: 'Telefon', color: 'blue' },
    { type: 'email', value: profile?.email, icon: Mail, label: 'E-posta', color: 'purple' },
    { type: 'website', value: profile?.website, icon: Globe, label: 'Website', color: 'green' }
  ].filter(item => item.value)
  
  if (contactItems.length === 0) return null
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              İletişime Geçin
            </span>
          </h2>
          <p className="text-xl text-gray-400">Bize ulaşmak için aşağıdaki yöntemleri kullanabilirsiniz</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {contactItems.map((item, index) => {
            const Icon = item.icon
            return (
              <EpicCard key={item.type} delay={index * 0.1}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 
                                  flex items-center justify-center border border-${item.color}-500/30`}>
                    <Icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
                  <p className="text-gray-300 mb-4">{item.value}</p>
                  <button
                    onClick={() => handleCopy(item.value!, item.type)}
                    className={`flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-${item.color}-600/20 to-${item.color}-700/20 
                               border border-${item.color}-500/30 rounded-xl text-${item.color}-300 hover:text-white transition-all`}
                  >
                    {copied === item.type ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied === item.type ? 'Kopyalandı!' : 'Kopyala'}</span>
                  </button>
                </div>
              </EpicCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Epic Services Section
const EpicServices = ({ profile, themeConfig }: any) => {
  if (!profile?.services || profile.services.length === 0) return null
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Hizmetlerimiz
            </span>
          </h2>
          <p className="text-xl text-gray-400">Size sunduğumuz profesyonel hizmetler</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.services.map((service: any, index: number) => (
            <EpicCard key={index} delay={index * 0.1}>
              <div className="relative">
                {service.imageUrl && (
                  <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                    <Image 
                      src={service.imageUrl} 
                      alt={service.name || service.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold text-white">{service.name || service.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{service.description}</p>
                {service.price && (
                  <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                    <DollarSign className="w-5 h-5" />
                    <span>{service.price}</span>
                  </div>
                )}
              </div>
            </EpicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// Epic Experience Section  
const EpicExperience = ({ profile, themeConfig }: any) => {
  if (!profile?.experiences || profile.experiences.length === 0) return null
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Deneyimlerim
            </span>
          </h2>
          <p className="text-xl text-gray-400">Profesyonel kariyer geçmişim</p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-400" />
          
          <div className="space-y-8">
            {profile.experiences.map((exp: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-8"
              >
                {/* Timeline dot */}
                <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full 
                                flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                
                <EpicCard className="flex-1" hover={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-lg text-blue-300">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{exp.period}</span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-300">{exp.description}</p>
                  )}
                </EpicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Epic Education Section
const EpicEducation = ({ profile, themeConfig }: any) => {
  if (!profile?.educations || profile.educations.length === 0) return null
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Eğitim Geçmişi
            </span>
          </h2>
          <p className="text-xl text-gray-400">Akademik başarılarım</p>
        </motion.div>
        
        <div className="grid gap-6">
          {profile.educations.map((edu: any, index: number) => (
            <EpicCard key={index} delay={index * 0.1}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl 
                                flex items-center justify-center border border-indigo-500/30">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-blue-300 mb-2">{edu.school}</p>
                  <p className="text-sm text-gray-400">{edu.year}</p>
                  {edu.description && (
                    <p className="text-gray-300 mt-2">{edu.description}</p>
                  )}
                </div>
              </div>
            </EpicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// Epic Features Section
const EpicFeatures = ({ profile, themeConfig }: any) => {
  if (!profile?.features || profile.features.length === 0) return null
  
  const getFeatureIcon = (iconName: string) => {
    const icons = {
      shield: Shield,
      award: Award,
      clock: Clock,
      check: CheckCircle,
      star: Star,
      zap: Zap
    }
    return icons[iconName as keyof typeof icons] || Star
  }
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Özelliklerimiz
            </span>
          </h2>
          <p className="text-xl text-gray-400">Size sağladığımız avantajlar</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.features.map((feature: any, index: number) => {
            const Icon = getFeatureIcon(feature.icon)
            return (
              <EpicCard key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-600/20 
                                  flex items-center justify-center border border-yellow-500/30">
                    <Icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.name || feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </EpicCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Epic Social Media Section
const EpicSocial = ({ profile, themeConfig }: any) => {
  if (!profile?.socialLinks || profile.socialLinks.length === 0) return null
  
  const getSocialIcon = (platform: string) => {
    const icons = {
      instagram: Instagram,
      linkedin: Linkedin,
      twitter: Twitter,
      facebook: Facebook,
      youtube: Youtube,
      github: Github
    }
    return icons[platform as keyof typeof icons] || ExternalLink
  }
  
  const getSocialColor = (platform: string) => {
    const colors = {
      instagram: 'pink',
      linkedin: 'blue',
      twitter: 'sky',
      facebook: 'blue',
      youtube: 'red',
      github: 'gray'
    }
    return colors[platform as keyof typeof colors] || 'blue'
  }
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Sosyal Medya
            </span>
          </h2>
          <p className="text-xl text-gray-400">Sosyal medya hesaplarımdan beni takip edin</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {profile.socialLinks.filter((social: any) => social.isVisible).map((social: any, index: number) => {
            const Icon = getSocialIcon(social.platform)
            const color = getSocialColor(social.platform)
            
            return (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 
                           shadow-lg hover:shadow-${color}-500/20 transition-all duration-300 group text-center`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${color}-500/5 to-${color}-600/5 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-${color}-500/20 to-${color}-600/20 
                                flex items-center justify-center border border-${color}-500/30 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 text-${color}-400`} />
                </div>
                <h3 className="text-lg font-bold text-white capitalize">{social.platform}</h3>
                <motion.div
                  className="mt-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                </motion.div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Epic Location Section
const EpicLocation = ({ profile, themeConfig }: any) => {
  if (!profile?.address && !profile?.city && !profile?.googleMapsUrl) return null
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Lokasyonumuz
            </span>
          </h2>
          <p className="text-xl text-gray-400">Bizi ziyaret etmek için adresimiz</p>
        </motion.div>
        
        <EpicCard>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-600/20 
                            flex items-center justify-center border border-emerald-500/30">
              <MapPinIcon className="w-10 h-10 text-emerald-400" />
            </div>
            
            {profile.address && (
              <p className="text-xl text-white mb-2">{profile.address}</p>
            )}
            
            {(profile.city || profile.district) && (
              <p className="text-lg text-gray-300 mb-4">
                {profile.district && `${profile.district}, `}{profile.city}
              </p>
            )}
            
            {profile.googleMapsUrl && (
              <motion.a
                href={profile.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 
                           text-white rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>Haritada Görüntüle</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </EpicCard>
      </div>
    </section>
  )
}

// Epic QR Code Section
const EpicQR = ({ profile, themeConfig, slug }: any) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
              QR Kod
            </span>
          </h2>
          <p className="text-xl text-gray-400">Bu sayfayı paylaşmak için QR kodu taratın</p>
        </motion.div>
        
        <EpicCard>
          <div className="text-center">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl p-4 shadow-lg"
            >
              <div className="w-full h-full relative">
                <Image
                  src={qrUrl}
                  alt="QR Code"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
            <p className="text-gray-300 mb-4">Kameranızı QR koda tutun</p>
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <QrCode className="w-5 h-5" />
              <span className="font-medium">Dijital Kartvizit</span>
            </div>
          </div>
        </EpicCard>
      </div>
    </section>
  )
}

export default function EpicPublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {themeConfig.visibility.sections.hero && <EpicHero profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.contact && <EpicContact profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.services && <EpicServices profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.experience && <EpicExperience profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.education && <EpicEducation profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.features && <EpicFeatures profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.social && <EpicSocial profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.location && <EpicLocation profile={profile} themeConfig={themeConfig} />}
      {themeConfig.visibility.sections.qrCode && <EpicQR profile={profile} themeConfig={themeConfig} slug={slug} />}
      
      {/* Epic Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {profile?.name || profile?.companyName}
            </p>
            <p className="text-gray-400">Dijital Kartvizit</p>
          </motion.div>
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center gap-2 text-blue-300"
          >
            <Sparkles className="w-5 h-5" />
            <span>Powered by QART</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}