"use client"

import { useEffect, useState } from "react"
import DocumentUpload from "@/components/DocumentUpload"
import { 
  User, Save, ArrowLeft, Building, Phone, Mail, Globe, MapPin,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Github,
  FileText, CreditCard, Award, Briefcase, GraduationCap,
  Package, Star, ShoppingBag, Receipt, Landmark, Upload,
  Plus, Trash2, Eye, EyeOff, CheckCircle, AlertCircle,
  Camera, Link2, MessageSquare, DollarSign, Shield
} from "lucide-react"

export default function ProfileManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [user, setUser] = useState<any>(null)

  // Comprehensive Profile Data
  const [profileData, setProfileData] = useState({
    // Üyelik Bilgileri
    subscription: {
      isPremium: true,
      plan: "QART Lifetime",
      startDate: "2024-12-01",
      status: "active"
    },
    
    // Kişisel Bilgiler
    personal: {
      name: "",
      title: "",
      bio: "",
      profileImage: "",
      coverImage: ""
    },

    // Şirket Bilgileri
    company: {
      name: "",
      legalName: "",
      logo: "",
      slogan: "",
      description: "",
      foundedYear: "",
      employeeCount: "",
      sector: ""
    },

    // İletişim Bilgileri
    contact: {
      phone: "",
      alternativePhone: "",
      whatsapp: "",
      email: "",
      alternativeEmail: "",
      website: "",
      addToContactsEnabled: true
    },

    // Adres & Lokasyon
    location: {
      address: "",
      city: "",
      district: "",
      country: "Türkiye",
      postalCode: "",
      googleMapsUrl: "",
      workingHours: {
        weekdays: "09:00 - 18:00",
        saturday: "09:00 - 14:00",
        sunday: "Kapalı"
      }
    },

    // Sosyal Medya
    socialMedia: [
      { platform: "LinkedIn", url: "", enabled: false },
      { platform: "Instagram", url: "", enabled: false },
      { platform: "Facebook", url: "", enabled: false },
      { platform: "Twitter", url: "", enabled: false },
      { platform: "YouTube", url: "", enabled: false },
      { platform: "GitHub", url: "", enabled: false }
    ],

    // CV & Belgeler
    documents: {
      cvUrl: "",
      portfolio: "",
      certificates: [],
      brochure: ""
    },

    // Google İşletme
    googleBusiness: {
      reviewsUrl: "",
      rating: 0,
      reviewCount: 0,
      embedded: false,
      showReviews: false
    },

    // E-Ticaret
    ecommerce: {
      shopUrl: "",
      products: [],
      catalogUrl: "",
      whatsappCatalog: false
    },

    // Fatura Bilgileri
    billing: {
      companyTitle: "",
      taxOffice: "",
      taxNumber: "",
      tradeRegisterNo: "",
      mersisNo: "",
      address: ""
    },

    // Banka Bilgileri
    banking: [
      { bankName: "", iban: "", accountName: "", enabled: false },
      { bankName: "", iban: "", accountName: "", enabled: false },
      { bankName: "", iban: "", accountName: "", enabled: false }
    ],

    // Deneyim & Eğitim
    experience: [],

    education: [],

    // Şirket Özellikleri
    features: [],

    // Hizmetler
    services: []
  })

  // Kullanıcı ve profil verilerini çek
  const fetchUserProfile = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // API'den gelen temel profil bilgilerini set et
          setProfileData(prevData => ({
            ...prevData,
            personal: {
              ...prevData.personal,
              name: data.profile.name || "",
              title: data.profile.title || "",
              bio: data.profile.bio || ""
            },
            contact: {
              ...prevData.contact,
              email: data.profile.email || ""
            },
            subscription: {
              ...prevData.subscription,
              isPremium: data.profile.isPremium || false,
              plan: data.profile.subscriptionPlan || "Free"
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Component mount olduğunda kullanıcı verilerini çek
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        
        // Kullanıcı profil bilgilerini API'den çek
        fetchUserProfile(userData.email)
      } catch (error) {
        console.error("Error parsing user data:", error)
        window.location.href = "/login"
        return
      }
    } else {
      window.location.href = "/login"
      return
    }
    
    setLoading(false)
  }, [])

  const handleFileUpload = async (file: File, type: 'profile' | 'cover' | 'logo') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const { url } = await response.json()
      
      // Update the appropriate field
      if (type === 'profile') {
        setProfileData(prev => ({
          ...prev,
          personal: { ...prev.personal, profileImage: url }
        }))
      } else if (type === 'cover') {
        setProfileData(prev => ({
          ...prev,
          personal: { ...prev.personal, coverImage: url }
        }))
      } else if (type === 'logo') {
        setProfileData(prev => ({
          ...prev,
          company: { ...prev.company, logo: url }
        }))
      }
      
      alert('Görsel başarıyla yüklendi!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Görsel yüklenirken hata oluştu!')
    }
  }

  const handleSave = async () => {
    if (!user?.email) return
    
    setLoading(true)
    try {
      // Profil güncelleme API çağrısı (gelecekte implementasyon)
      console.log("Saving profile data:", profileData)
      
      // Simulated save for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Profil kaydedilirken bir hata oluştu!")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "personal", label: "Kişisel", icon: User },
    { id: "company", label: "Şirket", icon: Building },
    { id: "contact", label: "İletişim", icon: Phone },
    { id: "location", label: "Lokasyon", icon: MapPin },
    { id: "social", label: "Sosyal Medya", icon: Link2 },
    { id: "documents", label: "Belgeler", icon: FileText },
    { id: "google", label: "Google İşletme", icon: Star },
    { id: "ecommerce", label: "E-Ticaret", icon: ShoppingBag },
    { id: "billing", label: "Fatura", icon: Receipt },
    { id: "banking", label: "Banka", icon: Landmark },
    { id: "experience", label: "Deneyim", icon: Briefcase },
    { id: "education", label: "Eğitim", icon: GraduationCap },
    { id: "features", label: "Özellikler", icon: Award },
    { id: "services", label: "Hizmetler", icon: Package }
  ]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-gray-400">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/main-dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </a>
              <div>
                <h1 className="text-xl font-bold text-white">Profil Yönetimi</h1>
                <p className="text-sm text-gray-400">Tüm profil bilgilerinizi buradan yönetin</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : saved ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saved ? "Kaydedildi!" : "Kaydet"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-600/30"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-400" />
                    Kişisel Bilgiler
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad *</label>
                      <input
                        type="text"
                        value={profileData.personal.name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          personal: { ...profileData.personal, name: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ünvan *</label>
                      <input
                        type="text"
                        value={profileData.personal.title}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          personal: { ...profileData.personal, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Örn: Elektrik Mühendisi"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Biyografi</label>
                      <textarea
                        value={profileData.personal.bio}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          personal: { ...profileData.personal, bio: e.target.value }
                        })}
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Kendinizi tanıtın..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Profil Fotoğrafı</label>
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 overflow-hidden">
                          {profileData.personal.profileImage ? (
                            <img src={profileData.personal.profileImage} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <Camera className="h-8 w-8 text-gray-500" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'profile')
                          }}
                          className="hidden"
                          id="profile-upload"
                        />
                        <label
                          htmlFor="profile-upload"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer"
                        >
                          Fotoğraf Yükle
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Kapak Görseli</label>
                      <div className="h-20 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'cover')
                          }}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label
                          htmlFor="cover-upload"
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm flex items-center space-x-2 cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Görsel Yükle</span>
                        </label>
                      </div>
                      {profileData.personal.coverImage && (
                        <img src={profileData.personal.coverImage} alt="Cover" className="mt-2 h-20 w-full object-cover rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info Tab */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-400" />
                    Şirket Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Şirket Adı *</label>
                      <input
                        type="text"
                        value={profileData.company.name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, name: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Resmi Ünvan</label>
                      <input
                        type="text"
                        value={profileData.company.legalName}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, legalName: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Slogan</label>
                      <input
                        type="text"
                        value={profileData.company.slogan}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, slogan: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="Şirket sloganınız"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Sektör</label>
                      <input
                        type="text"
                        value={profileData.company.sector}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, sector: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Kuruluş Yılı</label>
                      <input
                        type="text"
                        value={profileData.company.foundedYear}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, foundedYear: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Çalışan Sayısı</label>
                      <input
                        type="text"
                        value={profileData.company.employeeCount}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, employeeCount: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Şirket Açıklaması</label>
                      <textarea
                        value={profileData.company.description}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          company: { ...profileData.company, description: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Şirket Logosu</label>
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700 overflow-hidden">
                          {profileData.company.logo ? (
                            <img src={profileData.company.logo} alt="Logo" className="h-full w-full object-cover" />
                          ) : (
                            <Building className="h-8 w-8 text-gray-500" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'logo')
                          }}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer"
                        >
                          Logo Yükle
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-400" />
                    İletişim Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Telefon *</label>
                      <input
                        type="tel"
                        value={profileData.contact.phone}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, phone: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Alternatif Telefon</label>
                      <input
                        type="tel"
                        value={profileData.contact.alternativePhone}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, alternativePhone: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        value={profileData.contact.whatsapp}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, whatsapp: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">E-posta *</label>
                      <input
                        type="email"
                        value={profileData.contact.email}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, email: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Alternatif E-posta</label>
                      <input
                        type="email"
                        value={profileData.contact.alternativeEmail}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, alternativeEmail: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileData.contact.website}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          contact: { ...profileData.contact, website: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="https://"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={profileData.contact.addToContactsEnabled}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            contact: { ...profileData.contact, addToContactsEnabled: e.target.checked }
                          })}
                          className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Hızlı rehbere ekleme butonunu göster</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Link2 className="h-5 w-5 mr-2 text-blue-400" />
                    Sosyal Medya Hesapları
                  </h2>
                  
                  <div className="space-y-4">
                    {profileData.socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                        <input
                          type="checkbox"
                          checked={social.enabled}
                          onChange={(e) => {
                            const updated = [...profileData.socialMedia]
                            updated[index].enabled = e.target.checked
                            setProfileData({ ...profileData, socialMedia: updated })
                          }}
                          className="rounded bg-gray-700 border-gray-600 text-blue-600"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {social.platform}
                          </label>
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => {
                              const updated = [...profileData.socialMedia]
                              updated[index].url = e.target.value
                              setProfileData({ ...profileData, socialMedia: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder={`${social.platform} profil linkiniz`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banking Tab */}
              {activeTab === "banking" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-blue-400" />
                    Banka Hesapları
                  </h2>
                  
                  <div className="space-y-4">
                    {profileData.banking.map((bank, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={bank.enabled}
                            onChange={(e) => {
                              const updated = [...profileData.banking]
                              updated[index].enabled = e.target.checked
                              setProfileData({ ...profileData, banking: updated })
                            }}
                            className="mt-1 rounded bg-gray-700 border-gray-600 text-blue-600"
                          />
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Banka Adı</label>
                              <input
                                type="text"
                                value={bank.bankName}
                                onChange={(e) => {
                                  const updated = [...profileData.banking]
                                  updated[index].bankName = e.target.value
                                  setProfileData({ ...profileData, banking: updated })
                                }}
                                className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                                placeholder="Örn: Ziraat Bankası"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">IBAN</label>
                              <input
                                type="text"
                                value={bank.iban}
                                onChange={(e) => {
                                  const updated = [...profileData.banking]
                                  updated[index].iban = e.target.value
                                  setProfileData({ ...profileData, banking: updated })
                                }}
                                className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm font-mono"
                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Hesap Adı</label>
                              <input
                                type="text"
                                value={bank.accountName}
                                onChange={(e) => {
                                  const updated = [...profileData.banking]
                                  updated[index].accountName = e.target.value
                                  setProfileData({ ...profileData, banking: updated })
                                }}
                                className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                                placeholder="Hesap sahibinin adı"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Yeni Banka Hesabı Ekle</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-400" />
                    Hizmetler
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.services.map((service, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const updated = [...profileData.services]
                              updated[index].title = e.target.value
                              setProfileData({ ...profileData, services: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm font-medium"
                            placeholder="Hizmet başlığı"
                          />
                          <textarea
                            value={service.description}
                            onChange={(e) => {
                              const updated = [...profileData.services]
                              updated[index].description = e.target.value
                              setProfileData({ ...profileData, services: updated })
                            }}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Hizmet açıklaması"
                          />
                          <input
                            type="text"
                            value={service.price}
                            onChange={(e) => {
                              const updated = [...profileData.services]
                              updated[index].price = e.target.value
                              setProfileData({ ...profileData, services: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Fiyat bilgisi"
                          />
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition flex flex-col items-center justify-center space-y-2 text-gray-400 hover:text-white">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Yeni Hizmet Ekle</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === "location" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                    Lokasyon & Adres Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">İşletme Adresi *</label>
                      <textarea
                        value={profileData.location.address}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, address: e.target.value }
                        })}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="Tam adres bilgisi"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">İl</label>
                      <input
                        type="text"
                        value={profileData.location.city}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">İlçe</label>
                      <input
                        type="text"
                        value={profileData.location.district}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, district: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Posta Kodu</label>
                      <input
                        type="text"
                        value={profileData.location.postalCode}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, postalCode: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ülke</label>
                      <input
                        type="text"
                        value={profileData.location.country}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, country: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Google Maps URL</label>
                      <input
                        type="url"
                        value={profileData.location.googleMapsUrl}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          location: { ...profileData.location, googleMapsUrl: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Google Maps'ten işletmenizi bulun, paylaş butonuna tıklayın ve linki kopyalayın</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Çalışma Saatleri</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Hafta İçi</label>
                          <input
                            type="text"
                            value={profileData.location.workingHours.weekdays}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              location: { 
                                ...profileData.location, 
                                workingHours: { ...profileData.location.workingHours, weekdays: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="09:00 - 18:00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cumartesi</label>
                          <input
                            type="text"
                            value={profileData.location.workingHours.saturday}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              location: { 
                                ...profileData.location, 
                                workingHours: { ...profileData.location.workingHours, saturday: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="09:00 - 14:00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Pazar</label>
                          <input
                            type="text"
                            value={profileData.location.workingHours.sunday}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              location: { 
                                ...profileData.location, 
                                workingHours: { ...profileData.location.workingHours, sunday: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="Kapalı"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    Belgeler & CV
                  </h2>
                  
                  <div className="space-y-4">
                    <DocumentUpload
                      label="CV / Özgeçmiş"
                      value={profileData.documents.cvUrl}
                      onChange={(url) => setProfileData({
                        ...profileData,
                        documents: { ...profileData.documents, cvUrl: url }
                      })}
                      placeholder="CV dosya linki (Google Drive, Dropbox vb.)"
                      type="cv"
                    />
                    
                    <DocumentUpload
                      label="Portfolyo / Katalog"
                      value={profileData.documents.portfolio}
                      onChange={(url) => setProfileData({
                        ...profileData,
                        documents: { ...profileData.documents, portfolio: url }
                      })}
                      placeholder="Portfolyo dosya linki"
                      type="portfolio"
                    />
                    
                    <DocumentUpload
                      label="Şirket Broşürü"
                      value={profileData.documents.brochure}
                      onChange={(url) => setProfileData({
                        ...profileData,
                        documents: { ...profileData.documents, brochure: url }
                      })}
                      placeholder="Broşür dosya linki"
                      type="brochure"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Sertifikalar</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="Sertifika adı"
                          />
                          <input
                            type="url"
                            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="Sertifika linki"
                          />
                          <button className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Sertifika Ekle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Business Tab */}
              {activeTab === "google" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    Google İşletme
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Google İşletme URL'si</label>
                      <input
                        type="url"
                        value={profileData.googleBusiness.reviewsUrl}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          googleBusiness: { ...profileData.googleBusiness, reviewsUrl: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="https://g.page/işletme-adı"
                      />
                      <p className="text-xs text-gray-500 mt-1">Google İşletme profilinizin linkini girin. Puanlar otomatik çekilecek.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ortalama Puan (Otomatik)</label>
                      <div className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg border border-gray-600">
                        {profileData.googleBusiness.rating || '0.0'} ⭐
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Google'dan otomatik çekilir</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Yorum Sayısı (Otomatik)</label>
                      <div className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg border border-gray-600">
                        {profileData.googleBusiness.reviewCount || '0'} yorum
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Google'dan otomatik çekilir</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={profileData.googleBusiness.showReviews}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            googleBusiness: { ...profileData.googleBusiness, showReviews: e.target.checked }
                          })}
                          className="rounded bg-gray-800 border-gray-700 text-blue-600"
                        />
                        <span>Yorumları profilde göster</span>
                      </label>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={profileData.googleBusiness.embedded}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            googleBusiness: { ...profileData.googleBusiness, embedded: e.target.checked }
                          })}
                          className="rounded bg-gray-800 border-gray-700 text-blue-600"
                        />
                        <span>Google yorumları widget olarak göster</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Önizleme</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`h-5 w-5 ${star <= Math.floor(profileData.googleBusiness.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                        ))}
                      </div>
                      <span className="text-white font-medium">{profileData.googleBusiness.rating}</span>
                      <span className="text-gray-400">({profileData.googleBusiness.reviewCount} yorum)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* E-commerce Tab */}
              {activeTab === "ecommerce" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-green-400" />
                    E-Ticaret & Satış
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Online Mağaza URL'si</label>
                      <input
                        type="url"
                        value={profileData.ecommerce.shopUrl}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          ecommerce: { ...profileData.ecommerce, shopUrl: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="https://magazaniz.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ürün Kataloğu URL'si</label>
                      <input
                        type="url"
                        value={profileData.ecommerce.catalogUrl}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          ecommerce: { ...profileData.ecommerce, catalogUrl: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="PDF veya online katalog linki"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={profileData.ecommerce.whatsappCatalog}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            ecommerce: { ...profileData.ecommerce, whatsappCatalog: e.target.checked }
                          })}
                          className="rounded bg-gray-800 border-gray-700 text-blue-600"
                        />
                        <span>WhatsApp Business katalog özelliği aktif</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Öne Çıkan Ürünler</label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            className="px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="Ürün adı"
                          />
                          <input
                            type="text"
                            className="px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 text-sm"
                            placeholder="Fiyat"
                          />
                        </div>
                        <button className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Ürün Ekle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-purple-400" />
                    Fatura Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Firma Ünvanı *</label>
                      <input
                        type="text"
                        value={profileData.billing.companyTitle}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, companyTitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="Resmi firma ünvanınız"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Vergi Dairesi</label>
                      <input
                        type="text"
                        value={profileData.billing.taxOffice}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, taxOffice: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Vergi No</label>
                      <input
                        type="text"
                        value={profileData.billing.taxNumber}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, taxNumber: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Ticaret Sicil No</label>
                      <input
                        type="text"
                        value={profileData.billing.tradeRegisterNo}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, tradeRegisterNo: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">MERSİS No</label>
                      <input
                        type="text"
                        value={profileData.billing.mersisNo}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, mersisNo: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Fatura Adresi</label>
                      <textarea
                        value={profileData.billing.address}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          billing: { ...profileData.billing, address: e.target.value }
                        })}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
                        placeholder="Fatura adresi"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
                    Deneyim
                  </h2>
                  
                  <div className="space-y-4">
                    {profileData.experience.map((exp, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => {
                                const updated = [...profileData.experience]
                                updated[index].title = e.target.value
                                setProfileData({ ...profileData, experience: updated })
                              }}
                              className="px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                              placeholder="Pozisyon / Ünvan"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...profileData.experience]
                                updated[index].company = e.target.value
                                setProfileData({ ...profileData, experience: updated })
                              }}
                              className="px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                              placeholder="Şirket adı"
                            />
                          </div>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...profileData.experience]
                              updated[index].period = e.target.value
                              setProfileData({ ...profileData, experience: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Çalışma dönemi (Örn: 2020 - 2023)"
                          />
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...profileData.experience]
                              updated[index].description = e.target.value
                              setProfileData({ ...profileData, experience: updated })
                            }}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="İş tanımı ve sorumluluklar"
                          />
                          <button 
                            onClick={() => {
                              const updated = profileData.experience.filter((_, i) => i !== index)
                              setProfileData({ ...profileData, experience: updated })
                            }}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Kaldır</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => {
                        setProfileData({
                          ...profileData,
                          experience: [...profileData.experience, { title: "", company: "", period: "", description: "" }]
                        })
                      }}
                      className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Deneyim Ekle</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-indigo-400" />
                    Eğitim
                  </h2>
                  
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...profileData.education]
                              updated[index].degree = e.target.value
                              setProfileData({ ...profileData, education: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Bölüm / Program"
                          />
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const updated = [...profileData.education]
                              updated[index].school = e.target.value
                              setProfileData({ ...profileData, education: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Okul / Üniversite adı"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...profileData.education]
                              updated[index].year = e.target.value
                              setProfileData({ ...profileData, education: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Mezuniyet yılı veya dönemi"
                          />
                          <button 
                            onClick={() => {
                              const updated = profileData.education.filter((_, i) => i !== index)
                              setProfileData({ ...profileData, education: updated })
                            }}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Kaldır</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => {
                        setProfileData({
                          ...profileData,
                          education: [...profileData.education, { degree: "", school: "", year: "" }]
                        })
                      }}
                      className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Eğitim Ekle</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-400" />
                    Özellikler & Avantajlar
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.features.map((feature, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => {
                              const updated = [...profileData.features]
                              updated[index].title = e.target.value
                              setProfileData({ ...profileData, features: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm font-medium"
                            placeholder="Özellik başlığı"
                          />
                          <textarea
                            value={feature.description}
                            onChange={(e) => {
                              const updated = [...profileData.features]
                              updated[index].description = e.target.value
                              setProfileData({ ...profileData, features: updated })
                            }}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                            placeholder="Özellik açıklaması"
                          />
                          <select
                            value={feature.icon}
                            onChange={(e) => {
                              const updated = [...profileData.features]
                              updated[index].icon = e.target.value
                              setProfileData({ ...profileData, features: updated })
                            }}
                            className="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                          >
                            <option value="shield">Kalkan (Güvenlik)</option>
                            <option value="award">Ödül (Başarı)</option>
                            <option value="clock">Saat (Zaman)</option>
                            <option value="check">Onay (Garanti)</option>
                            <option value="star">Yıldız (Kalite)</option>
                            <option value="zap">Şimşek (Hız)</option>
                          </select>
                          <button 
                            onClick={() => {
                              const updated = profileData.features.filter((_, i) => i !== index)
                              setProfileData({ ...profileData, features: updated })
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => {
                        setProfileData({
                          ...profileData,
                          features: [...profileData.features, { icon: "star", title: "", description: "" }]
                        })
                      }}
                      className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition flex flex-col items-center justify-center space-y-2 text-gray-400 hover:text-white"
                    >
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Yeni Özellik Ekle</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Additional tabs would follow the same pattern */}
            </div>
          </div>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
            <CheckCircle className="h-5 w-5" />
            <span>Değişiklikler kaydedildi!</span>
          </div>
        )}
      </div>
    </div>
  )
}