"use client"

import { useEffect, useState } from "react"
import { 
  ArrowLeft, Palette, Eye, EyeOff, Settings, Monitor, Smartphone,
  Sun, Moon, Zap, Sparkles, Layers, Grid, List, Card,
  Check, X, Save, RefreshCw, Download, Upload, ChevronDown,
  User, Building, Phone, MapPin, Link2, FileText, Star,
  ShoppingBag, Receipt, Landmark, Briefcase, GraduationCap,
  Award, Package, MessageSquare, Shield, Clock, BadgeCheck,
  Mail, Send, Code, Headphones, Truck, CheckCircle
} from "lucide-react"

export default function PageLayoutPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("visibility")
  const [previewMode, setPreviewMode] = useState("desktop")
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({
    name: "Kullanıcı",
    title: "Pozisyon",
    companyName: "Şirket",
    email: "email@example.com",
    phone: "+90 555 000 0000"
  })
  
  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    selectedTheme: "modern-dark",
    customColors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
      background: "#0F172A",
      text: "#E2E8F0"
    },
    font: "Inter",
    borderRadius: "medium",
    animations: true,
    glassmorphism: true
  })

  // Visibility Settings
  const [visibilitySettings, setVisibilitySettings] = useState({
    personal: {
      name: true,
      title: true,
      bio: true,
      profileImage: true,
      coverImage: true
    },
    company: {
      name: true,
      logo: true,
      slogan: true,
      description: true,
      details: true
    },
    contact: {
      phone: true,
      alternativePhone: false,
      whatsapp: true,
      email: true,
      alternativeEmail: false,
      website: true,
      addToContacts: true
    },
    location: {
      address: true,
      map: true,
      workingHours: true
    },
    social: {
      linkedin: true,
      instagram: true,
      facebook: true,
      twitter: false,
      youtube: true,
      github: false
    },
    sections: {
      documents: true,
      googleReviews: true,
      ecommerce: false,
      billing: false,
      banking: true,
      experience: true,
      education: true,
      features: true,
      services: true
    }
  })

  // Fetch user profile on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // Fetch profile data
      fetch(`/api/user/profile?email=${encodeURIComponent(userData.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            setProfile(data.profile)
          }
        })
    }
  }, [])

  // Available Themes
  const themes = [
    {
      id: "modern-dark",
      name: "Modern Dark",
      description: "Profesyonel karanlık tema",
      preview: "bg-gradient-to-br from-gray-900 to-black",
      isPremium: false
    },
    {
      id: "elegant-light",
      name: "Elegant Light", 
      description: "Temiz ve minimal",
      preview: "bg-gradient-to-br from-white to-gray-100",
      isPremium: false
    },
    {
      id: "ocean-blue",
      name: "Ocean Blue",
      description: "Sakin mavi tonları",
      preview: "bg-gradient-to-br from-blue-900 to-cyan-800",
      isPremium: true
    },
    {
      id: "sunset-warm",
      name: "Sunset Warm",
      description: "Sıcak turuncu tonları", 
      preview: "bg-gradient-to-br from-orange-800 to-red-900",
      isPremium: true
    },
    {
      id: "nature-green",
      name: "Nature Green",
      description: "Doğal yeşil tema",
      preview: "bg-gradient-to-br from-green-900 to-emerald-800",
      isPremium: true
    },
    {
      id: "royal-purple",
      name: "Royal Purple",
      description: "Lüks mor tonları",
      preview: "bg-gradient-to-br from-purple-900 to-pink-800",
      isPremium: true
    },
    {
      id: "custom",
      name: "Özelleştir",
      description: "Kendi temanızı oluşturun",
      preview: "bg-gradient-to-br from-gray-800 to-gray-900",
      isPremium: true,
      isCustom: true
    }
  ]

  // Font Options
  const fonts = [
    { id: "inter", name: "Inter", sample: "font-sans", isPremium: false },
    { id: "roboto", name: "Roboto", sample: "font-sans", isPremium: false },
    { id: "poppins", name: "Poppins", sample: "font-sans", isPremium: true },
    { id: "montserrat", name: "Montserrat", sample: "font-sans", isPremium: true },
    { id: "playfair", name: "Playfair Display", sample: "font-serif", isPremium: true },
    { id: "lora", name: "Lora", sample: "font-serif", isPremium: true }
  ]

  const handleSave = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleThemeSelect = (themeId: string) => {
    setThemeSettings({ ...themeSettings, selectedTheme: themeId })
  }

  const toggleVisibility = (section: string, item: string) => {
    setVisibilitySettings({
      ...visibilitySettings,
      [section]: {
        ...visibilitySettings[section as keyof typeof visibilitySettings],
        [item]: !visibilitySettings[section as keyof typeof visibilitySettings][item as keyof typeof visibilitySettings[typeof section]]
      }
    })
  }

  return (
    <div className={`min-h-screen ${
      themeSettings.selectedTheme === "modern-dark" 
        ? "bg-gradient-to-br from-gray-900 via-black to-gray-900" 
        : themeSettings.selectedTheme === "elegant-light"
        ? "bg-gradient-to-br from-white to-gray-100"
        : "bg-gradient-to-br from-gray-900 via-black to-gray-900"
    }`}>
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/main-dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </a>
              <div>
                <h1 className="text-xl font-bold text-white">Sayfa Düzeni</h1>
                <p className="text-sm text-gray-400">Tema ve görünüm ayarları</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <a
                href={profile.slug ? `/${profile.slug}` : "/"}
                target="_blank"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Önizle</span>
              </a>
              
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sticky top-24">
              <h3 className="text-white font-medium mb-4">Ayar Kategorileri</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("visibility")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-left ${
                    activeTab === "visibility"
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-600/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Eye className="h-5 w-5" />
                  <div>
                    <div className="text-sm font-medium">Görünüm Ayarları</div>
                    <div className="text-xs text-gray-500">Hangi bilgiler gösterilsin</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("theme")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-left ${
                    activeTab === "theme"
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-600/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Palette className="h-5 w-5" />
                  <div>
                    <div className="text-sm font-medium">Tema Seçimi</div>
                    <div className="text-xs text-gray-500">Renk ve görünüm</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("advanced")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-left ${
                    activeTab === "advanced"
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-600/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <div>
                    <div className="text-sm font-medium">Gelişmiş Ayarlar</div>
                    <div className="text-xs text-gray-500">SEO, güvenlik</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {/* Visibility Settings Tab */}
            {activeTab === "visibility" && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-400" />
                  Görünüm Ayarları
                </h2>
                
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button 
                      onClick={() => {
                        const newSettings = { ...visibilitySettings }
                        Object.keys(newSettings).forEach(section => {
                          if (typeof newSettings[section] === 'object') {
                            Object.keys(newSettings[section]).forEach(key => {
                              newSettings[section][key] = true
                            })
                          }
                        })
                        setVisibilitySettings(newSettings)
                      }}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Tümünü Aç
                    </button>
                    <button 
                      onClick={() => {
                        const newSettings = { ...visibilitySettings }
                        Object.keys(newSettings).forEach(section => {
                          if (typeof newSettings[section] === 'object') {
                            Object.keys(newSettings[section]).forEach(key => {
                              newSettings[section][key] = false
                            })
                          }
                        })
                        setVisibilitySettings(newSettings)
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Tümünü Kapat
                    </button>
                  </div>

                  {/* Personal Info Visibility */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-400" />
                      Kişisel Bilgiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(visibilitySettings.personal).map(([key, value]) => {
                        const labels = {
                          name: "Ad Soyad",
                          title: "Ünvan/Pozisyon", 
                          bio: "Biyografi/Hakkında",
                          profileImage: "Profil Fotoğrafı",
                          coverImage: "Kapak Görseli"
                        }
                        return (
                          <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                            <span className="text-sm text-gray-300">{labels[key] || key}</span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleVisibility("personal", key)}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Company Info Visibility */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-purple-400" />
                      Şirket Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(visibilitySettings.company).map(([key, value]) => {
                        const labels = {
                          name: "Şirket Adı",
                          logo: "Şirket Logosu",
                          slogan: "Slogan",
                          description: "Şirket Açıklaması",
                          details: "Detay Bilgileri"
                        }
                        return (
                          <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                            <span className="text-sm text-gray-300">{labels[key] || key}</span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleVisibility("company", key)}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Contact Info Visibility */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-green-400" />
                      İletişim Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(visibilitySettings.contact).map(([key, value]) => {
                        const labels = {
                          phone: "Ana Telefon",
                          alternativePhone: "Alternatif Telefon",
                          whatsapp: "WhatsApp",
                          email: "E-posta",
                          alternativeEmail: "Alternatif E-posta",
                          website: "Website",
                          addToContacts: "Rehbere Ekleme Butonu"
                        }
                        return (
                          <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                            <span className="text-sm text-gray-300">{labels[key] || key}</span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleVisibility("contact", key)}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Sections Visibility */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-yellow-400" />
                      İçerik Bölümleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(visibilitySettings.sections).map(([key, value]) => {
                        const labels = {
                          documents: "Belgeler & CV",
                          googleReviews: "Google Yorumları",
                          ecommerce: "E-Ticaret Linkleri",
                          billing: "Fatura Bilgileri",
                          banking: "Banka Hesapları",
                          experience: "Deneyim",
                          education: "Eğitim",
                          features: "Özellikler & Avantajlar",
                          services: "Hizmetler"
                        }
                        return (
                          <label key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                            <span className="text-sm text-gray-300">{labels[key] || key}</span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleVisibility("sections", key)}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Selection Tab */}
            {activeTab === "theme" && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  Tema Seçimi
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => !theme.isPremium && handleThemeSelect(theme.id)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                        themeSettings.selectedTheme === theme.id
                          ? "ring-2 ring-blue-500 scale-105"
                          : theme.isPremium
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                    >
                      <div className={`h-32 ${theme.preview}`}>
                        {theme.isPremium && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                            PRO
                          </div>
                        )}
                        {theme.isCustom && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Settings className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-800 p-3">
                        <h3 className="text-white font-medium">{theme.name}</h3>
                        <p className="text-gray-400 text-sm">{theme.description}</p>
                      </div>
                      {themeSettings.selectedTheme === theme.id && (
                        <div className="absolute top-2 left-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Custom Theme Settings */}
                {themeSettings.selectedTheme === "custom" && (
                  <div className="space-y-6 border-t border-gray-800 pt-6">
                    <h3 className="text-white font-medium">Özel Tema Ayarları</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Ana Renk</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={themeSettings.customColors.primary}
                            onChange={(e) => setThemeSettings({
                              ...themeSettings,
                              customColors: { ...themeSettings.customColors, primary: e.target.value }
                            })}
                            className="h-10 w-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeSettings.customColors.primary}
                            onChange={(e) => setThemeSettings({
                              ...themeSettings,
                              customColors: { ...themeSettings.customColors, primary: e.target.value }
                            })}
                            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">İkincil Renk</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={themeSettings.customColors.secondary}
                            onChange={(e) => setThemeSettings({
                              ...themeSettings,
                              customColors: { ...themeSettings.customColors, secondary: e.target.value }
                            })}
                            className="h-10 w-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeSettings.customColors.secondary}
                            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Vurgu Rengi</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={themeSettings.customColors.accent}
                            onChange={(e) => setThemeSettings({
                              ...themeSettings,
                              customColors: { ...themeSettings.customColors, accent: e.target.value }
                            })}
                            className="h-10 w-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeSettings.customColors.accent}
                            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded border border-gray-700 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Font Selection */}
                <div className="space-y-4 border-t border-gray-800 pt-6 mt-6">
                  <h3 className="text-white font-medium">Yazı Tipi</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => !font.isPremium && setThemeSettings({ ...themeSettings, font: font.id })}
                        className={`relative p-3 rounded-lg border transition ${
                          themeSettings.font === font.id
                            ? "bg-blue-600/20 border-blue-600 text-white"
                            : font.isPremium
                            ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                        }`}
                        disabled={font.isPremium}
                      >
                        <span className={font.sample}>{font.name}</span>
                        {font.isPremium && (
                          <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
                            PRO
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-4 border-t border-gray-800 pt-6 mt-6">
                  <h3 className="text-white font-medium">Ek Ayarlar</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-gray-400">
                      <input
                        type="checkbox"
                        checked={themeSettings.animations}
                        onChange={(e) => setThemeSettings({ ...themeSettings, animations: e.target.checked })}
                        className="rounded bg-gray-800 border-gray-700 text-blue-600"
                      />
                      <span>Animasyonları etkinleştir</span>
                    </label>
                    <label className="flex items-center space-x-3 text-gray-400">
                      <input
                        type="checkbox"
                        checked={themeSettings.glassmorphism}
                        onChange={(e) => setThemeSettings({ ...themeSettings, glassmorphism: e.target.checked })}
                        className="rounded bg-gray-800 border-gray-700 text-blue-600"
                      />
                      <span>Glassmorphism efektleri</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings Tab */}
            {activeTab === "advanced" && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-400" />
                  Gelişmiş Ayarlar
                </h2>
                
                <div className="space-y-8">
                  {/* Layout Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">Görünüm Özellikleri</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Köşe Yuvarlaklığı</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: "none", label: "Yok", value: "0px" },
                            { id: "small", label: "Az", value: "4px" },
                            { id: "medium", label: "Orta", value: "8px" },
                            { id: "large", label: "Çok", value: "16px" }
                          ].map((size) => (
                            <button
                              key={size.id}
                              onClick={() => setThemeSettings({ ...themeSettings, borderRadius: size.id })}
                              className={`py-3 px-4 rounded-lg border transition text-sm font-medium ${
                                themeSettings.borderRadius === size.id
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                              }`}
                            >
                              <div className={`w-full h-2 mb-1 ${
                                size.id === "none" ? "rounded-none" :
                                size.id === "small" ? "rounded-sm" :
                                size.id === "medium" ? "rounded" : "rounded-lg"
                              } bg-current opacity-50`} />
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Animasyon Ayarları</label>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-300">Geçiş animasyonları</span>
                            <input 
                              type="checkbox" 
                              checked={themeSettings.animations}
                              onChange={(e) => setThemeSettings({ ...themeSettings, animations: e.target.checked })}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600" 
                            />
                          </label>
                          <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-300">Glassmorphism efektleri</span>
                            <input 
                              type="checkbox" 
                              checked={themeSettings.glassmorphism}
                              onChange={(e) => setThemeSettings({ ...themeSettings, glassmorphism: e.target.checked })}
                              className="rounded bg-gray-800 border-gray-600 text-blue-600" 
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">SEO & Meta Bilgileri</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Sayfa Başlığı</label>
                        <input
                          type="text"
                          defaultValue={`${profile.name || "Kullanıcı"} - ${profile.title || "Pozisyon"} | ${profile.companyName || "Şirket"}`}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Sayfa başlığınız"
                        />
                        <p className="text-xs text-gray-500 mt-1">Google'da görünecek ana başlık</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Meta Açıklama</label>
                        <textarea
                          rows={3}
                          defaultValue={profile.bio || "Profesyonel hizmetler ve güvenilir çözümler."}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Sayfanızın kısa açıklaması"
                        />
                        <p className="text-xs text-gray-500 mt-1">Google arama sonuçlarında görünecek açıklama (160 karakter)</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Anahtar Kelimeler</label>
                        <input
                          type="text"
                          defaultValue={`${profile.title || ""}, ${profile.companyName || ""}, ${profile.email?.split('@')[0] || ""}`}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Virgülle ayırarak yazın"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">Güvenlik & Koruma</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-300">Sağ tık engelleme</span>
                          <p className="text-xs text-gray-500">Ziyaretçilerin sağ tık yapmasını engeller</p>
                        </div>
                        <input type="checkbox" className="rounded bg-gray-800 border-gray-600 text-blue-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-300">Metin seçimi engelleme</span>
                          <p className="text-xs text-gray-500">İçeriklerin kopyalanmasını zorlaştırır</p>
                        </div>
                        <input type="checkbox" className="rounded bg-gray-800 border-gray-600 text-blue-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-300">Geliştirici araçları engelleme</span>
                          <p className="text-xs text-gray-500">F12 ve geliştirici konsolunu engeller</p>
                        </div>
                        <input type="checkbox" className="rounded bg-gray-800 border-gray-600 text-blue-600" />
                      </label>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">Analitik & Takip</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Google Analytics ID</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Facebook Pixel ID</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                          placeholder="123456789012345"
                        />
                      </div>
                      <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-300">QART analitikleri aktif</span>
                        <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-600 text-blue-600" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview - Büyütülmüş ve Detaylı */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h3 className="text-white font-medium mb-4 flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-400" />
                    Canlı Önizleme
                  </span>
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-gray-400 hover:text-white transition"
                    title="Önizlemeyi yenile"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </h3>
                
                <div className={`rounded-lg overflow-hidden border-2 border-gray-700 ${
                  previewMode === "mobile" ? "max-w-[380px] mx-auto" : ""
                }`}>
                  <div className={`h-[700px] ${
                    themeSettings.selectedTheme === "modern-dark"
                      ? "bg-gradient-to-br from-gray-900 to-black"
                      : themeSettings.selectedTheme === "elegant-light"
                      ? "bg-gradient-to-br from-white to-gray-100"
                      : themeSettings.selectedTheme === "ocean-blue"
                      ? "bg-gradient-to-br from-blue-900 to-cyan-800"
                      : themeSettings.selectedTheme === "sunset-warm"
                      ? "bg-gradient-to-br from-orange-800 to-red-900"
                      : themeSettings.selectedTheme === "nature-green"
                      ? "bg-gradient-to-br from-green-900 to-emerald-800"
                      : themeSettings.selectedTheme === "royal-purple"
                      ? "bg-gradient-to-br from-purple-900 to-pink-800"
                      : "bg-gradient-to-br from-gray-800 to-gray-900"
                  } p-6 overflow-y-auto`}>
                    
                    {/* Public Profile Preview - Birebir Gerçek Hali */}
                    <div className="space-y-6">
                      {/* Hero Section */}
                      <div className="text-center space-y-4">
                        {visibilitySettings.personal.profileImage && (
                          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center">
                            <User className={`h-12 w-12 ${themeSettings.selectedTheme === "elegant-light" ? "text-white" : "text-white"}`} />
                          </div>
                        )}
                        
                        <div>
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            {visibilitySettings.personal.name && (
                              <h1 className={`text-xl font-bold ${
                                themeSettings.selectedTheme === "elegant-light" ? "text-gray-900" : "text-white"
                              }`}>{profile.companyName || profile.name || "Kullanıcı"}</h1>
                            )}
                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                          </div>
                          
                          {visibilitySettings.personal.title && (
                            <p className={`text-sm ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-600" : "text-gray-400"
                            }`}>{profile.title || "Pozisyon"}</p>
                          )}
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="bg-black/20 rounded-xl p-4 space-y-3">
                        <div className={`text-xs ${
                          themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                        }`}>
                          {profile.bio || "Profesyonel hizmetler ve güvenilir çözümler."}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className={`text-sm font-bold ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-900" : "text-white"
                            }`}>300+</div>
                            <div className={`text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-600" : "text-gray-400"
                            }`}>Müşteri</div>
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-900" : "text-white"
                            }`}>15+</div>
                            <div className={`text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-600" : "text-gray-400"
                            }`}>Çalışan</div>
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-900" : "text-white"
                            }`}>16 Yıl</div>
                            <div className={`text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-600" : "text-gray-400"
                            }`}>Deneyim</div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      {visibilitySettings.contact.phone && (
                        <div className="bg-black/20 rounded-xl p-3 space-y-2">
                          <h3 className={`text-sm font-semibold ${
                            themeSettings.selectedTheme === "elegant-light" ? "text-gray-800" : "text-white"
                          }`}>İletişim</h3>
                          <div className="space-y-1">
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Phone className="h-3 w-3" />
                              <span>{profile.phone || "+90 555 000 0000"}</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Mail className="h-3 w-3" />
                              <span>{profile.email || "email@example.com"}</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <MapPin className="h-3 w-3" />
                              <span>{profile.address || "İstanbul"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Services */}
                      {visibilitySettings.sections.services && (
                        <div className="bg-black/20 rounded-xl p-3">
                          <h3 className={`text-sm font-semibold mb-2 ${
                            themeSettings.selectedTheme === "elegant-light" ? "text-gray-800" : "text-white"
                          }`}>Hizmetlerimiz</h3>
                          <div className="space-y-1">
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Zap className="h-3 w-3" />
                              <span>Elektrik Tesisatı</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Code className="h-3 w-3" />
                              <span>Endüstriyel Otomasyon</span>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Headphones className="h-3 w-3" />
                              <span>7/24 Arıza Servisi</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {visibilitySettings.sections.features && (
                        <div className="bg-black/20 rounded-xl p-3">
                          <h3 className={`text-sm font-semibold mb-2 ${
                            themeSettings.selectedTheme === "elegant-light" ? "text-gray-800" : "text-white"
                          }`}>Özellikler</h3>
                          <div className="grid grid-cols-2 gap-1">
                            <div className={`flex items-center space-x-1 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Shield className="h-3 w-3" />
                              <span>Sigortalı</span>
                            </div>
                            <div className={`flex items-center space-x-1 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Award className="h-3 w-3" />
                              <span>Belgeli</span>
                            </div>
                            <div className={`flex items-center space-x-1 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <CheckCircle className="h-3 w-3" />
                              <span>2 Yıl Garanti</span>
                            </div>
                            <div className={`flex items-center space-x-1 text-xs ${
                              themeSettings.selectedTheme === "elegant-light" ? "text-gray-700" : "text-gray-300"
                            }`}>
                              <Truck className="h-3 w-3" />
                              <span>Hızlı Servis</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>Ara</span>
                        </button>
                        <button className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1">
                          <Send className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`px-3 py-1 rounded text-xs ${
                        previewMode === "desktop" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Masaüstü
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`px-3 py-1 rounded text-xs ${
                        previewMode === "mobile" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Mobil
                    </button>
                  </div>
                  <div className="text-center">
                    <a
                      href={profile.slug ? `/${profile.slug}` : "/"}
                      target="_blank"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Tam sayfa önizleme →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
            <Check className="h-5 w-5" />
            <span>Tema ayarları kaydedildi!</span>
          </div>
        )}
      </div>
    </div>
  )
}