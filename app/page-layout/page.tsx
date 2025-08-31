"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Palette, Eye, Save, Monitor, Smartphone, Tablet,
  Check, Crown, Lock, Sparkles, Sun, Moon, Layers,
  User, Building, Phone, MapPin, Link2, Mail, 
  Globe, MessageSquare, Shield, Clock, BadgeCheck,
  Settings, RefreshCw, ChevronRight, Zap, Layout,
  Package, Briefcase, GraduationCap, Award, Image as ImageIcon,
  Type, Code, Sliders, ToggleLeft, ToggleRight,
  EyeOff, CheckCircle, XCircle, Info, Copy, ExternalLink
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Image from "next/image"

// Tema Presets - Farklı Temalar
const themePresets = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Temiz ve minimalist tasarım",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#0f172a",
      text: "#e2e8f0"
    },
    style: "minimal",
    animations: "smooth",
    layout: "centered",
    isPremium: false
  },
  gradient: {
    id: "gradient",
    name: "Gradient",
    description: "Canlı gradyan geçişleri",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#14b8a6",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff"
    },
    style: "bold",
    animations: "dynamic",
    layout: "fullwidth",
    isPremium: false
  },
  neon: {
    id: "neon",
    name: "Neon",
    description: "Parlak neon efektleri",
    colors: {
      primary: "#00ff88",
      secondary: "#ff00ff",
      accent: "#00ffff",
      background: "#000000",
      text: "#ffffff"
    },
    style: "cyberpunk",
    animations: "glitch",
    layout: "centered",
    isPremium: true
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Zarif ve profesyonel",
    colors: {
      primary: "#d4af37",
      secondary: "#2c3e50",
      accent: "#c0392b",
      background: "#1a1a1a",
      text: "#f4f4f4"
    },
    style: "luxury",
    animations: "subtle",
    layout: "centered",
    isPremium: true
  },
  glass: {
    id: "glass",
    name: "Glass",
    description: "Cam morfoloji efektleri",
    colors: {
      primary: "#60a5fa",
      secondary: "#a78bfa",
      accent: "#34d399",
      background: "rgba(15, 23, 42, 0.8)",
      text: "#f8fafc"
    },
    style: "glassmorphism",
    animations: "smooth",
    layout: "cards",
    isPremium: true
  },
  retro: {
    id: "retro",
    name: "Retro",
    description: "80'ler tarzı retro tema",
    colors: {
      primary: "#ff6b6b",
      secondary: "#4ecdc4",
      accent: "#ffe66d",
      background: "#2a2a2a",
      text: "#f7f7f7"
    },
    style: "retro",
    animations: "bounce",
    layout: "grid",
    isPremium: false
  },
  dark: {
    id: "dark",
    name: "Dark",
    description: "Koyu ve şık tema",
    colors: {
      primary: "#4f46e5",
      secondary: "#7c3aed",
      accent: "#06b6d4",
      background: "#000000",
      text: "#ffffff"
    },
    style: "dark",
    animations: "fade",
    layout: "centered",
    isPremium: false
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Deniz temalı sakin tasarım",
    colors: {
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#06b6d4",
      background: "linear-gradient(to bottom, #0f172a, #075985)",
      text: "#e0f2fe"
    },
    style: "fluid",
    animations: "wave",
    layout: "fullwidth",
    isPremium: true
  }
}

// Layout Options
const layoutOptions = [
  { id: "centered", name: "Ortalanmış", icon: Layout, description: "İçerik ortada" },
  { id: "fullwidth", name: "Tam Genişlik", icon: Monitor, description: "Kenardan kenara" },
  { id: "cards", name: "Kartlar", icon: Layers, description: "Kart bazlı düzen" },
  { id: "grid", name: "Grid", icon: Package, description: "Izgara düzeni" },
  { id: "timeline", name: "Zaman Çizelgesi", icon: Clock, description: "Kronolojik düzen" }
]

// Animation Options
const animationOptions = [
  { id: "none", name: "Animasyon Yok", description: "Statik görünüm" },
  { id: "subtle", name: "İnce", description: "Minimal animasyonlar" },
  { id: "smooth", name: "Yumuşak", description: "Akıcı geçişler" },
  { id: "dynamic", name: "Dinamik", description: "Canlı animasyonlar" },
  { id: "bounce", name: "Zıplayan", description: "Eğlenceli animasyonlar" },
  { id: "fade", name: "Solma", description: "Fade efektleri" },
  { id: "slide", name: "Kayma", description: "Slide geçişleri" },
  { id: "wave", name: "Dalga", description: "Dalga efektleri" }
]

// Typography Options
const typographyOptions = [
  { id: "sans", name: "Sans Serif", family: "system-ui, -apple-system, sans-serif" },
  { id: "serif", name: "Serif", family: "Georgia, Times New Roman, serif" },
  { id: "mono", name: "Monospace", family: "Menlo, Monaco, monospace" },
  { id: "inter", name: "Inter", family: "'Inter', sans-serif" },
  { id: "poppins", name: "Poppins", family: "'Poppins', sans-serif" },
  { id: "roboto", name: "Roboto", family: "'Roboto', sans-serif" }
]

export default function PageLayoutPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("themes")
  const [previewMode, setPreviewMode] = useState("desktop")
  const [user, setUser] = useState<any>(null)
  const [userSubscription, setUserSubscription] = useState("Free")
  
  // Theme Settings
  const [selectedTheme, setSelectedTheme] = useState("modern")
  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0f172a",
    text: "#e2e8f0"
  })
  const [selectedLayout, setSelectedLayout] = useState("centered")
  const [selectedAnimation, setSelectedAnimation] = useState("smooth")
  const [selectedTypography, setSelectedTypography] = useState("sans")
  
  // Visibility Settings - Detaylı Görünürlük Kontrolleri
  const [visibilitySettings, setVisibilitySettings] = useState({
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
  })
  
  // Advanced Settings
  const [advancedSettings, setAdvancedSettings] = useState({
    animations: {
      enabled: true,
      speed: "normal", // slow, normal, fast
      type: "smooth" // smooth, bounce, elastic
    },
    spacing: {
      padding: "normal", // compact, normal, relaxed
      margins: "normal" // tight, normal, loose
    },
    shadows: {
      enabled: true,
      intensity: "medium" // light, medium, strong
    },
    borders: {
      style: "rounded", // none, rounded, sharp
      width: "normal" // thin, normal, thick
    },
    filters: {
      blur: false,
      grayscale: false,
      brightness: 100
    }
  })
  
  // User profile data
  const [profileData, setProfileData] = useState<any>({})
  
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setUserSubscription(userData.subscription || "Free")
      fetchUserProfile(userData.email)
    } else {
      window.location.href = "/login"
    }
  }, [])
  
  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${email}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setProfileData(data.profile)
          
          // Load saved theme settings
          if (data.profile.themeSettings) {
            const settings = data.profile.themeSettings
            setSelectedTheme(settings.theme || "modern")
            setCustomColors(settings.colors || customColors)
            setSelectedLayout(settings.layout || "centered")
            setSelectedAnimation(settings.animation || "smooth")
            setSelectedTypography(settings.typography || "sans")
            setVisibilitySettings(settings.visibility || visibilitySettings)
            setAdvancedSettings(settings.advanced || advancedSettings)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }
  
  const handleSaveSettings = async () => {
    if (!user?.email) return
    
    setSaving(true)
    try {
      const themeSettings = {
        theme: selectedTheme,
        colors: customColors,
        layout: selectedLayout,
        animation: selectedAnimation,
        typography: selectedTypography,
        visibility: visibilitySettings,
        advanced: advancedSettings
      }
      
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          themeSettings: themeSettings,
          themeId: selectedTheme
        })
      })
      
      if (response.ok) {
        toast.success("Tema ayarları başarıyla kaydedildi!")
        
        // Update local storage
        const updatedUser = { ...user, themeSettings }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } else {
        toast.error("Ayarlar kaydedilemedi!")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Bir hata oluştu!")
    } finally {
      setSaving(false)
    }
  }
  
  const handleThemeSelect = (themeId: string) => {
    const theme = themePresets[themeId as keyof typeof themePresets]
    if (theme) {
      // Check if user can use this theme
      if (theme.isPremium && userSubscription === "Free") {
        toast.error("Bu tema premium üyeler için!")
        return
      }
      
      setSelectedTheme(themeId)
      setCustomColors(theme.colors as any)
      setSelectedLayout(theme.layout)
      setSelectedAnimation(theme.animations)
      toast.success(`${theme.name} teması seçildi`)
    }
  }
  
  const toggleVisibility = (section: string, element: string) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [element]: !prev[section as keyof typeof prev][element as any]
      }
    }))
  }
  
  const tabs = [
    { id: "themes", label: "Temalar", icon: Palette },
    { id: "visibility", label: "Görünürlük", icon: Eye },
    { id: "layout", label: "Düzen", icon: Layout },
    { id: "typography", label: "Tipografi", icon: Type },
    { id: "animations", label: "Animasyonlar", icon: Zap },
    { id: "advanced", label: "Gelişmiş", icon: Settings }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/main-dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </a>
              <div>
                <h1 className="text-xl font-bold text-white">Tema ve Görünüm Ayarları</h1>
                <p className="text-sm text-gray-400">Public sayfanızı özelleştirin</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Preview Mode Selector */}
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded ${previewMode === "desktop" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("tablet")}
                  className={`p-2 rounded ${previewMode === "tablet" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded ${previewMode === "mobile" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
              
              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? "Kaydediliyor..." : "Kaydet"}</span>
              </button>
              
              {/* Live Preview Link */}
              <a
                href={`/${profileData.slug || user?.name?.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Canlı Önizleme</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              {/* Tabs */}
              <div className="space-y-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-600/30"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
              
              {/* Tab Content */}
              <div className="space-y-4">
                {/* Themes Tab */}
                {activeTab === "themes" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Hazır Temalar</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(themePresets).map((theme) => (
                        <motion.button
                          key={theme.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleThemeSelect(theme.id)}
                          className={`relative p-4 rounded-lg border-2 transition-all ${
                            selectedTheme === theme.id
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          {theme.isPremium && userSubscription === "Free" && (
                            <div className="absolute top-2 right-2">
                              <Lock className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                          
                          <div className="flex flex-col items-center">
                            <div className="w-full h-12 rounded mb-2 flex gap-1">
                              <div 
                                className="flex-1 rounded"
                                style={{ backgroundColor: theme.colors.primary }}
                              />
                              <div 
                                className="flex-1 rounded"
                                style={{ backgroundColor: theme.colors.secondary }}
                              />
                              <div 
                                className="flex-1 rounded"
                                style={{ backgroundColor: theme.colors.accent }}
                              />
                            </div>
                            <span className="text-sm font-medium text-white">{theme.name}</span>
                            <span className="text-xs text-gray-400">{theme.description}</span>
                          </div>
                          
                          {selectedTheme === theme.id && (
                            <div className="absolute bottom-2 right-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Custom Colors */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Özel Renkler</h4>
                      <div className="space-y-3">
                        {Object.entries(customColors).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <label className="text-sm text-gray-300 capitalize">{key}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => setCustomColors(prev => ({
                                  ...prev,
                                  [key]: e.target.value
                                }))}
                                className="w-10 h-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => setCustomColors(prev => ({
                                  ...prev,
                                  [key]: e.target.value
                                }))}
                                className="w-24 px-2 py-1 bg-gray-800 text-white rounded text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Visibility Tab */}
                {activeTab === "visibility" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Görünürlük Ayarları</h3>
                    
                    {/* Sections Visibility */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Bölümler</h4>
                      <div className="space-y-2">
                        {Object.entries(visibilitySettings.sections).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span className="text-sm text-gray-300 capitalize">
                              {key === "hero" && "Ana Bölüm"}
                              {key === "contact" && "İletişim"}
                              {key === "services" && "Hizmetler"}
                              {key === "experience" && "Deneyim"}
                              {key === "education" && "Eğitim"}
                              {key === "features" && "Özellikler"}
                              {key === "social" && "Sosyal Medya"}
                              {key === "location" && "Lokasyon"}
                              {key === "qrCode" && "QR Kod"}
                            </span>
                            <button
                              onClick={() => toggleVisibility("sections", key)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                value ? "bg-blue-600" : "bg-gray-600"
                              }`}
                            >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                value ? "translate-x-6" : "translate-x-1"
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Elements Visibility */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Öğeler</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Object.entries(visibilitySettings.elements).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                            <span className="text-xs text-gray-300">
                              {key === "profileImage" && "Profil Resmi"}
                              {key === "coverImage" && "Kapak Görseli"}
                              {key === "companyLogo" && "Şirket Logosu"}
                              {key === "name" && "İsim"}
                              {key === "title" && "Ünvan"}
                              {key === "bio" && "Biyografi"}
                              {key === "companyName" && "Şirket Adı"}
                              {key === "companySlogan" && "Şirket Sloganı"}
                              {key === "phone" && "Telefon"}
                              {key === "whatsapp" && "WhatsApp"}
                              {key === "email" && "E-posta"}
                              {key === "website" && "Website"}
                              {key === "address" && "Adres"}
                              {key === "workingHours" && "Çalışma Saatleri"}
                              {key === "socialLinks" && "Sosyal Bağlantılar"}
                              {key === "bankAccounts" && "Banka Hesapları"}
                              {key === "downloadCV" && "CV İndir"}
                              {key === "shareButton" && "Paylaş Butonu"}
                              {key === "viewCount" && "Görüntülenme"}
                              {key === "premiumBadge" && "Premium Badge"}
                            </span>
                            <button
                              onClick={() => toggleVisibility("elements", key)}
                              className={`p-1 rounded ${value ? "text-green-500" : "text-gray-500"}`}
                            >
                              {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Layout Tab */}
                {activeTab === "layout" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Düzen Seçenekleri</h3>
                    <div className="space-y-3">
                      {layoutOptions.map((layout) => {
                        const Icon = layout.icon
                        return (
                          <button
                            key={layout.id}
                            onClick={() => setSelectedLayout(layout.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              selectedLayout === layout.id
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:border-gray-600"
                            }`}
                          >
                            <Icon className="h-5 w-5 text-gray-400" />
                            <div className="flex-1 text-left">
                              <span className="text-sm font-medium text-white">{layout.name}</span>
                              <p className="text-xs text-gray-400">{layout.description}</p>
                            </div>
                            {selectedLayout === layout.id && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Spacing Settings */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Boşluk Ayarları</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-300">Padding</label>
                          <select
                            value={advancedSettings.spacing.padding}
                            onChange={(e) => setAdvancedSettings(prev => ({
                              ...prev,
                              spacing: { ...prev.spacing, padding: e.target.value }
                            }))}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                          >
                            <option value="compact">Kompakt</option>
                            <option value="normal">Normal</option>
                            <option value="relaxed">Rahat</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-300">Margin</label>
                          <select
                            value={advancedSettings.spacing.margins}
                            onChange={(e) => setAdvancedSettings(prev => ({
                              ...prev,
                              spacing: { ...prev.spacing, margins: e.target.value }
                            }))}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                          >
                            <option value="tight">Dar</option>
                            <option value="normal">Normal</option>
                            <option value="loose">Geniş</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Typography Tab */}
                {activeTab === "typography" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Tipografi</h3>
                    <div className="space-y-3">
                      {typographyOptions.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedTypography(type.id)}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            selectedTypography === type.id
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <span 
                            className="text-lg text-white"
                            style={{ fontFamily: type.family }}
                          >
                            {type.name}
                          </span>
                          <p 
                            className="text-sm text-gray-400 mt-1"
                            style={{ fontFamily: type.family }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Animations Tab */}
                {activeTab === "animations" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Animasyon Ayarları</h3>
                    
                    {/* Animation Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-300">Animasyonları Etkinleştir</span>
                      <button
                        onClick={() => setAdvancedSettings(prev => ({
                          ...prev,
                          animations: { ...prev.animations, enabled: !prev.animations.enabled }
                        }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          advancedSettings.animations.enabled ? "bg-blue-600" : "bg-gray-600"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          advancedSettings.animations.enabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                    
                    {advancedSettings.animations.enabled && (
                      <>
                        {/* Animation Type */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Animasyon Tipi</label>
                          {animationOptions.map((anim) => (
                            <button
                              key={anim.id}
                              onClick={() => setSelectedAnimation(anim.id)}
                              className={`w-full p-3 rounded-lg border transition-all text-left ${
                                selectedAnimation === anim.id
                                  ? "border-blue-500 bg-blue-500/10"
                                  : "border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              <span className="text-sm font-medium text-white">{anim.name}</span>
                              <p className="text-xs text-gray-400">{anim.description}</p>
                            </button>
                          ))}
                        </div>
                        
                        {/* Animation Speed */}
                        <div>
                          <label className="text-sm text-gray-400">Animasyon Hızı</label>
                          <select
                            value={advancedSettings.animations.speed}
                            onChange={(e) => setAdvancedSettings(prev => ({
                              ...prev,
                              animations: { ...prev.animations, speed: e.target.value }
                            }))}
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm mt-2"
                          >
                            <option value="slow">Yavaş</option>
                            <option value="normal">Normal</option>
                            <option value="fast">Hızlı</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Advanced Tab */}
                {activeTab === "advanced" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Gelişmiş Ayarlar</h3>
                    
                    {/* Shadows */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-400">Gölgeler</label>
                        <button
                          onClick={() => setAdvancedSettings(prev => ({
                            ...prev,
                            shadows: { ...prev.shadows, enabled: !prev.shadows.enabled }
                          }))}
                          className={`p-1 rounded ${
                            advancedSettings.shadows.enabled ? "text-blue-500" : "text-gray-500"
                          }`}
                        >
                          {advancedSettings.shadows.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </button>
                      </div>
                      {advancedSettings.shadows.enabled && (
                        <select
                          value={advancedSettings.shadows.intensity}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            shadows: { ...prev.shadows, intensity: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                        >
                          <option value="light">Hafif</option>
                          <option value="medium">Orta</option>
                          <option value="strong">Güçlü</option>
                        </select>
                      )}
                    </div>
                    
                    {/* Borders */}
                    <div>
                      <label className="text-sm text-gray-400">Kenarlık Stili</label>
                      <select
                        value={advancedSettings.borders.style}
                        onChange={(e) => setAdvancedSettings(prev => ({
                          ...prev,
                          borders: { ...prev.borders, style: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm mt-2"
                      >
                        <option value="none">Yok</option>
                        <option value="rounded">Yuvarlatılmış</option>
                        <option value="sharp">Keskin</option>
                      </select>
                    </div>
                    
                    {/* Filters */}
                    <div>
                      <label className="text-sm text-gray-400">Filtreler</label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Blur</span>
                          <button
                            onClick={() => setAdvancedSettings(prev => ({
                              ...prev,
                              filters: { ...prev.filters, blur: !prev.filters.blur }
                            }))}
                            className={`p-1 rounded ${
                              advancedSettings.filters.blur ? "text-blue-500" : "text-gray-500"
                            }`}
                          >
                            {advancedSettings.filters.blur ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Grayscale</span>
                          <button
                            onClick={() => setAdvancedSettings(prev => ({
                              ...prev,
                              filters: { ...prev.filters, grayscale: !prev.filters.grayscale }
                            }))}
                            className={`p-1 rounded ${
                              advancedSettings.filters.grayscale ? "text-blue-500" : "text-gray-500"
                            }`}
                          >
                            {advancedSettings.filters.grayscale ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </div>
                        <div>
                          <span className="text-xs text-gray-300">Parlaklık</span>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={advancedSettings.filters.brightness}
                            onChange={(e) => setAdvancedSettings(prev => ({
                              ...prev,
                              filters: { ...prev.filters, brightness: parseInt(e.target.value) }
                            }))}
                            className="w-full mt-1"
                          />
                          <span className="text-xs text-gray-400">{advancedSettings.filters.brightness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Canlı Önizleme</h2>
              
              {/* Preview Container */}
              <div 
                className={`mx-auto transition-all duration-300 ${
                  previewMode === "desktop" ? "w-full" :
                  previewMode === "tablet" ? "max-w-2xl" :
                  "max-w-sm"
                }`}
              >
                <div 
                  className="bg-black rounded-lg overflow-hidden border border-gray-700"
                  style={{
                    background: typeof customColors.background === 'string' && customColors.background.includes('gradient') 
                      ? customColors.background 
                      : customColors.background,
                    color: customColors.text,
                    fontFamily: typographyOptions.find(t => t.id === selectedTypography)?.family
                  }}
                >
                  {/* Preview Content */}
                  <div className={`p-8 ${
                    advancedSettings.spacing.padding === "compact" ? "p-4" :
                    advancedSettings.spacing.padding === "relaxed" ? "p-12" : "p-8"
                  }`}>
                    {/* Hero Section Preview */}
                    {visibilitySettings.sections.hero && (
                      <div className="text-center mb-8">
                        {visibilitySettings.elements.profileImage && profileData.profileImage && (
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                            <Image
                              src={profileData.profileImage}
                              alt="Profile"
                              width={96}
                              height={96}
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {visibilitySettings.elements.name && (
                          <h1 
                            className="text-3xl font-bold mb-2"
                            style={{ color: customColors.primary }}
                          >
                            {profileData.name || "İsminiz"}
                          </h1>
                        )}
                        
                        {visibilitySettings.elements.title && (
                          <p className="text-lg mb-4" style={{ color: customColors.secondary }}>
                            {profileData.title || "Ünvanınız"}
                          </p>
                        )}
                        
                        {visibilitySettings.elements.bio && (
                          <p className="text-sm opacity-80">
                            {profileData.bio || "Kısa biyografiniz burada görünecek"}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Contact Section Preview */}
                    {visibilitySettings.sections.contact && (
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {visibilitySettings.elements.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" style={{ color: customColors.accent }} />
                            <span className="text-sm">{profileData.phone || "Telefon"}</span>
                          </div>
                        )}
                        {visibilitySettings.elements.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" style={{ color: customColors.accent }} />
                            <span className="text-sm">{profileData.email || "E-posta"}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Services Section Preview */}
                    {visibilitySettings.sections.services && profileData.services?.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4" style={{ color: customColors.primary }}>
                          Hizmetler
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                          {profileData.services.slice(0, 2).map((service: any, index: number) => (
                            <div 
                              key={index}
                              className="p-3 rounded-lg"
                              style={{ 
                                backgroundColor: `${customColors.primary}20`,
                                borderColor: customColors.primary,
                                borderWidth: '1px',
                                borderStyle: 'solid'
                              }}
                            >
                              <span className="text-sm font-medium">{service.title || service.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Apply Advanced Settings */}
                    <style jsx>{`
                      div {
                        ${advancedSettings.shadows.enabled ? `box-shadow: 0 4px 6px rgba(0,0,0,${
                          advancedSettings.shadows.intensity === 'light' ? '0.1' :
                          advancedSettings.shadows.intensity === 'strong' ? '0.3' : '0.2'
                        });` : ''}
                        ${advancedSettings.borders.style === 'rounded' ? 'border-radius: 8px;' :
                          advancedSettings.borders.style === 'sharp' ? 'border-radius: 0;' : ''}
                        ${advancedSettings.filters.blur ? 'filter: blur(1px);' : ''}
                        ${advancedSettings.filters.grayscale ? 'filter: grayscale(100%);' : ''}
                        filter: brightness(${advancedSettings.filters.brightness}%);
                      }
                    `}</style>
                  </div>
                </div>
              </div>
              
              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-300">
                      Yaptığınız değişiklikler anında önizlemede görünür. Kaydet butonuna tıklayarak değişiklikleri kalıcı hale getirin.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tema: {themePresets[selectedTheme as keyof typeof themePresets]?.name} | 
                      Düzen: {layoutOptions.find(l => l.id === selectedLayout)?.name} | 
                      Animasyon: {selectedAnimation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}