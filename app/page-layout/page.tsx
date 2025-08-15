"use client"

import { useEffect, useState } from "react"
import { 
  ArrowLeft, Palette, Eye, Save, Monitor, Smartphone, Tablet,
  Check, Crown, Lock, Sparkles, Sun, Moon, Layers,
  User, Building, Phone, MapPin, Link2, Mail, 
  Globe, MessageSquare, Shield, Clock, BadgeCheck,
  Settings, RefreshCw, ChevronRight, Zap
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

export default function PageLayoutPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("themes")
  const [previewMode, setPreviewMode] = useState("desktop")
  const [user, setUser] = useState<any>(null)
  const [userSubscription, setUserSubscription] = useState("Free")
  const [selectedTheme, setSelectedTheme] = useState("default")
  const [themes, setThemes] = useState<any[]>([])
  const [loadingThemes, setLoadingThemes] = useState(true)
  
  // User profile data for preview
  const [profileData, setProfileData] = useState<any>({
    name: "",
    title: "",
    companyName: "",
    bio: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    profileImage: "",
    logoUrl: "",
    theme: "default"
  })

  // Visibility settings
  const [visibilitySettings, setVisibilitySettings] = useState({
    personal: {
      name: true,
      title: true,
      bio: true,
      profileImage: true
    },
    company: {
      name: true,
      logo: true,
      description: true
    },
    contact: {
      phone: true,
      whatsapp: true,
      email: true,
      website: true
    },
    social: {
      linkedin: true,
      instagram: true,
      facebook: true,
      twitter: true
    }
  })

  // Fetch user data and themes on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // Fetch user profile data
      fetchUserProfile(userData.email)
      
      // Fetch available themes based on subscription
      fetchThemes(userData.email)
    } else {
      window.location.href = "/login"
    }
  }, [])

  // Fetch user profile
  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${email}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setProfileData({
            name: data.profile.name || "",
            title: data.profile.title || "",
            companyName: data.profile.companyName || "",
            bio: data.profile.bio || "",
            phone: data.profile.phone || "",
            email: data.profile.email || email,
            website: data.profile.website || "",
            address: data.profile.address || "",
            profileImage: data.profile.profileImage || "",
            logoUrl: data.profile.logoUrl || "",
            theme: data.profile.themeId || "default"
          })
          setSelectedTheme(data.profile.themeId || "default")
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  // Fetch themes with subscription filtering
  const fetchThemes = async (email: string) => {
    try {
      setLoadingThemes(true)
      
      // First get user's subscription
      const userResponse = await fetch(`/api/admin/unified-users?search=${email}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        if (userData.users && userData.users.length > 0) {
          const userSub = userData.users[0].subscription || "Free"
          setUserSubscription(userSub)
        }
      }
      
      // Then fetch themes
      const response = await fetch(`/api/themes?userEmail=${email}`)
      if (response.ok) {
        const data = await response.json()
        if (data.themes) {
          setThemes(data.themes)
        }
      } else {
        // Fallback to default themes if API fails
        setThemes(getDefaultThemes())
      }
    } catch (error) {
      console.error("Error fetching themes:", error)
      // Use fallback themes
      setThemes(getDefaultThemes())
    } finally {
      setLoadingThemes(false)
    }
  }

  // Default themes fallback
  const getDefaultThemes = () => [
    {
      id: "default",
      name: "Default",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      subscriptionLevel: "Free",
      isLocked: false,
      description: "Temiz ve profesyonel görünüm"
    },
    {
      id: "dark",
      name: "Dark Mode",
      primaryColor: "#6366F1",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#0F172A",
      textColor: "#F1F5F9",
      subscriptionLevel: "Free",
      isLocked: false,
      description: "Modern karanlık tema"
    },
    {
      id: "modern",
      name: "Modern",
      primaryColor: "#6366F1",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#FAFAFA",
      textColor: "#111827",
      subscriptionLevel: "Free",
      isLocked: false,
      description: "Minimalist tasarım"
    },
    {
      id: "pro-dark",
      name: "Pro Dark",
      primaryColor: "#6366F1",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#0F172A",
      textColor: "#F1F5F9",
      subscriptionLevel: "Pro",
      isLocked: userSubscription === "Free",
      description: "Premium karanlık tema"
    },
    {
      id: "pro-gradient",
      name: "Pro Gradient",
      primaryColor: "#EC4899",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#1E293B",
      textColor: "#E2E8F0",
      subscriptionLevel: "Pro",
      isLocked: userSubscription === "Free",
      description: "Gradient efektli premium tema"
    },
    {
      id: "pro-elegant",
      name: "Pro Elegant",
      primaryColor: "#059669",
      secondaryColor: "#0891B2",
      backgroundColor: "#F8FAFC",
      textColor: "#1E293B",
      subscriptionLevel: "Pro",
      isLocked: userSubscription === "Free",
      description: "Şık ve zarif tasarım"
    },
    {
      id: "business-corporate",
      name: "Business Corporate",
      primaryColor: "#1F2937",
      secondaryColor: "#374151",
      backgroundColor: "#FFFFFF",
      textColor: "#111827",
      subscriptionLevel: "Business",
      isLocked: !["Business", "Enterprise", "QART Lifetime"].includes(userSubscription),
      description: "Kurumsal görünüm"
    },
    {
      id: "business-premium",
      name: "Business Premium",
      primaryColor: "#7C3AED",
      secondaryColor: "#A855F7",
      backgroundColor: "#FAF5FF",
      textColor: "#581C87",
      subscriptionLevel: "Business",
      isLocked: !["Business", "Enterprise", "QART Lifetime"].includes(userSubscription),
      description: "Premium business tema"
    },
    {
      id: "lifetime-gold",
      name: "QART Lifetime Gold",
      primaryColor: "#F59E0B",
      secondaryColor: "#D97706",
      backgroundColor: "#1C1917",
      textColor: "#FBBF24",
      subscriptionLevel: "QART Lifetime",
      isLocked: userSubscription !== "QART Lifetime",
      description: "Özel altın tema"
    },
    {
      id: "lifetime-platinum",
      name: "QART Lifetime Platinum",
      primaryColor: "#E5E7EB",
      secondaryColor: "#9CA3AF",
      backgroundColor: "#111827",
      textColor: "#F9FAFB",
      subscriptionLevel: "QART Lifetime",
      isLocked: userSubscription !== "QART Lifetime",
      description: "Özel platin tema"
    }
  ]

  // Apply theme
  const applyTheme = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (!theme) return
    
    if (theme.isLocked) {
      toast.error(`Bu tema ${theme.subscriptionLevel} üyelik gerektirir!`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          themeId: themeId
        })
      })

      if (response.ok) {
        setSelectedTheme(themeId)
        toast.success("Tema başarıyla uygulandı!")
      } else {
        toast.error("Tema uygulanırken hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  // Save visibility settings
  const saveVisibilitySettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          visibilitySettings: JSON.stringify(visibilitySettings)
        })
      })

      if (response.ok) {
        toast.success("Görünüm ayarları kaydedildi!")
      } else {
        toast.error("Kaydetme başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  // Get subscription badge
  const getSubscriptionBadge = (level: string) => {
    switch(level) {
      case "Pro":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
            <Zap className="h-3 w-3 mr-1" />
            Pro
          </span>
        )
      case "Business":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">
            <Building className="h-3 w-3 mr-1" />
            Business
          </span>
        )
      case "QART Lifetime":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Lifetime
          </span>
        )
      default:
        return null
    }
  }

  // Get theme background style
  const getThemeBackground = (theme: any) => {
    return {
      background: `linear-gradient(135deg, ${theme.backgroundColor} 0%, ${theme.primaryColor}20 100%)`
    }
  }

  // Get selected theme object
  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0]

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
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
                <p className="text-sm text-gray-400">
                  {userSubscription} üyeliğiniz ile {themes.filter(t => !t.isLocked).length} tema kullanabilirsiniz
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Preview Button */}
              <a
                href={`/${profileData.name?.toLowerCase().replace(/\s+/g, '-') || user?.email?.split('@')[0] || 'preview'}`}
                target="_blank"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Önizle</span>
              </a>
              
              {/* Save Button */}
              <button
                onClick={activeTab === "themes" ? () => {} : saveVisibilitySettings}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("themes")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${
                    activeTab === "themes" 
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Palette className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Tema Seçimi</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("visibility")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${
                    activeTab === "visibility" 
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Görünürlük</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${
                    activeTab === "preview" 
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Monitor className="h-5 w-5 text-green-400" />
                  <span className="text-white">Canlı Önizleme</span>
                </button>
              </div>
            </div>

            {/* User Subscription Info */}
            <div className="mt-4 bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Üyelik Durumu</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{userSubscription}</span>
                  {getSubscriptionBadge(userSubscription)}
                </div>
                <div className="text-xs text-gray-500">
                  {themes.filter(t => !t.isLocked).length} / {themes.length} tema erişimi
                </div>
                {userSubscription === "Free" && (
                  <button className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700">
                    Pro'ya Yükselt
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Themes Tab */}
            {activeTab === "themes" && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Palette className="h-6 w-6 mr-2 text-blue-400" />
                  Tema Seçimi
                </h2>
                
                {loadingThemes ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                          selectedTheme === theme.id 
                            ? "border-blue-500 shadow-lg shadow-blue-500/20" 
                            : theme.isLocked 
                              ? "border-gray-700 opacity-60"
                              : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        {/* Theme Preview */}
                        <div 
                          className="h-32 p-4 relative"
                          style={getThemeBackground(theme)}
                        >
                          {/* Lock Overlay */}
                          {theme.isLocked && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                              <Lock className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Selected Indicator */}
                          {selectedTheme === theme.id && !theme.isLocked && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                          
                          {/* Theme Colors Preview */}
                          <div className="flex space-x-2">
                            <div 
                              className="w-8 h-8 rounded-lg border border-white/20"
                              style={{ backgroundColor: theme.primaryColor }}
                            />
                            <div 
                              className="w-8 h-8 rounded-lg border border-white/20"
                              style={{ backgroundColor: theme.secondaryColor }}
                            />
                            <div 
                              className="w-8 h-8 rounded-lg border border-white/20"
                              style={{ backgroundColor: theme.textColor }}
                            />
                          </div>
                        </div>
                        
                        {/* Theme Info */}
                        <div className="p-4 bg-gray-900/80">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{theme.name}</h3>
                            {getSubscriptionBadge(theme.subscriptionLevel)}
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{theme.description}</p>
                          
                          {/* Apply Button */}
                          {theme.isLocked ? (
                            <button 
                              className="w-full px-3 py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                              disabled
                            >
                              <Lock className="h-4 w-4" />
                              <span className="text-sm">{theme.subscriptionLevel} Gerekli</span>
                            </button>
                          ) : selectedTheme === theme.id ? (
                            <button 
                              className="w-full px-3 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2"
                              disabled
                            >
                              <Check className="h-4 w-4" />
                              <span className="text-sm">Aktif Tema</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => applyTheme(theme.id)}
                              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center space-x-2"
                              disabled={loading}
                            >
                              <Sparkles className="h-4 w-4" />
                              <span className="text-sm">Temayı Uygula</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Visibility Tab */}
            {activeTab === "visibility" && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-purple-400" />
                  Görünürlük Ayarları
                </h2>
                
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Kişisel Bilgiler</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(visibilitySettings.personal).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setVisibilitySettings({
                              ...visibilitySettings,
                              personal: {
                                ...visibilitySettings.personal,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Şirket Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(visibilitySettings.company).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setVisibilitySettings({
                              ...visibilitySettings,
                              company: {
                                ...visibilitySettings.company,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">İletişim Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(visibilitySettings.contact).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setVisibilitySettings({
                              ...visibilitySettings,
                              contact: {
                                ...visibilitySettings.contact,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Sosyal Medya</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(visibilitySettings.social).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setVisibilitySettings({
                              ...visibilitySettings,
                              social: {
                                ...visibilitySettings.social,
                                [key]: e.target.checked
                              }
                            })}
                            className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview Tab */}
            {activeTab === "preview" && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Monitor className="h-6 w-6 mr-2 text-green-400" />
                    Canlı Önizleme
                  </h2>
                  
                  {/* Device Selector */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`p-2 rounded-lg transition ${
                        previewMode === "desktop" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      <Monitor className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("tablet")}
                      className={`p-2 rounded-lg transition ${
                        previewMode === "tablet" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      <Tablet className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`p-2 rounded-lg transition ${
                        previewMode === "mobile" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      <Smartphone className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Preview Container */}
                <div className={`mx-auto transition-all ${
                  previewMode === "mobile" ? "max-w-sm" : 
                  previewMode === "tablet" ? "max-w-2xl" : "w-full"
                }`}>
                  <div 
                    className="rounded-xl overflow-hidden border-2 border-gray-700"
                    style={{
                      backgroundColor: currentTheme?.backgroundColor || "#FFFFFF",
                      color: currentTheme?.textColor || "#111827"
                    }}
                  >
                    <div className="p-6 md:p-8 space-y-6">
                      {/* Profile Header */}
                      {visibilitySettings.personal.profileImage && (
                        <div className="text-center">
                          <div 
                            className="h-24 w-24 rounded-full mx-auto flex items-center justify-center"
                            style={{ backgroundColor: currentTheme?.primaryColor || "#3B82F6" }}
                          >
                            <User className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Name & Title */}
                      <div className="text-center space-y-2">
                        {visibilitySettings.personal.name && (
                          <h1 className="text-2xl font-bold">
                            {profileData.name || "İsminiz"}
                          </h1>
                        )}
                        {visibilitySettings.personal.title && (
                          <p className="opacity-80">
                            {profileData.title || "Pozisyonunuz"}
                          </p>
                        )}
                        {visibilitySettings.company.name && profileData.companyName && (
                          <p className="text-sm opacity-70">
                            {profileData.companyName}
                          </p>
                        )}
                      </div>

                      {/* Bio */}
                      {visibilitySettings.personal.bio && profileData.bio && (
                        <div 
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${currentTheme?.primaryColor}20` }}
                        >
                          <p className="text-sm">{profileData.bio}</p>
                        </div>
                      )}

                      {/* Contact Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        {visibilitySettings.contact.phone && (
                          <button 
                            className="p-3 rounded-lg flex items-center justify-center space-x-2"
                            style={{ backgroundColor: currentTheme?.primaryColor || "#3B82F6", color: "#FFFFFF" }}
                          >
                            <Phone className="h-5 w-5" />
                            <span className="text-sm">Ara</span>
                          </button>
                        )}
                        {visibilitySettings.contact.email && (
                          <button 
                            className="p-3 rounded-lg flex items-center justify-center space-x-2"
                            style={{ backgroundColor: currentTheme?.secondaryColor || "#10B981", color: "#FFFFFF" }}
                          >
                            <Mail className="h-5 w-5" />
                            <span className="text-sm">E-posta</span>
                          </button>
                        )}
                      </div>

                      {/* Social Links */}
                      {Object.values(visibilitySettings.social).some(v => v) && (
                        <div className="flex justify-center space-x-4 pt-4">
                          {visibilitySettings.social.linkedin && (
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${currentTheme?.primaryColor}30` }}
                            >
                              <Globe className="h-5 w-5" />
                            </div>
                          )}
                          {visibilitySettings.social.instagram && (
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${currentTheme?.primaryColor}30` }}
                            >
                              <MessageSquare className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}