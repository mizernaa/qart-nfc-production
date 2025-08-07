"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { 
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Calendar,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Github,
  Download,
  Share2,
  ExternalLink,
  User,
  Building,
  Building2,
  Sparkles,
  Star,
  Award,
  Zap,
  ArrowRight,
  Check,
  Copy,
  QrCode,
  Send,
  Video,
  FileText,
  ChevronDown,
  Heart,
  TrendingUp,
  Target,
  Users,
  Palette,
  Code,
  Smartphone,
  X,
  Navigation,
  Clock,
  CreditCard,
  Shield,
  Headphones,
  Package,
  Truck,
  CheckCircle,
  Info,
  BadgeCheck,
  CalendarDays,
  Home,
  PhoneCall,
  MapPinned,
  Hash,
  Receipt,
  Camera,
  Play,
  Image,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  GraduationCap,
  Award as AwardIcon,
  HandshakeIcon,
  DollarSign,
  Settings,
  BarChart3,
  Megaphone,
  Gift,
  AlertCircle,
  BookOpen,
  Layers,
  Link,
  MoreVertical,
  Eye,
  EyeOff,
  HelpCircle
} from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [copied, setCopied] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showAllServices, setShowAllServices] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  
  // Profil verileri - Visibility ayarları ile birlikte
  const [profile] = useState({
    slug: slug,
    // Üyelik Bilgileri
    isPremium: true,
    subscriptionPlan: "QART Lifetime",
    subscriptionDate: "2024-12-01",
    
    // Görünürlük Ayarları
    visibility: {
      profileImage: true,
      companyLogo: true,
      coverImage: true,
      personalInfo: true,
      companyInfo: true,
      contactInfo: true,
      socialLinks: true,
      customFields: true,
      services: true,
      gallery: true,
      testimonials: true,
      workingHours: true,
      invoiceInfo: true,
      mapLocation: true,
      statistics: true,
      teamMembers: true,
      certifications: true,
      faq: true,
      downloadMenu: true,
      priceList: true,
      announcements: true,
      whatsappButton: true,
      floatingCallButton: true,
      analytics: true // Analytics tracking
    },
    
    // Tema ve Görünüm
    theme: {
      primaryColor: "#1e40af", // blue-800
      secondaryColor: "#3b82f6", // blue-500
      accentColor: "#f59e0b", // amber-500
      backgroundColor: "#000000",
      textColor: "#ffffff",
      cardStyle: "glassmorphism", // solid, gradient, glassmorphism
      fontFamily: "Inter", // Inter, Poppins, Montserrat, Playfair Display
      animations: true,
      darkMode: true
    },
    
    // Şirket Bilgileri
    companyName: "Qans Bilişim Teknolojileri",
    companySlogan: "Apple Cihazlarınızın Uzmanı",
    companyDescription: "Qans Bilişim olarak güçlü ekip hareketiyle, ilgi alanındaki tüm yenilikleri, ürün ve hizmetleri en hızlı, kaliteli ve sürekli gelişen bir iş modeli ile müşterilerine sunmaktır.",
    sector: "Bilişim ve Teknoloji",
    foundedYear: "2020",
    employeeCount: "8+",
    
    // Kişi Bilgileri
    name: "Qans Bilişim",
    title: "Apple Teknik Uzmanı",
    personalBio: "Apple cihazlarının tamiri ve teknik desteği konusunda uzman",
    
    // İletişim Bilgileri
    phone: "0546 693 22 02",
    mobile: "0546 693 22 02",
    fax: "",
    email: "info@qansbilisim.com.tr",
    personalEmail: "info@qansbilisim.com.tr",
    website: "https://qansbilisim.com.tr",
    whatsapp: "0546 693 22 02",
    
    // Adres ve Konum
    address: "Kavacık Mah. FSM Cad. Otağcı Sok. No:1 Beykoz/İSTANBUL",
    city: "İstanbul",
    country: "Türkiye",
    postalCode: "34805",
    latitude: 41.1086,
    longitude: 29.0598,
    mapUrl: "https://maps.google.com/?q=41.1086,29.0598",
    
    // Fatura Bilgileri
    companyLegalName: "Qans Bilişim Teknolojileri Ltd. Şti.",
    taxOffice: "Beykoz Vergi Dairesi",
    taxNumber: "1234567890",
    tradeRegisterNo: "123456",
    mersisNo: "0123456789012345",
    
    // Görseller
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=qans",
    companyLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=qans&backgroundColor=007acc",
    coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop",
    
    // Galeri
    gallery: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        title: "Endüstriyel Elektrik Projesi",
        category: "Projeler"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        title: "Otomasyon Sistemi Kurulumu",
        category: "Otomasyon"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800",
        title: "Elektrik Panosu Montajı",
        category: "Pano"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=800",
        title: "Aydınlatma Sistemleri",
        category: "Aydınlatma"
      }
    ],
    
    // Sosyal Medya
    socialLinks: [
      { 
        id: 1, 
        platform: "LinkedIn", 
        url: "https://linkedin.com/company/hdelektrik", 
        icon: Linkedin, 
        color: "hover:bg-blue-600",
        isVisible: true,
        clicks: 156 
      },
      { 
        id: 2, 
        platform: "Instagram", 
        url: "https://instagram.com/hdelektrik", 
        icon: Instagram, 
        color: "hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600",
        isVisible: true,
        clicks: 267 
      },
      { 
        id: 3, 
        platform: "Facebook", 
        url: "https://facebook.com/hdelektrik", 
        icon: Facebook, 
        color: "hover:bg-blue-800",
        isVisible: true,
        clicks: 189 
      },
      { 
        id: 4, 
        platform: "YouTube", 
        url: "https://youtube.com/hdelektrik", 
        icon: Youtube, 
        color: "hover:bg-red-600",
        isVisible: true,
        clicks: 98 
      }
    ],
    
    // Özel Alanlar
    customFields: [
      { 
        id: 1, 
        label: "Deneyim", 
        value: "20+ Yıl", 
        icon: Briefcase, 
        isVisible: true,
        color: "blue" 
      },
      { 
        id: 2, 
        label: "Eğitim", 
        value: "Elektrik Mühendisliği", 
        icon: GraduationCap, 
        isVisible: true,
        color: "purple" 
      },
      { 
        id: 3, 
        label: "Lisanslar", 
        value: "EMO Belgesi, Elektrik Müteahhitliği", 
        icon: AwardIcon, 
        isVisible: true,
        color: "green" 
      },
      { 
        id: 4, 
        label: "Diller", 
        value: "Türkçe, İngilizce, Almanca", 
        icon: Globe, 
        isVisible: true,
        color: "orange" 
      }
    ],
    
    // Şirket Özellikleri
    companyFeatures: [
      { title: "Lisanslı", icon: BadgeCheck, description: "EMO belgeli elektrik müteahhidi", color: "blue" },
      { title: "7/24 Arıza", icon: Headphones, description: "Acil elektrik arıza servisi", color: "red" },
      { title: "Hızlı Müdahale", icon: Truck, description: "30 dakikada yerinde", color: "green" },
      { title: "Garantili", icon: Shield, description: "2 yıl iş garantisi", color: "purple" }
    ],
    
    // Detaylı Hizmetler
    services: [
      {
        id: 1,
        title: "iPhone Tamiri",
        description: "Profesyonel iPhone onarım hizmetleri",
        icon: Smartphone,
        features: ["Ekran değişimi", "Batarya değişimi", "Anakart tamiri", "Su hasarı onarımı"],
        price: "₺500 - ₺2,500"
      },
      {
        id: 2,
        title: "MacBook Tamiri",
        description: "MacBook ve iMac onarım ve bakım hizmetleri",
        icon: Building2,
        features: ["Liquid damage", "Performans optimizasyonu", "Donanım yenileme", "Veri kurtarma"],
        price: "₺800 - ₺4,000"
      },
      {
        id: 3,
        title: "Otomasyon Sistemleri",
        description: "Akıllı ev ve endüstriyel otomasyon",
        icon: Settings,
        features: ["PLC programlama", "SCADA", "Akıllı ev", "Uzaktan kontrol"],
        price: "Sistem bazlı"
      },
      {
        id: 4,
        title: "Arıza Tamiri",
        description: "7/24 acil elektrik arıza hizmeti",
        icon: AlertCircle,
        features: ["Acil müdahale", "Arıza tespiti", "Hızlı çözüm", "Garanti"],
        price: "350₺'den başlayan"
      },
      {
        id: 5,
        title: "Proje Danışmanlığı",
        description: "Elektrik projeleri danışmanlık hizmeti",
        icon: Lightbulb,
        features: ["Fizibilite", "Proje tasarım", "Maliyet analizi", "Teknik destek"],
        price: "Ücretsiz ön görüşme"
      },
      {
        id: 6,
        title: "Bakım Onarım",
        description: "Periyodik bakım ve onarım hizmetleri",
        icon: Settings,
        features: ["Önleyici bakım", "Arıza önleme", "Performans artırma", "Raporlama"],
        price: "Yıllık sözleşme"
      }
    ],
    
    // İstatistikler
    stats: [
      { label: "Müşteri", value: "300+", icon: Users, color: "blue" },
      { label: "Proje", value: "500+", icon: Target, color: "green" },
      { label: "Yıl", value: "16", icon: CalendarDays, color: "purple" },
      { label: "Çalışan", value: "15+", icon: Briefcase, color: "orange" }
    ],
    
    // Çalışma Saatleri
    workingHours: {
      monday: { open: "08:00", close: "18:00", isOpen: true },
      tuesday: { open: "08:00", close: "18:00", isOpen: true },
      wednesday: { open: "08:00", close: "18:00", isOpen: true },
      thursday: { open: "08:00", close: "18:00", isOpen: true },
      friday: { open: "08:00", close: "18:00", isOpen: true },
      saturday: { open: "09:00", close: "15:00", isOpen: true },
      sunday: { open: "Kapalı", close: "Kapalı", isOpen: false, note: "Acil: 7/24" }
    },
    
    // Müşteri Yorumları
    testimonials: [
      {
        id: 1,
        name: "Ahmet Yılmaz",
        company: "ABC Tekstil",
        comment: "Qans Bilişim ekibi MacBook'umun liquid damage sorununu mükemmel şekilde çözdü. Profesyonel yaklaşımları ve hızlı hizmetleri için teşekkürler.",
        rating: 5,
        date: "2024-11-15"
      },
      {
        id: 2,
        name: "Mehmet Kaya",
        company: "Kaya İnşaat",
        comment: "iPhone'umun ekranı kırılmıştı, Qans Bilişim'de hızlıca ve uygun fiyata tamir ettirdim. Kaliteli hizmet için teşekkürler.",
        rating: 5,
        date: "2024-10-22"
      },
      {
        id: 3,
        name: "Ayşe Demir",
        company: "Demir Market",
        comment: "Mağazamızın aydınlatma ve elektrik sistemini tamamen yenilediler. Enerji tasarrufu konusunda da çok faydalı oldular.",
        rating: 5,
        date: "2024-09-10"
      }
    ],
    
    // Ekip Üyeleri
    teamMembers: [
      {
        id: 1,
        name: "Ahmet Yılmaz",
        title: "Kurucu & Apple Teknik Uzmanı",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet",
        bio: "Apple cihazları konusunda 8+ yıl deneyim",
        social: {
          linkedin: "https://linkedin.com/in/ahmetyilmaz"
        }
      },
      {
        id: 2,
        name: "Ali Yıldız",
        title: "Proje Müdürü",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
        bio: "15 yıl deneyim",
        social: {
          linkedin: "https://linkedin.com/in/aliyildiz"
        }
      },
      {
        id: 3,
        name: "Fatma Kara",
        title: "Otomasyon Uzmanı",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatma",
        bio: "10 yıl deneyim",
        social: {
          linkedin: "https://linkedin.com/in/fatmakara"
        }
      }
    ],
    
    // Sertifikalar ve Belgeler
    certifications: [
      {
        id: 1,
        title: "ISO 9001:2015",
        issuer: "TÜV SÜD",
        date: "2023",
        icon: Award
      },
      {
        id: 2,
        title: "EMO Yetki Belgesi",
        issuer: "Elektrik Mühendisleri Odası",
        date: "2024",
        icon: BadgeCheck
      },
      {
        id: 3,
        title: "TSE Hizmet Yeterlilik",
        issuer: "Türk Standartları Enstitüsü",
        date: "2023",
        icon: Shield
      }
    ],
    
    // SSS
    faq: [
      {
        id: 1,
        question: "Acil arıza durumunda ne kadar sürede gelirsiniz?",
        answer: "İstanbul içi acil arıza durumlarında ortalama 30 dakika içinde müdahale ediyoruz."
      },
      {
        id: 2,
        question: "Fiyat teklifi almak ücretli mi?",
        answer: "Hayır, keşif ve fiyat teklifi tamamen ücretsizdir."
      },
      {
        id: 3,
        question: "Hangi bölgelerde hizmet veriyorsunuz?",
        answer: "İstanbul'un tüm ilçelerinde hizmet vermekteyiz."
      }
    ],
    
    // Duyurular
    announcements: [
      {
        id: 1,
        title: "Yılbaşı İndirimi",
        description: "Ocak ayı boyunca tüm hizmetlerimizde %15 indirim!",
        type: "discount",
        validUntil: "2025-01-31"
      }
    ],
    
    // Fiyat Listesi
    priceList: [
      { service: "Priz Montajı", price: "150₺" },
      { service: "Sigorta Değişimi", price: "200₺" },
      { service: "Arıza Tespiti", price: "350₺" },
      { service: "Elektrik Projesi", price: "Metrekare başı 50₺" }
    ]
  })

  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Otomatik testimonial değiştirme
  useEffect(() => {
    if (profile.visibility.testimonials && profile.testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % profile.testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [profile.testimonials.length, profile.visibility.testimonials])

  const handleAddContact = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.companyName}
TITLE:${profile.title}
TEL;TYPE=WORK:${profile.phone}
TEL;TYPE=CELL:${profile.mobile}
EMAIL;TYPE=WORK:${profile.email}
EMAIL;TYPE=PREF:${profile.personalEmail}
URL:${profile.website}
ADR;TYPE=WORK:;;${profile.address};${profile.city};;${profile.postalCode};${profile.country}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.slug}.vcf`
    a.click()
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `${profile.companyName} - ${profile.name}`
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
    setShowShareMenu(false)
  }

  // Renk helper fonksiyonu
  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-600 to-blue-800",
      green: "from-green-600 to-green-800",
      purple: "from-purple-600 to-purple-800",
      orange: "from-orange-600 to-orange-800",
      red: "from-red-600 to-red-800"
    }
    return colors[color] || colors.blue
  }

  // Şu anki gün ve saat kontrolü
  const getCurrentDayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const now = new Date()
    const currentDay = days[now.getDay()]
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const todayHours = profile.workingHours[currentDay]
    
    let isOpen = false
    if (todayHours.isOpen) {
      isOpen = currentTime >= todayHours.open && currentTime <= todayHours.close
    }
    
    return { currentDay, isOpen, todayHours }
  }

  return (
    <div className={`min-h-screen ${profile.theme.darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Floating Action Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center space-x-3">
                {profile.visibility.companyLogo && (
                  <img src={profile.companyLogo} alt="Logo" className="h-8 w-8 rounded" />
                )}
                <p className="text-sm font-medium">{profile.companyName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {profile.visibility.downloadMenu && (
                <button
                  onClick={handleAddContact}
                  className="bg-white/10 backdrop-blur text-white p-2 rounded-full hover:bg-white/20 transition-all"
                  title="Rehbere Ekle"
                >
                  <Download className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all hover:scale-105"
              >
                İletişime Geç
              </button>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="bg-white/10 backdrop-blur text-white p-2 rounded-full hover:bg-white/20 transition-all relative"
              >
                <Share2 className="h-5 w-5" />
                
                {showShareMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white text-black rounded-2xl shadow-2xl p-2 w-48">
                    <button 
                      onClick={() => handleShare('copy')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl flex items-center space-x-3 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      <span className="text-sm">{copied ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
                    </button>
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl flex items-center space-x-3 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl flex items-center space-x-3 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">LinkedIn</span>
                    </button>
                    <button 
                      onClick={() => handleShare('email')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl flex items-center space-x-3 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Email</span>
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Enhanced Professional */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        {profile.visibility.coverImage && (
          <div className="absolute inset-0">
            <img 
              src={profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black"></div>
          </div>
        )}
        
        {/* Animated Background Elements */}
        {profile.theme.animations && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Company Header */}
          {profile.visibility.companyInfo && (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                {profile.visibility.companyLogo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                    <div className="relative bg-white p-6 rounded-3xl shadow-2xl">
                      <img src={profile.companyLogo} alt="Logo" className="h-20 w-20" />
                    </div>
                  </div>
                )}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {profile.companyName}
              </h1>
              
              {profile.isPremium && (
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full mb-4">
                  <BadgeCheck className="h-5 w-5 text-white" />
                  <span className="text-white font-bold">Premium Üye</span>
                </div>
              )}
              
              <p className="text-2xl text-gray-300 mb-2">{profile.companySlogan}</p>
              <p className="text-lg text-gray-400">{profile.sector} • {profile.foundedYear}'den beri</p>
              
              {/* Quick Stats */}
              {profile.visibility.statistics && (
                <div className="flex justify-center space-x-8 mt-8">
                  {profile.stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Icon className={`h-8 w-8 text-${stat.color}-400`} />
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Card */}
              {profile.visibility.personalInfo && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4 mb-4">
                    {profile.visibility.profileImage && (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name}
                        className="h-20 w-20 rounded-full border-3 border-white/30"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                      <p className="text-gray-300">{profile.title}</p>
                      <p className="text-sm text-gray-400">{profile.personalBio}</p>
                    </div>
                  </div>
                  
                  {/* Personal Social Links */}
                  {profile.visibility.socialLinks && (
                    <div className="flex space-x-2 mt-4">
                      {profile.socialLinks.filter(link => link.isVisible).map((link) => {
                        const Icon = link.icon
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all"
                            title={link.platform}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Working Hours Card */}
              {profile.visibility.workingHours && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-400" />
                    Çalışma Saatleri
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const { currentDay, isOpen, todayHours } = getCurrentDayHours()
                      return (
                        <div className={`p-3 rounded-lg ${isOpen ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{isOpen ? 'Şu an AÇIK' : 'Şu an KAPALI'}</span>
                            <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                              {todayHours.isOpen ? `${todayHours.open} - ${todayHours.close}` : 'Kapalı'}
                            </span>
                          </div>
                          {todayHours.note && (
                            <p className="text-sm text-gray-400 mt-1">{todayHours.note}</p>
                          )}
                        </div>
                      )
                    })()}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Pazartesi-Cuma:</span>
                        <span>08:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Cumartesi:</span>
                        <span>09:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Pazar:</span>
                        <span>Kapalı</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {profile.visibility.customFields && profile.customFields.some(f => f.isVisible) && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Özellikler</h3>
                  <div className="space-y-3">
                    {profile.customFields.filter(field => field.isVisible).map((field) => {
                      const Icon = field.icon
                      return (
                        <div key={field.id} className="flex items-center space-x-3">
                          <div className={`bg-gradient-to-r ${getColorClasses(field.color)} w-10 h-10 rounded-lg flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">{field.label}</p>
                            <p className="text-white font-medium">{field.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Description */}
              {profile.visibility.companyInfo && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">Hakkımızda</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {profile.companyDescription}
                  </p>
                  
                  {/* Company Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {profile.companyFeatures.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div key={index} className="text-center">
                          <div className={`bg-gradient-to-r ${getColorClasses(feature.color)} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <h4 className="text-white font-semibold text-sm mb-1">{feature.title}</h4>
                          <p className="text-gray-400 text-xs">{feature.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Contact Info Grid */}
              {profile.visibility.contactInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href={`tel:${profile.phone}`} className="group">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Ofis</p>
                          <p className="text-white font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                  </a>

                  <a href={`tel:${profile.mobile}`} className="group">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all hover:transform hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-green-600 to-green-800 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Mobil</p>
                          <p className="text-white font-medium">{profile.mobile}</p>
                        </div>
                      </div>
                    </div>
                  </a>

                  <a href={`mailto:${profile.email}`} className="group">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-medium text-sm">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                  </a>

                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all hover:transform hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-800 w-12 h-12 rounded-xl flex items-center justify-center">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Website</p>
                          <p className="text-white font-medium text-sm">{profile.website.replace('https://', '')}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Location Card */}
              {profile.visibility.mapLocation && (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                    Konum
                  </h3>
                  <p className="text-gray-300 mb-2">{profile.address}</p>
                  <p className="text-gray-400 text-sm mb-4">{profile.city}, {profile.country} {profile.postalCode}</p>
                  <a
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Yol Tarifi Al</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button
              onClick={handleAddContact}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Download className="h-6 w-6" />
              <span className="text-lg">Tüm Bilgileri İndir</span>
            </button>
            {profile.visibility.whatsappButton && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-2xl hover:shadow-green-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg">WhatsApp ile İletişim</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      {profile.visibility.services && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Hizmetlerimiz
              </h2>
              <p className="text-gray-400 text-lg">Profesyonel elektrik ve otomasyon çözümleri</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.services.slice(0, showAllServices ? undefined : 6).map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-400 mb-3">{service.description}</p>
                        <ul className="space-y-1 mb-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-500 flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <p className="text-blue-400 font-semibold">{service.price}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {profile.services.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllServices(!showAllServices)}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{showAllServices ? 'Daha Az Göster' : 'Tüm Hizmetleri Göster'}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showAllServices ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {profile.visibility.gallery && profile.gallery.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Proje Galerisi
              </h2>
              <p className="text-gray-400 text-lg">Tamamladığımız projelerden örnekler</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.gallery.map((image) => (
                <div
                  key={image.id}
                  onClick={() => {
                    setSelectedImage(image)
                    setShowGalleryModal(true)
                  }}
                  className="relative group cursor-pointer overflow-hidden rounded-xl"
                >
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold">{image.title}</p>
                      <p className="text-gray-300 text-sm">{image.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {profile.visibility.testimonials && profile.testimonials.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Müşteri Yorumları
              </h2>
              <p className="text-gray-400 text-lg">Mutlu müşterilerimizin görüşleri</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative">
                <div className="absolute top-6 left-6 text-blue-400 opacity-20">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    "{profile.testimonials[activeTestimonial].comment}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{profile.testimonials[activeTestimonial].name}</p>
                      <p className="text-gray-400 text-sm">{profile.testimonials[activeTestimonial].company}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(profile.testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {profile.testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeTestimonial ? 'w-8 bg-blue-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {profile.visibility.teamMembers && profile.teamMembers.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Ekibimiz
              </h2>
              <p className="text-gray-400 text-lg">Uzman kadromuzla hizmetinizdeyiz</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {profile.teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative inline-block mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="h-32 w-32 rounded-full border-4 border-white/20"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-400">{member.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{member.bio}</p>
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 mt-3 text-sm"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {profile.visibility.certifications && profile.certifications.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Sertifikalar & Belgeler
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.certifications.map((cert) => {
                const Icon = cert.icon
                return (
                  <div key={cert.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
                    <Icon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{cert.title}</h3>
                    <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    <p className="text-gray-500 text-xs mt-1">{cert.date}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Invoice Info Section */}
      {profile.visibility.invoiceInfo && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Fatura Bilgileri
            </h2>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Şirket Ünvanı</p>
                      <p className="text-white font-medium">{profile.companyLegalName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Receipt className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Vergi Dairesi</p>
                      <p className="text-white font-medium">{profile.taxOffice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Hash className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Vergi No</p>
                      <p className="text-white font-medium">{profile.taxNumber}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Ticaret Sicil No</p>
                      <p className="text-white font-medium">{profile.tradeRegisterNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">MERSİS No</p>
                      <p className="text-white font-medium">{profile.mersisNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Fatura Adresi</p>
                      <p className="text-white font-medium text-sm">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {profile.visibility.faq && profile.faq.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Sıkça Sorulan Sorular
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {profile.faq.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-start">
                    <HelpCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                    {item.question}
                  </h3>
                  <p className="text-gray-400 ml-7">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Announcements Banner */}
      {profile.visibility.announcements && profile.announcements.length > 0 && (
        <section className="py-10 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              <Megaphone className="h-8 w-8 text-white animate-pulse" />
              <div className="text-center">
                <p className="text-white font-bold text-xl">{profile.announcements[0].title}</p>
                <p className="text-white/90">{profile.announcements[0].description}</p>
              </div>
              <Gift className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
        </section>
      )}

      {/* Price List */}
      {profile.visibility.priceList && profile.priceList.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Fiyat Listesi
              </h2>
              <p className="text-gray-400 text-lg">Temel hizmet fiyatlarımız</p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="space-y-4">
                {profile.priceList.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <span className="text-white">{item.service}</span>
                    <span className="text-blue-400 font-semibold">{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-6 text-center">
                * Fiyatlar KDV hariçtir. Detaylı fiyat için iletişime geçiniz.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Hızlı İletişim</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="text-white">Ofis Telefon</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </a>
              
              <a
                href={`tel:${profile.mobile}`}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <span className="text-white">Mobil Telefon</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </a>
              
              <a
                href={`https://wa.me/${profile.mobile.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <span className="text-white">WhatsApp Mesaj</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </a>
              
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <span className="text-white">Email Gönder</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </a>
              
              <button
                onClick={handleAddContact}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Rehbere Kaydet</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto rounded-xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {profile.visibility.whatsappButton && (
        <a
          href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-40"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      )}

      {/* Floating Call Button */}
      {profile.visibility.floatingCallButton && (
        <a
          href={`tel:${profile.mobile}`}
          className="fixed bottom-6 left-6 bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-all hover:scale-110 z-40 animate-pulse"
        >
          <Phone className="h-7 w-7" />
        </a>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm">Powered by QART</p>
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs text-gray-500">Dijital Kartvizit Sistemi</p>
        </div>
      </footer>
    </div>
  )
}