"use client"

import { useEffect, useState } from "react"
import DocumentUpload from "@/components/DocumentUpload"
import { 
  User, Save, ArrowLeft, Building, Phone, Mail, Globe, MapPin,
  Instagram, Linkedin, Twitter, Facebook, Youtube, Github,
  FileText, CreditCard, Award, Briefcase, GraduationCap,
  Package, Star, ShoppingBag, Receipt, Landmark, Upload,
  Plus, Trash2, Eye, EyeOff, CheckCircle, AlertCircle,
  Camera, Link2, MessageSquare, DollarSign, Shield, Palette
} from "lucide-react"

export default function ProfileManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [user, setUser] = useState<any>(null)
  const [themes, setThemes] = useState<any[]>([])
  const [selectedTheme, setSelectedTheme] = useState("default")

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
    services: [],

    // Tema Seçimi
    theme: {
      currentTheme: "default",
      availableThemes: []
    }
  })

  // Tema verilerini çek
  const fetchThemes = async (userEmail: string) => {
    try {
      console.log('🎨 Temalar yükleniyor:', userEmail)
      const response = await fetch(`/api/themes?userEmail=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('✅ Temalar yüklendi:', data.themes.length)
          setThemes(data.themes)
          setProfileData(prev => ({
            ...prev,
            theme: {
              ...prev.theme,
              availableThemes: data.themes
            }
          }))
        }
      }
    } catch (error) {
      console.error('❌ Tema yükleme hatası:', error)
    }
  }

  // Kullanıcı ve profil verilerini çek
  const fetchUserProfile = async (userEmail: string) => {
    try {
      console.log('📖 Profil bilgileri yükleniyor:', userEmail)
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('✅ API profil verisi:', data.profile)
          // API'den gelen tüm profil bilgilerini kapsamlı şekilde set et
          setProfileData(prevData => ({
            ...prevData,
            personal: {
              ...prevData.personal,
              name: data.profile.name || "",
              title: data.profile.title || "",
              bio: data.profile.bio || "",
              profileImage: data.profile.profileImage || "",
              coverImage: data.profile.coverImageUrl || ""
            },
            company: {
              ...prevData.company,
              name: data.profile.companyName || "",
              legalName: data.profile.companyLegalName || "",
              logo: data.profile.logoUrl || "",
              slogan: data.profile.companySlogan || "",
              description: data.profile.companyDescription || "",
              foundedYear: data.profile.companyFoundedYear || "",
              employeeCount: data.profile.companyEmployeeCount || "",
              sector: data.profile.companySector || ""
            },
            contact: {
              ...prevData.contact,
              email: data.profile.email || "",
              phone: data.profile.phone || "",
              alternativePhone: data.profile.alternativePhone || "",
              whatsapp: data.profile.whatsapp || "",
              alternativeEmail: data.profile.alternativeEmail || "",
              website: data.profile.website || ""
            },
            location: {
              ...prevData.location,
              address: data.profile.address || "",
              city: data.profile.city || "",
              district: data.profile.district || "",
              country: data.profile.country || "Türkiye",
              postalCode: data.profile.postalCode || "",
              googleMapsUrl: data.profile.googleMapsUrl || "",
              workingHours: data.profile.workingHours || {
                weekdays: "",
                saturday: "",
                sunday: ""
              }
            },
            subscription: {
              ...prevData.subscription,
              isPremium: data.profile.isPremium || false,
              plan: data.profile.subscriptionPlan || "Free"
            },
            // E-Ticaret bilgileri
            ecommerce: {
              ...prevData.ecommerce,
              shopUrl: data.profile.shopUrl || "",
              catalogUrl: data.profile.catalogUrl || "",
              whatsappCatalog: data.profile.whatsappCatalog || false
            },
            // Fatura bilgileri
            billing: {
              ...prevData.billing,
              companyTitle: data.profile.companyTitle || "",
              taxOffice: data.profile.taxOffice || "",
              taxNumber: data.profile.taxNumber || "",
              tradeRegisterNo: data.profile.tradeRegisterNo || "",
              mersisNo: data.profile.mersisNo || "",
              address: data.profile.billingAddress || ""
            },
            // Belgeler
            documents: {
              ...prevData.documents,
              cvUrl: data.profile.cvUrl || "",
              portfolio: data.profile.portfolioUrl || "",
              brochure: data.profile.brochureUrl || ""
            },
            // Sosyal medya - API'den gelen veriyi set et
            socialMedia: data.profile.socialLinks && data.profile.socialLinks.length > 0 
              ? data.profile.socialLinks.map((link: any) => ({
                  platform: link.platform,
                  url: link.url,
                  enabled: link.isVisible !== false
                }))
              : prevData.socialMedia,
            // Banka hesapları - API'den gelen veriyi set et
            banking: data.profile.bankAccounts && data.profile.bankAccounts.length > 0 
              ? data.profile.bankAccounts.map((account: any) => ({
                  bankName: account.bankName,
                  iban: account.iban,
                  accountName: account.accountName,
                  enabled: account.isEnabled !== false
                }))
              : prevData.banking,
            // Theme ve diğer ayarlar
            theme: data.profile.theme || "modern",
            isPublic: data.profile.isPublic !== undefined ? data.profile.isPublic : true
          }))
          console.log('🔄 Profile data güncellendi')
        }
      }
    } catch (error) {
      console.error('❌ Profil yüklenme hatası:', error)
    }
  }

  // Tema değişikliğini kaydet
  const handleThemeChange = async (themeId: string) => {
    try {
      console.log('🎨 Tema değiştiriliyor:', themeId)
      setSelectedTheme(themeId)
      
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          themeId: themeId
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('✅ Tema başarıyla değiştirildi:', themeId)
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
          
          // Profile data'yı güncelle
          setProfileData(prev => ({
            ...prev,
            theme: {
              ...prev.theme,
              currentTheme: themeId
            }
          }))
        }
      } else {
        console.error('❌ Tema değiştirme hatası')
      }
    } catch (error) {
      console.error('❌ Tema değiştirme hatası:', error)
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
        // Tema verilerini API'den çek
        fetchThemes(userData.email)
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


  // Image upload fonksiyonu
  const handleImageUpload = async (file: File, type: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        console.log(`✅ ${type} upload başarılı:`, result.url)
        return result.url
      } else {
        throw new Error(result.message || 'Upload başarısız')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  // Profile image upload handler
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const result = await handleImageUpload(file, 'profile')
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          profileImage: result
        }
      }))
      
      console.log('Profile image updated:', result)
      
      // Show success message with optimization info
      alert(`✅ Profil fotoğrafı başarıyla yüklendi!\n📏 150x150 pixel boyutunda optimize edildi\n🎯 Yüz tespiti ile otomatik kırpıldı\n⭕ Circular (yuvarlak) format uygulandı`)
      
    } catch (error) {
      alert('Profil resmi yüklenirken hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Logo upload handler
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const result = await handleImageUpload(file, 'logo')
      setProfileData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          logo: result
        }
      }))
      
      console.log('Company logo updated:', result)
      
      // Show success message with optimization info
      alert(`✅ Şirket logosu başarıyla yüklendi!\n📏 200x200 pixel maksimum boyutunda optimize edildi\n🔲 Orantılar korundu\n🌟 Şeffaf arka plan uygulandı`)
      
    } catch (error) {
      alert('Logo yüklenirken hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Cover image upload handler
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const coverUrl = await handleImageUpload(file, 'cover')
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          coverImage: coverUrl
        }
      }))
      
      console.log('Cover image updated:', coverUrl)
      
      // Show success message with optimization info
      alert(`✅ Kapak görseli başarıyla yüklendi!\n📏 1200x400 pixel boyutunda optimize edildi\n🎯 Merkez odaklı kırpıldı\n🖼️ Banner format uygulandı`)
      
    } catch (error) {
      alert('Kapak resmi yüklenirken hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user?.email) return
    
    setLoading(true)
    try {
      console.log("💾 Profil kaydediliyor:", profileData)
      
      // Save profile data
      const profileResponse = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          slug: user.profile?.slug || user.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'user',
          name: profileData.personal.name || user.name,
          title: profileData.personal.title,
          bio: profileData.personal.bio,
          // İletişim bilgileri
          phone: profileData.contact.phone,
          alternativePhone: profileData.contact.alternativePhone,
          whatsapp: profileData.contact.whatsapp || profileData.contact.phone,
          email: profileData.contact.email || user.email,
          alternativeEmail: profileData.contact.alternativeEmail,
          website: profileData.contact.website,
          // Lokasyon bilgileri
          address: profileData.location.address,
          city: profileData.location.city,
          district: profileData.location.district,
          country: profileData.location.country,
          postalCode: profileData.location.postalCode,
          googleMapsUrl: profileData.location.googleMapsUrl,
          workingHours: profileData.location.workingHours,
          // Şirket bilgileri
          companyName: profileData.company.name,
          companyLegalName: profileData.company.legalName,
          companySlogan: profileData.company.slogan,
          companyDescription: profileData.company.description,
          companySector: profileData.company.sector,
          companyFoundedYear: profileData.company.foundedYear,
          companyEmployeeCount: profileData.company.employeeCount,
          // Görseller
          profileImage: profileData.personal.profileImage,
          coverImageUrl: profileData.personal.coverImage,
          logoUrl: profileData.company.logo,
          // E-Ticaret
          shopUrl: profileData.ecommerce.shopUrl,
          catalogUrl: profileData.ecommerce.catalogUrl,
          whatsappCatalog: profileData.ecommerce.whatsappCatalog,
          // Fatura Bilgileri
          companyTitle: profileData.billing.companyTitle,
          taxOffice: profileData.billing.taxOffice,
          taxNumber: profileData.billing.taxNumber,
          tradeRegisterNo: profileData.billing.tradeRegisterNo,
          mersisNo: profileData.billing.mersisNo,
          billingAddress: profileData.billing.address,
          // Google Business
          googleReviewsUrl: profileData.googleBusiness.reviewsUrl,
          googleRating: profileData.googleBusiness.rating,
          googleReviewCount: profileData.googleBusiness.reviewCount,
          showGoogleReviews: profileData.googleBusiness.showReviews,
          // Belgeler
          cvUrl: profileData.documents.cvUrl,
          portfolioUrl: profileData.documents.portfolio,
          brochureUrl: profileData.documents.brochure,
          // Diğer
          isPublic: true,
          theme: selectedTheme || profileData.theme.currentTheme || "default",
          themeId: selectedTheme || profileData.theme.currentTheme || "default",
          // Sosyal medya ve banka bilgileri
          socialLinks: profileData.socialMedia,
          bankAccounts: profileData.banking,
          // Hizmetler, deneyim, eğitim, özellikler
          services: profileData.services,
          experience: profileData.experience,
          education: profileData.education,
          features: profileData.features
        })
      })

      const profileResult = await profileResponse.json()
      
      if (!profileResponse.ok || !profileResult.success) {
        throw new Error(profileResult.message || 'Profil kaydetme başarısız')
      }

      // Social media and bank accounts are now saved via main profile API
      console.log("📱 Sosyal medya ve banka bilgileri ana API ile kaydedildi")

      console.log("✅ Tüm profil verileri başarıyla kaydedildi")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // Local user state'i güncelle
      const updatedUser = {
        ...user,
        name: profileData.personal.name || user.name,
        profile: profileResult.profile
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      // Başarı mesajı
      alert("✅ Tüm profil bilgileriniz başarıyla kaydedildi!")
      
    } catch (error) {
      console.error("❌ Profil kaydetme hatası:", error)
      alert("Profil kaydedilirken bir hata oluştu: " + error.message)
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
    { id: "theme", label: "Tema", icon: Palette },
    { id: "documents", label: "Belgeler", icon: FileText },
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
                          onChange={handleProfileImageUpload}
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
                          onChange={handleCoverImageUpload}
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
                          onChange={handleLogoUpload}
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
                            {profileData.banking.length > 1 && (
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    const updated = profileData.banking.filter((_, i) => i !== index)
                                    setProfileData({ ...profileData, banking: updated })
                                  }}
                                  className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Sil</span>
                                </button>
                              </div>
                            )}
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
                    
                    <button 
                      onClick={() => {
                        setProfileData({
                          ...profileData,
                          banking: [
                            ...profileData.banking,
                            { bankName: "", iban: "", accountName: "", enabled: false }
                          ]
                        })
                      }}
                      className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition flex items-center justify-center space-x-2"
                    >
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
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              value={service.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...profileData.services]
                                updated[index].imageUrl = e.target.value
                                setProfileData({ ...profileData, services: updated })
                              }}
                              className="flex-1 px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 text-sm"
                              placeholder="Hizmet görseli URL'si"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  try {
                                    const url = await handleImageUpload(file, 'gallery')
                                    const updated = [...profileData.services]
                                    updated[index].imageUrl = url
                                    setProfileData({ ...profileData, services: updated })
                                  } catch (error) {
                                    alert('Görsel yüklenirken hata oluştu: ' + error.message)
                                  }
                                }
                              }}
                              className="hidden"
                              id={`service-upload-${index}`}
                            />
                            <label
                              htmlFor={`service-upload-${index}`}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer flex items-center space-x-1 text-sm"
                            >
                              <Upload className="h-3 w-3" />
                              <span>Yükle</span>
                            </label>
                          </div>
                          <button 
                            onClick={() => {
                              const updated = profileData.services.filter((_, i) => i !== index)
                              setProfileData({ ...profileData, services: updated })
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
                          services: [...profileData.services, { title: "", description: "", price: "", imageUrl: "" }]
                        })
                      }}
                      className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition flex flex-col items-center justify-center space-y-2 text-gray-400 hover:text-white"
                    >
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

              {/* Theme Tab */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-400" />
                    Tema Seçimi
                  </h2>
                  
                  <p className="text-gray-400 text-sm">
                    Kartvizitinizin görünümünü özelleştirin. Mevcut abonelik durumunuz: {' '}
                    <span className="text-blue-400 font-medium">{profileData.subscription.plan}</span>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`relative border-2 rounded-lg p-4 transition-all cursor-pointer ${
                          theme.isLocked 
                            ? "border-gray-700 opacity-75 cursor-not-allowed" 
                            : selectedTheme === theme.id
                              ? "border-blue-500 shadow-lg shadow-blue-500/20"
                              : "border-gray-700 hover:border-gray-600"
                        }`}
                        onClick={() => !theme.isLocked && handleThemeChange(theme.id)}
                      >
                        {/* Theme Preview */}
                        <div
                          className="w-full h-24 rounded-lg mb-3 p-3 relative overflow-hidden"
                          style={{
                            backgroundColor: theme.backgroundColor || '#000',
                            color: theme.textColor || '#fff'
                          }}
                        >
                          {/* Header bar */}
                          <div
                            className="w-full h-2 rounded mb-2"
                            style={{ backgroundColor: theme.primaryColor || '#3b82f6' }}
                          />
                          
                          {/* Content lines */}
                          <div className="space-y-1">
                            <div
                              className="w-3/4 h-1 rounded"
                              style={{ backgroundColor: theme.textColor || '#fff', opacity: 0.7 }}
                            />
                            <div
                              className="w-1/2 h-1 rounded"
                              style={{ backgroundColor: theme.textColor || '#fff', opacity: 0.5 }}
                            />
                          </div>

                          {/* Button */}
                          <div
                            className="absolute bottom-2 right-2 w-4 h-2 rounded text-xs"
                            style={{ backgroundColor: theme.secondaryColor || '#8b5cf6' }}
                          />

                          {/* Selected indicator */}
                          {selectedTheme === theme.id && !theme.isLocked && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                          )}
                          
                          {/* Locked indicator */}
                          {theme.isLocked && (
                            <div className="absolute top-2 right-2 bg-gray-600 text-white rounded-full p-1">
                              <Shield className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        {/* Theme Info */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white">{theme.name}</h3>
                            {theme.subscriptionLevel && theme.subscriptionLevel !== 'Free' && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                theme.isLocked ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 text-white'
                              }`}>
                                {theme.subscriptionLevel}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: theme.primaryColor || '#3b82f6' }}
                              title="Ana renk"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: theme.secondaryColor || '#8b5cf6' }}
                              title="İkincil renk"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-600"
                              style={{ backgroundColor: theme.backgroundColor || '#000' }}
                              title="Arkaplan rengi"
                            />
                          </div>

                          <p className="text-xs text-gray-500 capitalize">
                            {theme.layout || 'modern'} • {theme.font || 'inter'}
                          </p>
                        </div>

                        {/* Apply button */}
                        {selectedTheme !== theme.id && !theme.isLocked && (
                          <button
                            className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleThemeChange(theme.id)
                            }}
                          >
                            Uygula
                          </button>
                        )}
                        
                        {/* Locked button */}
                        {theme.isLocked && (
                          <button
                            className="w-full mt-3 px-3 py-1.5 bg-gray-700 text-gray-400 rounded text-sm cursor-not-allowed"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {theme.subscriptionLevel} Gerekli
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Custom Theme Info */}
                  <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
                    <h4 className="font-medium text-blue-400 mb-2">
                      Özel Tema Oluştur
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Pro ve üzeri planlarda kendi renklerinizi ve fontlarınızı kullanarak özel temalar oluşturabilirsiniz.
                    </p>
                    {profileData.subscription.plan === 'Free' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        Pro Plana Yükselt
                      </button>
                    )}
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