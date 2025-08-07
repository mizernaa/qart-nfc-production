"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MousePointer,
  Clock,
  BarChart3,
  PieChart,
  Download,
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Smartphone,
  Monitor,
  Tablet,
  Link2,
  Share2,
  RefreshCw,
  Settings,
  CreditCard,
  Crown,
  Star,
  ExternalLink,
  QrCode,
  NfcIcon,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Youtube,
  MessageCircle
} from "lucide-react"

export default function KullaniciDetayPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("30days")

  // Demo kullanıcı verileri - gerçek uygulamada API'den gelecek
  const [allUsers] = useState({
    "1": {
      id: "1",
      name: "Ahmet Yılmaz",
      email: "ahmet@qart.app",
      phone: "+90 555 123 4567",
      profileSlug: "ahmet-yilmaz",
      avatar: null,
      title: "Yazılım Geliştirici",
      company: "Tech Solutions",
      location: "İstanbul, Türkiye",
      website: "https://ahmetyilmaz.com",
      bio: "10+ yıl deneyimli full-stack developer. React, Node.js ve cloud teknolojileri uzmanı.",
    },
    "2": {
      id: "2",
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      phone: "+90 555 987 6543",
      profileSlug: "zeynep-kaya",
      avatar: null,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "İstanbul, Türkiye",
      website: "https://zeynepkaya.com",
      bio: "Kullanıcı deneyimi odaklı tasarımcı. 8 yıl deneyim ile mobil ve web arayüzleri tasarlıyorum.",
    },
    "3": {
      id: "3",
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      phone: "+90 555 456 7890",
      profileSlug: "mehmet-demir",
      avatar: null,
      title: "Grafik Tasarımcı",
      company: "Freelance",
      location: "Ankara, Türkiye",
      website: "https://mehmetdemir.art",
      bio: "Yaratıcı grafik tasarımcı. Marka kimliği ve logo tasarımı konusunda uzmanım.",
    },
    "4": {
      id: "4",
      name: "Admin User",
      email: "admin@qart.app",
      phone: "+90 555 000 0000",
      profileSlug: "admin-profile",
      avatar: null,
      title: "Sistem Yöneticisi",
      company: "QART",
      location: "İstanbul, Türkiye",
      website: "https://qart.app",
      bio: "QART platformunun sistem yöneticisi. Teknik operasyonlar ve kullanıcı desteği.",
    },
    "5": {
      id: "5",
      name: "Ayşe Öz",
      email: "ayse@example.com",
      phone: "+90 555 321 6547",
      profileSlug: "ayse-oz",
      avatar: null,
      title: "Pazarlama Uzmanı",
      company: "Marketing Pro",
      location: "İzmir, Türkiye",
      website: "https://ayseoz.com",
      bio: "Dijital pazarlama ve sosyal medya stratejisti. B2B ve B2C kampanya deneyimi.",
    },
    "6": {
      id: "6",
      name: "Can Şahin",
      email: "can@example.com",
      phone: "+90 555 789 0123",
      profileSlug: "can-sahin",
      avatar: null,
      title: "İş Geliştirme",
      company: "Growth Corp",
      location: "Bursa, Türkiye",
      website: "https://cansahin.biz",
      bio: "İş geliştirme uzmanı. Stratejik ortaklıklar ve satış süreçleri yönetimi.",
    },
    "7": {
      id: "7",
      name: "Fatma Yılmaz",
      email: "fatma@example.com",
      phone: "+90 555 567 8901",
      profileSlug: "fatma-yilmaz",
      avatar: null,
      title: "İçerik Editörü",
      company: "Media House",
      location: "Antalya, Türkiye",
      website: "https://fatmayilmaz.blog",
      bio: "İçerik editörü ve copywriter. Marka hikayeleri ve blog yazıları konusunda uzman.",
    },
    "8": {
      id: "8",
      name: "Ali Kaya",
      email: "ali@example.com",
      phone: "+90 555 234 5678",
      profileSlug: "ali-kaya",
      avatar: null,
      title: "Satış Danışmanı",
      company: "Sales Pro",
      location: "Adana, Türkiye",
      website: "https://alikaya.net",
      bio: "Satış danışmanı ve müşteri ilişkileri uzmanı. B2B satış süreçlerinde 12 yıl deneyim.",
    }
  })

  // Seçilen kullanıcının temel verilerini al
  const userBasicData = allUsers[userId as keyof typeof allUsers] || allUsers["1"]

  // Kullanıcıya göre dinamik veriler oluştur
  const getAccountStatus = (id: string) => {
    const statusMap: { [key: string]: any } = {
      "1": { isActive: true, isAdmin: false, emailVerified: true, phoneVerified: true, subscription: "Pro", createdAt: "2024-12-01", lastLogin: "2025-01-07 14:30" },
      "2": { isActive: true, isAdmin: false, emailVerified: true, phoneVerified: true, subscription: "Business", createdAt: "2024-11-15", lastLogin: "2025-01-07 12:15" },
      "3": { isActive: false, isAdmin: false, emailVerified: false, phoneVerified: false, subscription: "Free", createdAt: "2024-10-20", lastLogin: "2025-01-05 09:20" },
      "4": { isActive: true, isAdmin: true, emailVerified: true, phoneVerified: true, subscription: "Enterprise", createdAt: "2024-09-01", lastLogin: "2025-01-07 15:45" },
      "5": { isActive: true, isAdmin: false, emailVerified: true, phoneVerified: true, subscription: "Pro", createdAt: "2024-12-10", lastLogin: "2025-01-06 18:30" },
      "6": { isActive: true, isAdmin: false, emailVerified: true, phoneVerified: false, subscription: "Business", createdAt: "2024-11-25", lastLogin: "2025-01-07 10:20" },
      "7": { isActive: true, isAdmin: false, emailVerified: false, phoneVerified: false, subscription: "Free", createdAt: "2024-12-05", lastLogin: "2025-01-06 16:45" },
      "8": { isActive: true, isAdmin: false, emailVerified: true, phoneVerified: true, subscription: "Pro", createdAt: "2024-10-15", lastLogin: "2025-01-07 08:15" }
    }
    return statusMap[id] || statusMap["1"]
  }

  const getStats = (id: string) => {
    const statsMap: { [key: string]: any } = {
      "1": { totalViews: 4567, viewsToday: 89, viewsThisWeek: 523, viewsThisMonth: 2134, uniqueVisitors: 3456, averageSessionDuration: 145, bounceRate: 32.5, conversionRate: 8.2, totalLeads: 234, leadsThisMonth: 67, leadsToday: 3, profileShares: 89, contactClicks: 567, socialClicks: 342, linkClicks: 789 },
      "2": { totalViews: 2890, viewsToday: 45, viewsThisWeek: 312, viewsThisMonth: 1456, uniqueVisitors: 2234, averageSessionDuration: 128, bounceRate: 28.3, conversionRate: 5.4, totalLeads: 156, leadsThisMonth: 34, leadsToday: 2, profileShares: 67, contactClicks: 423, socialClicks: 234, linkClicks: 567 },
      "3": { totalViews: 1234, viewsToday: 12, viewsThisWeek: 89, viewsThisMonth: 456, uniqueVisitors: 987, averageSessionDuration: 98, bounceRate: 45.2, conversionRate: 5.4, totalLeads: 67, leadsThisMonth: 8, leadsToday: 0, profileShares: 23, contactClicks: 145, socialClicks: 78, linkClicks: 234 },
      "4": { totalViews: 0, viewsToday: 0, viewsThisWeek: 0, viewsThisMonth: 0, uniqueVisitors: 0, averageSessionDuration: 0, bounceRate: 0, conversionRate: 0, totalLeads: 0, leadsThisMonth: 0, leadsToday: 0, profileShares: 0, contactClicks: 0, socialClicks: 0, linkClicks: 0 },
      "5": { totalViews: 3456, viewsToday: 67, viewsThisWeek: 445, viewsThisMonth: 1789, uniqueVisitors: 2678, averageSessionDuration: 167, bounceRate: 25.8, conversionRate: 5.5, totalLeads: 189, leadsThisMonth: 45, leadsToday: 4, profileShares: 78, contactClicks: 512, socialClicks: 298, linkClicks: 678 },
      "6": { totalViews: 2134, viewsToday: 34, viewsThisWeek: 234, viewsThisMonth: 987, uniqueVisitors: 1678, averageSessionDuration: 134, bounceRate: 38.2, conversionRate: 4.6, totalLeads: 98, leadsThisMonth: 23, leadsToday: 1, profileShares: 45, contactClicks: 298, socialClicks: 167, linkClicks: 423 },
      "7": { totalViews: 1789, viewsToday: 23, viewsThisWeek: 145, viewsThisMonth: 678, uniqueVisitors: 1234, averageSessionDuration: 89, bounceRate: 52.3, conversionRate: 2.5, totalLeads: 45, leadsThisMonth: 12, leadsToday: 0, profileShares: 34, contactClicks: 189, socialClicks: 98, linkClicks: 234 },
      "8": { totalViews: 3789, viewsToday: 78, viewsThisWeek: 567, viewsThisMonth: 1987, uniqueVisitors: 2987, averageSessionDuration: 156, bounceRate: 28.9, conversionRate: 7.0, totalLeads: 267, leadsThisMonth: 56, leadsToday: 5, profileShares: 89, contactClicks: 634, socialClicks: 367, linkClicks: 789 }
    }
    return statsMap[id] || statsMap["1"]
  }

  const generateViewsTrend = (id: string) => {
    const baseData = [
      { date: "2025-01-01", views: 95, visitors: 78, leads: 3 },
      { date: "2025-01-02", views: 102, visitors: 85, leads: 4 },
      { date: "2025-01-03", views: 87, visitors: 71, leads: 2 },
      { date: "2025-01-04", views: 134, visitors: 98, leads: 6 },
      { date: "2025-01-05", views: 156, visitors: 112, leads: 5 },
      { date: "2025-01-06", views: 178, visitors: 134, leads: 8 },
      { date: "2025-01-07", views: 89, visitors: 76, leads: 3 }
    ]
    
    // Her kullanıcı için farklı multiplier
    const multipliers: { [key: string]: number } = {
      "1": 1, "2": 0.6, "3": 0.3, "4": 0, "5": 0.8, "6": 0.5, "7": 0.4, "8": 0.9
    }
    
    const multiplier = multipliers[id] || 1
    return baseData.map(day => ({
      ...day,
      views: Math.round(day.views * multiplier),
      visitors: Math.round(day.visitors * multiplier),
      leads: Math.round(day.leads * multiplier)
    }))
  }

  const getSocialLinks = (id: string, userData: any) => {
    const baseLinks = [
      { platform: "LinkedIn", url: `https://linkedin.com/in/${userData.profileSlug}`, clicks: 234, icon: Linkedin, color: "text-blue-600" },
      { platform: "Instagram", url: `https://instagram.com/${userData.profileSlug}`, clicks: 178, icon: Instagram, color: "text-pink-600" },
      { platform: "GitHub", url: `https://github.com/${userData.profileSlug}`, clicks: 156, icon: Github, color: "text-gray-900" },
      { platform: "Twitter", url: `https://twitter.com/${userData.profileSlug}`, clicks: 89, icon: Twitter, color: "text-blue-400" },
      { platform: "Facebook", url: `https://facebook.com/${userData.profileSlug}`, clicks: 67, icon: Facebook, color: "text-blue-800" }
    ]
    
    // Her kullanıcı için farklı click sayıları
    const clickMultipliers: { [key: string]: number } = {
      "1": 1, "2": 0.8, "3": 0.4, "4": 0, "5": 0.9, "6": 0.6, "7": 0.3, "8": 1.2
    }
    
    const multiplier = clickMultipliers[id] || 1
    return baseLinks.map(link => ({
      ...link,
      clicks: Math.round(link.clicks * multiplier)
    }))
  }

  const getCustomFields = (id: string) => {
    const fieldsMap: { [key: string]: any[] } = {
      "1": [
        { label: "Uzmanlık Alanları", value: "React, Node.js, AWS, MongoDB", type: "text" },
        { label: "Deneyim", value: "10+ yıl", type: "text" },
        { label: "Çalışma Saatleri", value: "09:00 - 18:00", type: "text" },
        { label: "Fiyat Aralığı", value: "500-1000 TL/gün", type: "text" }
      ],
      "2": [
        { label: "Tasarım Araçları", value: "Figma, Sketch, Adobe XD", type: "text" },
        { label: "Uzmanlık", value: "Mobile UI, Web Design", type: "text" },
        { label: "Çalışma Saatleri", value: "10:00 - 19:00", type: "text" },
        { label: "Proje Süresi", value: "2-8 hafta", type: "text" }
      ],
      "3": [
        { label: "Tasarım Türleri", value: "Logo, Poster, Kartvizit", type: "text" },
        { label: "Yazılımlar", value: "Photoshop, Illustrator", type: "text" },
        { label: "Çalışma Saatleri", value: "Esnek", type: "text" },
        { label: "Fiyat", value: "200-500 TL/proje", type: "text" }
      ],
      "4": [
        { label: "Yetki Seviyesi", value: "Full Admin Access", type: "text" },
        { label: "Sorumluluk", value: "Sistem Yönetimi", type: "text" },
        { label: "Çalışma Saatleri", value: "7/24 Destek", type: "text" },
        { label: "İletişim", value: "Acil Durum Hattı", type: "text" }
      ],
      "5": [
        { label: "Pazarlama Kanalları", value: "Social Media, SEM, Content", type: "text" },
        { label: "Deneyim", value: "8 yıl B2B/B2C", type: "text" },
        { label: "Çalışma Saatleri", value: "09:30 - 18:30", type: "text" },
        { label: "Konsültasyon", value: "300 TL/saat", type: "text" }
      ]
    }
    return fieldsMap[id] || fieldsMap["1"]
  }

  const getReferrerStats = (id: string, stats: any) => {
    const baseStats = [
      { source: "Direkt Erişim", views: 1567, percentage: 34.3 },
      { source: "QR Kod", views: 1234, percentage: 27.0 },
      { source: "LinkedIn", views: 789, percentage: 17.3 },
      { source: "Instagram", views: 456, percentage: 10.0 },
      { source: "Google", views: 234, percentage: 5.1 },
      { source: "Diğer", views: 287, percentage: 6.3 }
    ]
    
    // Toplam görüntüleme sayısına göre oran hesapla
    const totalViews = stats.totalViews
    const multiplier = totalViews / 4567 // Base user (Ahmet) ile karşılaştır
    
    return baseStats.map(stat => ({
      ...stat,
      views: Math.round(stat.views * multiplier)
    }))
  }

  const getRecentLeads = (id: string) => {
    const leadsMap: { [key: string]: any[] } = {
      "1": [
        { id: 1, name: "Mehmet Demir", email: "mehmet@example.com", phone: "+90 555 987 6543", date: "2025-01-07", time: "14:30", message: "React projeniz hakkında bilgi almak istiyorum." },
        { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", phone: "+90 555 456 7890", date: "2025-01-07", time: "11:15", message: "Full-stack geliştirme için iş birliği yapalım." },
        { id: 3, name: "Ali Öz", email: "ali@example.com", phone: "+90 555 123 9876", date: "2025-01-06", time: "16:45", message: "E-ticaret sitesi için teklif rica ediyorum." }
      ],
      "2": [
        { id: 1, name: "Can Şahin", email: "can@example.com", phone: "+90 555 234 5678", date: "2025-01-07", time: "13:20", message: "Mobil uygulama tasarımı için görüşelim." },
        { id: 2, name: "Fatma Yılmaz", email: "fatma@example.com", phone: "+90 555 567 8901", date: "2025-01-06", time: "15:45", message: "Brand identity tasarımı işi var." }
      ],
      "3": [
        { id: 1, name: "Deniz Kaya", email: "deniz@example.com", phone: "+90 555 345 6789", date: "2025-01-05", time: "10:30", message: "Logo tasarımı için fiyat teklifi." }
      ],
      "4": [],
      "5": [
        { id: 1, name: "Burak Özkan", email: "burak@example.com", phone: "+90 555 678 9012", date: "2025-01-07", time: "09:15", message: "Dijital pazarlama danışmanlığı." },
        { id: 2, name: "Selin Aydın", email: "selin@example.com", phone: "+90 555 789 0123", date: "2025-01-06", time: "14:30", message: "SEO stratejisi için toplantı yapalım." }
      ]
    }
    return leadsMap[id] || []
  }

  const accountStatus = getAccountStatus(userId)
  const stats = getStats(userId)

  const userData = {
    ...userBasicData,
    ...accountStatus,
    subscriptionExpiry: "2025-12-01",
    lastSeen: accountStatus.lastLogin,
    
    // Profil Ayarları
    theme: userId === "1" ? "modern-dark" : userId === "2" ? "minimal-light" : userId === "3" ? "creative-color" : userId === "4" ? "admin-theme" : "modern-dark",
    customDomain: `${userBasicData.name.toLowerCase().replace(/\s+/g, '')}.qart.app`,
    isPublic: userId !== "3", // Mehmet Demir private
    leadFormEnabled: userId !== "4", // Admin doesn't need leads
    analyticsEnabled: true,
    seoOptimized: userId !== "7", // Fatma needs SEO work
    
    // NFC & QR Ayarları
    nfcCardId: `QRT-2024-00${userId.padStart(4, '0')}`,
    qrCodeStyle: userId === "1" ? "modern" : userId === "2" ? "minimal" : userId === "3" ? "creative" : "standard",
    qrCodeColor: userId === "1" ? "#3B82F6" : userId === "2" ? "#8B5CF6" : userId === "3" ? "#EF4444" : "#10B981",
    
    // İstatistikler (Son 30 gün)
    stats: stats,

    // Son 30 günlük trend - kullanıcıya göre farklı
    viewsTrend: generateViewsTrend(userId),

    // Cihaz dağılımı
    deviceStats: [
      { device: "Mobil", views: 2890, percentage: 63.3, icon: Smartphone },
      { device: "Masaüstü", views: 1456, percentage: 31.9, icon: Monitor },
      { device: "Tablet", views: 221, percentage: 4.8, icon: Tablet }
    ],

    // Ülke dağılımı
    countryStats: [
      { country: "Türkiye", views: 2345, percentage: 51.3, flag: "🇹🇷", city: "İstanbul" },
      { country: "Almanya", views: 987, percentage: 21.6, flag: "🇩🇪", city: "Berlin" },
      { country: "ABD", views: 567, percentage: 12.4, flag: "🇺🇸", city: "New York" },
      { country: "İngiltere", views: 234, percentage: 5.1, flag: "🇬🇧", city: "London" },
      { country: "Fransa", views: 178, percentage: 3.9, flag: "🇫🇷", city: "Paris" },
      { country: "Diğer", views: 256, percentage: 5.7, flag: "🌍", city: "Çeşitli" }
    ],

    // Sosyal medya bağlantıları - dinamik
    socialLinks: getSocialLinks(userId, userBasicData),

    // Cihaz dağılımı
    deviceStats: [
      { device: "Mobil", views: Math.round(stats.totalViews * 0.633), percentage: 63.3, icon: Smartphone },
      { device: "Masaüstü", views: Math.round(stats.totalViews * 0.319), percentage: 31.9, icon: Monitor },
      { device: "Tablet", views: Math.round(stats.totalViews * 0.048), percentage: 4.8, icon: Tablet }
    ],

    // Ülke dağılımı
    countryStats: [
      { country: "Türkiye", views: Math.round(stats.totalViews * 0.513), percentage: 51.3, flag: "🇹🇷", city: "İstanbul" },
      { country: "Almanya", views: Math.round(stats.totalViews * 0.216), percentage: 21.6, flag: "🇩🇪", city: "Berlin" },
      { country: "ABD", views: Math.round(stats.totalViews * 0.124), percentage: 12.4, flag: "🇺🇸", city: "New York" },
      { country: "İngiltere", views: Math.round(stats.totalViews * 0.051), percentage: 5.1, flag: "🇬🇧", city: "London" },
      { country: "Fransa", views: Math.round(stats.totalViews * 0.039), percentage: 3.9, flag: "🇫🇷", city: "Paris" },
      { country: "Diğer", views: Math.round(stats.totalViews * 0.057), percentage: 5.7, flag: "🌍", city: "Çeşitli" }
    ],

    // Son leadler - kullanıcıya göre
    recentLeads: getRecentLeads(userId),

    // Özel alanlar
    customFields: [
      { label: "Uzmanlık Alanları", value: "React, Node.js, AWS, MongoDB", type: "text" },
      { label: "Deneyim", value: "10+ yıl", type: "text" },
      { label: "Çalışma Saatleri", value: "09:00 - 18:00", type: "text" },
      { label: "Fiyat Aralığı", value: "500-1000 TL/gün", type: "text" }
    ],

    // Özel alanlar - kullanıcıya göre
    customFields: getCustomFields(userId),

    // Trafik kaynakları - kullanıcıya göre
    referrerStats: getReferrerStats(userId, stats)
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const adminUser = JSON.parse(savedUser)
      if (!adminUser.isAdmin) {
        window.location.href = "/main-dashboard"
        return
      }
      setUser(adminUser)
    } else {
      window.location.href = "/login"
      return
    }
    setLoading(false)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGrowthIcon = (value: number) => {
    return value > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getSubscriptionColor = (subscription: string) => {
    switch(subscription) {
      case 'Free': return 'bg-gray-100 text-gray-800'
      case 'Pro': return 'bg-blue-100 text-blue-800'
      case 'Business': return 'bg-purple-100 text-purple-800'
      case 'Enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/main-dashboard" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                QART
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <button 
                onClick={() => window.location.href = '/kullanici-yonetimi'}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>{userData.name}</span>
                    {userData.isAdmin && <Shield className="h-5 w-5 text-red-500" />}
                    {userData.subscription === 'Pro' && <Crown className="h-5 w-5 text-blue-500" />}
                    {userData.subscription === 'Business' && <Star className="h-5 w-5 text-purple-500" />}
                  </h1>
                  <p className="text-sm text-gray-600">{userData.title} • {userData.company}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.open(`/${userData.profileSlug}`, '_blank')}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Profili Görüntüle</span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Düzenle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center space-x-1">
                {getGrowthIcon(12.5)}
                <span>+12.5%</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userData.stats.totalViews.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 mt-1">Toplam Görüntülenme</p>
            <p className="text-xs text-gray-500 mt-2">
              Bugün: {userData.stats.viewsToday} | Bu ay: {userData.stats.viewsThisMonth}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-purple-600" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center space-x-1">
                {getGrowthIcon(8.3)}
                <span>+8.3%</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userData.stats.uniqueVisitors.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 mt-1">Benzersiz Ziyaretçi</p>
            <p className="text-xs text-gray-500 mt-2">
              Bounce Rate: %{userData.stats.bounceRate}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <MousePointer className="h-8 w-8 text-green-600" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {userData.stats.conversionRate}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userData.stats.totalLeads}</h3>
            <p className="text-sm text-gray-600 mt-1">Toplam Lead</p>
            <p className="text-xs text-gray-500 mt-2">
              Bu ay: {userData.stats.leadsThisMonth} | Bugün: {userData.stats.leadsToday}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatDuration(userData.stats.averageSessionDuration)}</h3>
            <p className="text-sm text-gray-600 mt-1">Ort. Görüntüleme Süresi</p>
            <p className="text-xs text-gray-500 mt-2">
              Paylaşım: {userData.stats.profileShares} | İletişim: {userData.stats.contactClicks}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: Activity },
                { id: 'profile', label: 'Profil Detayları', icon: User },
                { id: 'analytics', label: 'Analitik', icon: BarChart3 },
                { id: 'leads', label: 'Lead\'ler', icon: Mail },
                { id: 'settings', label: 'Ayarlar', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* User Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Account Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Hesap Durumu</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          {userData.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {userData.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userData.emailVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            Email {userData.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span className={`text-sm px-2 py-1 rounded ${getSubscriptionColor(userData.subscription)}`}>
                            {userData.subscription}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Son giriş: {userData.lastLogin}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Son Aktiviteler</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">Profil görüntülendi</p>
                            <p className="text-xs text-gray-500">15 dakika önce • 3 yeni ziyaretçi</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">Yeni lead alındı</p>
                            <p className="text-xs text-gray-500">2 saat önce • Mehmet Demir</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                          <Share2 className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">Profil paylaşıldı</p>
                            <p className="text-xs text-gray-500">5 saat önce • LinkedIn'de</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Hızlı İşlemler</h4>
                      <div className="space-y-2">
                        <button 
                          onClick={() => window.open(`/${userData.profileSlug}`, '_blank')}
                          className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <ExternalLink className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">Profili Görüntüle</span>
                        </button>
                        <button 
                          onClick={() => window.open(`mailto:${userData.email}`, '_blank')}
                          className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <Mail className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Email Gönder</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex items-center space-x-3">
                          <MessageCircle className="h-5 w-5 text-purple-600" />
                          <span className="text-sm">Mesaj Gönder</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 flex items-center space-x-3">
                          <Download className="h-5 w-5 text-orange-600" />
                          <span className="text-sm">Rapor İndir</span>
                        </button>
                      </div>
                    </div>

                    {/* Device Distribution */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Cihaz Dağılımı</h4>
                      <div className="space-y-3">
                        {userData.deviceStats.map((device) => {
                          const Icon = device.icon
                          return (
                            <div key={device.device} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{device.device}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${device.percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">{device.percentage}%</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Temel Bilgiler</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                            <p className="text-xs text-gray-500">İsim Soyisim</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.email}</p>
                            <p className="text-xs text-gray-500">Email Adresi</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.phone}</p>
                            <p className="text-xs text-gray-500">Telefon Numarası</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.location}</p>
                            <p className="text-xs text-gray-500">Konum</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.website}</p>
                            <p className="text-xs text-gray-500">Web Sitesi</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hakkında</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{userData.bio}</p>
                    </div>

                    {/* Custom Fields */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Özel Alanlar</h4>
                      <div className="space-y-2">
                        {userData.customFields.map((field, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">{field.label}:</span>
                            <span className="text-sm text-gray-900">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technical Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Teknik Bilgiler</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Link2 className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">/{userData.profileSlug}</p>
                            <p className="text-xs text-gray-500">Profil URL</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.customDomain}</p>
                            <p className="text-xs text-gray-500">Özel Domain</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <QrCode className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.qrCodeStyle}</p>
                            <p className="text-xs text-gray-500">QR Kod Stili</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <NfcIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{userData.nfcCardId}</p>
                            <p className="text-xs text-gray-500">NFC Kart ID</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Sosyal Medya Bağlantıları</h4>
                      <div className="space-y-2">
                        {userData.socialLinks.map((social, index) => {
                          const Icon = social.icon
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Icon className={`h-4 w-4 ${social.color}`} />
                                <span className="text-sm font-medium text-gray-700">{social.platform}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{social.clicks} tıklama</span>
                                <button 
                                  onClick={() => window.open(social.url, '_blank')}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Profile Settings */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Profil Ayarları</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Profil Görünürlüğü</span>
                          <span className={`text-xs px-2 py-1 rounded ${userData.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {userData.isPublic ? 'Herkese Açık' : 'Gizli'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Lead Formu</span>
                          <span className={`text-xs px-2 py-1 rounded ${userData.leadFormEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {userData.leadFormEnabled ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">Analitik Takibi</span>
                          <span className={`text-xs px-2 py-1 rounded ${userData.analyticsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {userData.analyticsEnabled ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Date Range Selector */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Detaylı Analitik Veriler</h3>
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">Son 7 Gün</option>
                    <option value="30days">Son 30 Gün</option>
                    <option value="90days">Son 90 Gün</option>
                    <option value="1year">Son 1 Yıl</option>
                  </select>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Views Trend */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Görüntülenme Trendi
                    </h4>
                    <div className="space-y-3">
                      {userData.viewsTrend.map((day) => (
                        <div key={day.date} className="flex items-center">
                          <span className="text-sm text-gray-600 w-20">{day.date.slice(-5)}</span>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-6 relative">
                              <div 
                                className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${(day.views / 200) * 100}%` }}
                              >
                                <span className="text-xs text-white font-medium">{day.views}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 w-20 text-right">{day.visitors} ziyaretçi</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Country Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-600" />
                      Ülke Dağılımı
                    </h4>
                    <div className="space-y-3">
                      {userData.countryStats.map((country) => (
                        <div key={country.country} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{country.flag}</span>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{country.country}</span>
                              <p className="text-xs text-gray-500">{country.city}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{country.views}</span>
                            <span className="text-xs text-gray-500 block">%{country.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Trafik Kaynakları</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.referrerStats.map((referrer) => (
                      <div key={referrer.source} className="text-center">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-2xl font-bold text-gray-900">{referrer.views}</div>
                          <div className="text-sm text-gray-600">{referrer.source}</div>
                          <div className="text-xs text-gray-500">%{referrer.percentage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Lead Yönetimi</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Lead'leri İndir</span>
                  </button>
                </div>

                {/* Leads Table */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lead Bilgileri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İletişim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mesaj
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userData.recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-medium text-sm">
                                  {lead.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                <div className="text-sm text-gray-500">Lead #{lead.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {lead.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{lead.date}</div>
                            <div className="text-xs">{lead.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Mail className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Phone className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Ayarları</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Account Management */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Hesap Yönetimi</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Edit className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">Profil Bilgilerini Düzenle</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm">Şifre Değiştir</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </button>

                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                          <span className="text-sm">Abonelik Yönetimi</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </button>

                      <button className="w-full text-left p-3 border-red-200 border rounded-lg hover:bg-red-50 flex items-center justify-between text-red-600">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="text-sm">Hesabı Devre Dışı Bırak</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Veri Yönetimi</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Download className="h-5 w-5 text-green-600" />
                          <span className="text-sm">Kullanıcı Verilerini İndir</span>
                        </div>
                      </button>

                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">Analitik Verilerini Sıfırla</span>
                        </div>
                      </button>

                      <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-5 w-5 text-orange-600" />
                          <span className="text-sm">Aktivite Logları</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Hesap Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Kayıt Tarihi:</span>
                      <span className="ml-2 font-medium">{userData.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Son Giriş:</span>
                      <span className="ml-2 font-medium">{userData.lastLogin}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Abonelik Bitiş:</span>
                      <span className="ml-2 font-medium">{userData.subscriptionExpiry}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Kullanıcı ID:</span>
                      <span className="ml-2 font-mono text-xs">{userData.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}