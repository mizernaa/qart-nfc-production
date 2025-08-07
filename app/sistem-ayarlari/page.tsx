"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Settings,
  Mail,
  Database,
  Shield,
  Globe,
  Bell,
  Palette,
  CreditCard,
  Users,
  Server,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  Activity
} from "lucide-react"

export default function SistemAyarlariPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [saving, setSaving] = useState(false)

  // System Settings State
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "QART",
    siteDescription: "Dijital Kartvizit Sistemi",
    siteUrl: "https://qart.app",
    contactEmail: "admin@qart.app",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    
    // SMTP Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpSecure: true,
    
    // Database Settings
    dbBackupEnabled: true,
    dbBackupInterval: "daily",
    dbRetentionDays: 30,
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 60, // minutes
    twoFactorRequired: false,
    passwordMinLength: 8,
    
    // API Settings
    apiRateLimit: 1000,
    apiKeyExpiration: 365, // days
    webhookEnabled: true,
    
    // File Upload Settings
    maxFileSize: 10, // MB
    allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf"],
    uploadPath: "/uploads",
    
    // Subscription Settings
    freeUserLimits: {
      profiles: 1,
      views: 1000,
      leads: 50
    },
    proUserLimits: {
      profiles: 5,
      views: 10000,
      leads: 500
    }
  })

  // System Stats
  const [systemStats] = useState({
    uptime: "15 gün 4 saat",
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    activeUsers: 892,
    apiCalls: 45678,
    errorRate: 0.02,
    lastBackup: "2025-01-07 03:00",
    version: "1.0.0"
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.isAdmin) {
        window.location.href = "/admin-panel"
        return
      }
      setUser(userData)
    } else {
      window.location.href = "/login"
      return
    }
    setLoading(false)
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Ayarlar başarıyla kaydedildi!")
  }

  const tabs = [
    { id: "general", name: "Genel", icon: Settings },
    { id: "email", name: "E-posta", icon: Mail },
    { id: "database", name: "Veritabanı", icon: Database },
    { id: "security", name: "Güvenlik", icon: Shield },
    { id: "api", name: "API", icon: Globe },
    { id: "system", name: "Sistem", icon: Server }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin-panel" className="text-2xl font-bold text-blue-500 hover:text-blue-400">
                QART
              </Link>
              <div className="h-6 w-px bg-gray-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sistem Ayarları</h1>
                <p className="text-sm text-gray-400 mt-1">Sistem konfigürasyonunu yönetin</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{saving ? "Kaydediliyor..." : "Kaydet"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>

              {/* System Status */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-sm font-medium text-white mb-3">Sistem Durumu</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">CPU:</span>
                    <span className="text-white">{systemStats.cpuUsage}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">RAM:</span>
                    <span className="text-white">{systemStats.memoryUsage}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Disk:</span>
                    <span className="text-white">{systemStats.diskUsage}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">{systemStats.uptime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-gray-900/50 rounded-lg border border-gray-800">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Genel Ayarlar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site Adı</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site URL</label>
                      <input
                        type="text"
                        value={settings.siteUrl}
                        onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site Açıklaması</label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">İletişim E-postası</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">Bakım Modu</h3>
                        <p className="text-xs text-gray-400">Siteyi bakım moduna alır</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">Yeni Kayıt</h3>
                        <p className="text-xs text-gray-400">Yeni kullanıcı kaydını etkinleştirir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.registrationEnabled}
                          onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">E-posta Doğrulama</h3>
                        <p className="text-xs text-gray-400">Yeni kullanıcılar için e-posta doğrulaması gerektirir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.emailVerificationRequired}
                          onChange={(e) => setSettings({...settings, emailVerificationRequired: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">E-posta Ayarları</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Adı</label>
                      <input
                        type="text"
                        value={settings.smtpUsername}
                        onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Şifre</label>
                      <input
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">SSL/TLS Güvenliği</h3>
                        <p className="text-xs text-gray-400">SMTP bağlantısı için SSL/TLS kullan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.smtpSecure}
                          onChange={(e) => setSettings({...settings, smtpSecure: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Güvenlik Ayarları</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Maksimum Giriş Denemesi</label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Oturum Zaman Aşımı (dakika)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Şifre Uzunluğu</label>
                      <input
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">İki Faktörlü Kimlik Doğrulama</h3>
                        <p className="text-xs text-gray-400">Yöneticiler için 2FA gerektirir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.twoFactorRequired}
                          onChange={(e) => setSettings({...settings, twoFactorRequired: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === "system" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Sistem Bilgileri</h2>
                  
                  {/* System Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">CPU Kullanımı</p>
                          <p className="text-2xl font-bold text-white">{systemStats.cpuUsage}%</p>
                        </div>
                        <Cpu className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${systemStats.cpuUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">RAM Kullanımı</p>
                          <p className="text-2xl font-bold text-white">{systemStats.memoryUsage}%</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${systemStats.memoryUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Disk Kullanımı</p>
                          <p className="text-2xl font-bold text-white">{systemStats.diskUsage}%</p>
                        </div>
                        <HardDrive className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${systemStats.diskUsage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Sistem Detayları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Versiyon:</span>
                        <span className="text-white font-medium">{systemStats.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uptime:</span>
                        <span className="text-white font-medium">{systemStats.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Aktif Kullanıcılar:</span>
                        <span className="text-white font-medium">{systemStats.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">API Çağrıları:</span>
                        <span className="text-white font-medium">{systemStats.apiCalls.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hata Oranı:</span>
                        <span className="text-white font-medium">%{systemStats.errorRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Son Yedekleme:</span>
                        <span className="text-white font-medium">{systemStats.lastBackup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs (Database, API) would follow similar pattern */}
              {activeTab === "database" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Veritabanı Ayarları</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">Otomatik Yedekleme</h3>
                        <p className="text-xs text-gray-400">Düzenli veritabanı yedeklemesi yapar</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.dbBackupEnabled}
                          onChange={(e) => setSettings({...settings, dbBackupEnabled: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Yedekleme Aralığı</label>
                        <select
                          value={settings.dbBackupInterval}
                          onChange={(e) => setSettings({...settings, dbBackupInterval: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Günlük</option>
                          <option value="weekly">Haftalık</option>
                          <option value="monthly">Aylık</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Yedek Saklama Süresi (gün)</label>
                        <input
                          type="number"
                          value={settings.dbRetentionDays}
                          onChange={(e) => setSettings({...settings, dbRetentionDays: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">API Ayarları</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Rate Limit (istekler/saat)</label>
                      <input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">API Key Geçerlilik (gün)</label>
                      <input
                        type="number"
                        value={settings.apiKeyExpiration}
                        onChange={(e) => setSettings({...settings, apiKeyExpiration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div>
                        <h3 className="text-sm font-medium text-white">Webhook Desteği</h3>
                        <p className="text-xs text-gray-400">API webhook'larını etkinleştirir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.webhookEnabled}
                          onChange={(e) => setSettings({...settings, webhookEnabled: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}