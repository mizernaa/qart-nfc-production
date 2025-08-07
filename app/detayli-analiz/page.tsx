"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  User,
  Search,
  Filter,
  Eye,
  Users,
  MousePointer,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Star,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity,
  ExternalLink
} from "lucide-react"

export default function DetayliAnalizPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Demo kullanıcı verileri
  const [users] = useState([
    {
      id: "1",
      name: "Ahmet Yılmaz",
      email: "ahmet@qart.app",
      phone: "+90 555 123 4567",
      isActive: true,
      isAdmin: false,
      emailVerified: true,
      subscription: "Pro",
      profileSlug: "ahmet-yilmaz",
      title: "Yazılım Geliştirici",
      company: "Tech Solutions",
      lastLogin: "2025-01-07 14:30",
      createdAt: "2024-12-01",
      totalViews: 4567,
      totalLeads: 234,
      avatar: null
    },
    {
      id: "2",
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      phone: "+90 555 987 6543",
      isActive: true,
      isAdmin: false,
      emailVerified: true,
      subscription: "Business",
      profileSlug: "zeynep-kaya",
      title: "UI/UX Designer",
      company: "Design Studio",
      lastLogin: "2025-01-07 12:15",
      createdAt: "2024-11-15",
      totalViews: 2890,
      totalLeads: 156,
      avatar: null
    },
    {
      id: "3",
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      phone: "+90 555 456 7890",
      isActive: false,
      isAdmin: false,
      emailVerified: false,
      subscription: "Free",
      profileSlug: "mehmet-demir",
      title: "Grafik Tasarımcı",
      company: "Freelance",
      lastLogin: "2025-01-05 09:20",
      createdAt: "2024-10-20",
      totalViews: 1234,
      totalLeads: 67,
      avatar: null
    },
    {
      id: "4",
      name: "Admin User",
      email: "admin@qart.app",
      phone: "+90 555 000 0000",
      isActive: true,
      isAdmin: true,
      emailVerified: true,
      subscription: "Enterprise",
      profileSlug: "admin-profile",
      title: "Sistem Yöneticisi",
      company: "QART",
      lastLogin: "2025-01-07 15:45",
      createdAt: "2024-09-01",
      totalViews: 0,
      totalLeads: 0,
      avatar: null
    },
    {
      id: "5",
      name: "Ayşe Öz",
      email: "ayse@example.com",
      phone: "+90 555 321 6547",
      isActive: true,
      isAdmin: false,
      emailVerified: true,
      subscription: "Pro",
      profileSlug: "ayse-oz",
      title: "Pazarlama Uzmanı",
      company: "Marketing Pro",
      lastLogin: "2025-01-06 18:30",
      createdAt: "2024-12-10",
      totalViews: 3456,
      totalLeads: 189,
      avatar: null
    },
    {
      id: "6",
      name: "Can Şahin",
      email: "can@example.com",
      phone: "+90 555 789 0123",
      isActive: true,
      isAdmin: false,
      emailVerified: true,
      subscription: "Business",
      profileSlug: "can-sahin",
      title: "İş Geliştirme",
      company: "Growth Corp",
      lastLogin: "2025-01-07 10:20",
      createdAt: "2024-11-25",
      totalViews: 2134,
      totalLeads: 98,
      avatar: null
    },
    {
      id: "7",
      name: "Fatma Yılmaz",
      email: "fatma@example.com",
      phone: "+90 555 567 8901",
      isActive: true,
      isAdmin: false,
      emailVerified: false,
      subscription: "Free",
      profileSlug: "fatma-yilmaz",
      title: "İçerik Editörü",
      company: "Media House",
      lastLogin: "2025-01-06 16:45",
      createdAt: "2024-12-05",
      totalViews: 1789,
      totalLeads: 45,
      avatar: null
    },
    {
      id: "8",
      name: "Ali Kaya",
      email: "ali@example.com",
      phone: "+90 555 234 5678",
      isActive: true,
      isAdmin: false,
      emailVerified: true,
      subscription: "Pro",
      profileSlug: "ali-kaya",
      title: "Satış Danışmanı",
      company: "Sales Pro",
      lastLogin: "2025-01-07 08:15",
      createdAt: "2024-10-15",
      totalViews: 3789,
      totalLeads: 267,
      avatar: null
    }
  ])

  // Analytics summary data for selected user
  const [userAnalytics] = useState({
    "1": {
      totalViews: 4567,
      uniqueVisitors: 3456,
      totalLeads: 234,
      conversionRate: 8.2,
      averageSessionDuration: 145,
      bounceRate: 32.5,
      deviceStats: [
        { device: "Mobil", percentage: 63.3, icon: Smartphone },
        { device: "Masaüstü", percentage: 31.9, icon: Monitor },
        { device: "Tablet", percentage: 4.8, icon: Tablet }
      ]
    },
    "2": {
      totalViews: 2890,
      uniqueVisitors: 2234,
      totalLeads: 156,
      conversionRate: 5.4,
      averageSessionDuration: 128,
      bounceRate: 28.3,
      deviceStats: [
        { device: "Mobil", percentage: 58.2, icon: Smartphone },
        { device: "Masaüstü", percentage: 37.1, icon: Monitor },
        { device: "Tablet", percentage: 4.7, icon: Tablet }
      ]
    },
    "3": {
      totalViews: 1234,
      uniqueVisitors: 987,
      totalLeads: 67,
      conversionRate: 5.4,
      averageSessionDuration: 98,
      bounceRate: 45.2,
      deviceStats: [
        { device: "Mobil", percentage: 71.5, icon: Smartphone },
        { device: "Masaüstü", percentage: 24.3, icon: Monitor },
        { device: "Tablet", percentage: 4.2, icon: Tablet }
      ]
    },
    "4": {
      totalViews: 0,
      uniqueVisitors: 0,
      totalLeads: 0,
      conversionRate: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      deviceStats: [
        { device: "Mobil", percentage: 0, icon: Smartphone },
        { device: "Masaüstü", percentage: 0, icon: Monitor },
        { device: "Tablet", percentage: 0, icon: Tablet }
      ]
    },
    "5": {
      totalViews: 3456,
      uniqueVisitors: 2678,
      totalLeads: 189,
      conversionRate: 5.5,
      averageSessionDuration: 167,
      bounceRate: 25.8,
      deviceStats: [
        { device: "Mobil", percentage: 54.7, icon: Smartphone },
        { device: "Masaüstü", percentage: 40.1, icon: Monitor },
        { device: "Tablet", percentage: 5.2, icon: Tablet }
      ]
    },
    "6": {
      totalViews: 2134,
      uniqueVisitors: 1678,
      totalLeads: 98,
      conversionRate: 4.6,
      averageSessionDuration: 134,
      bounceRate: 38.2,
      deviceStats: [
        { device: "Mobil", percentage: 67.8, icon: Smartphone },
        { device: "Masaüstü", percentage: 28.1, icon: Monitor },
        { device: "Tablet", percentage: 4.1, icon: Tablet }
      ]
    },
    "7": {
      totalViews: 1789,
      uniqueVisitors: 1234,
      totalLeads: 45,
      conversionRate: 2.5,
      averageSessionDuration: 89,
      bounceRate: 52.3,
      deviceStats: [
        { device: "Mobil", percentage: 74.2, icon: Smartphone },
        { device: "Masaüstü", percentage: 21.8, icon: Monitor },
        { device: "Tablet", percentage: 4.0, icon: Tablet }
      ]
    },
    "8": {
      totalViews: 3789,
      uniqueVisitors: 2987,
      totalLeads: 267,
      conversionRate: 7.0,
      averageSessionDuration: 156,
      bounceRate: 28.9,
      deviceStats: [
        { device: "Mobil", percentage: 59.3, icon: Smartphone },
        { device: "Masaüstü", percentage: 35.7, icon: Monitor },
        { device: "Tablet", percentage: 5.0, icon: Tablet }
      ]
    }
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    } else {
      window.location.href = "/login"
      return
    }
    setLoading(false)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === "all" ? true :
                         selectedFilter === "active" ? user.isActive :
                         selectedFilter === "inactive" ? !user.isActive :
                         selectedFilter === "admin" ? user.isAdmin :
                         selectedFilter === "verified" ? user.emailVerified :
                         selectedFilter === "unverified" ? !user.emailVerified :
                         true
    
    return matchesSearch && matchesFilter
  })

  const getSubscriptionColor = (subscription: string) => {
    switch(subscription) {
      case 'Free': return 'bg-gray-100 text-gray-800'
      case 'Pro': return 'bg-blue-100 text-blue-800'
      case 'Business': return 'bg-purple-100 text-purple-800'
      case 'Enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGrowthIcon = (value: number) => {
    return value > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null
  const analytics = selectedUserId && userAnalytics[selectedUserId as keyof typeof userAnalytics] ? userAnalytics[selectedUserId as keyof typeof userAnalytics] : null

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
                onClick={() => window.location.href = '/main-dashboard'}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detaylı Kullanıcı Analizleri</h1>
                <p className="text-sm text-gray-600 mt-1">Tüm kullanıcıları görüntüleyip detaylı analiz yapın</p>
              </div>
            </div>
            {selectedUserId && (
              <button 
                onClick={() => window.location.href = `/kullanici-detay/${selectedUserId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Tam Detay Sayfası</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Seçimi</h3>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tüm Kullanıcılar</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                    <option value="admin">Admin</option>
                    <option value="verified">Email Doğrulanmış</option>
                    <option value="unverified">Email Doğrulanmamış</option>
                  </select>
                </div>
              </div>

              {/* User List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-4 border-b cursor-pointer transition ${
                      selectedUserId === user.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          {user.isAdmin && <Shield className="h-3 w-3 text-red-500" />}
                          {user.subscription === 'Pro' && <Crown className="h-3 w-3 text-blue-500" />}
                          {user.subscription === 'Business' && <Star className="h-3 w-3 text-purple-500" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                            {user.subscription}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Kullanıcı bulunamadı</p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="lg:col-span-2">
            {selectedUser && analytics ? (
              <div className="space-y-6">
                {/* Selected User Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xl">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                        {selectedUser.isAdmin && <Shield className="h-5 w-5 text-red-500" />}
                        {selectedUser.subscription === 'Pro' && <Crown className="h-5 w-5 text-blue-500" />}
                        {selectedUser.subscription === 'Business' && <Star className="h-5 w-5 text-purple-500" />}
                      </div>
                      <p className="text-gray-600">{selectedUser.title} • {selectedUser.company}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{selectedUser.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{selectedUser.phone}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <button 
                        onClick={() => window.open(`/${selectedUser.profileSlug}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Profili Görüntüle</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{analytics.totalViews.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Toplam Görüntülenme</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{analytics.uniqueVisitors.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Benzersiz Ziyaretçi</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <MousePointer className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{analytics.totalLeads}</div>
                      <div className="text-xs text-gray-600">Toplam Lead</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{formatDuration(analytics.averageSessionDuration)}</div>
                      <div className="text-xs text-gray-600">Ort. Süre</div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Metrikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 flex items-center justify-center space-x-2">
                        <span>{analytics.conversionRate}%</span>
                        {getGrowthIcon(analytics.conversionRate)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 flex items-center justify-center space-x-2">
                        <span>{analytics.bounceRate}%</span>
                        {getGrowthIcon(-analytics.bounceRate)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Bounce Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {((analytics.totalLeads / analytics.totalViews) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Lead Rate</p>
                    </div>
                  </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h3>
                  <div className="space-y-4">
                    {analytics.deviceStats.map((device) => {
                      const Icon = device.icon
                      return (
                        <div key={device.device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{device.device}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${device.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{device.percentage}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Durumu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      {selectedUser.isActive ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700">
                        {selectedUser.isActive ? 'Hesap Aktif' : 'Hesap Pasif'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedUser.emailVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className="text-sm text-gray-700">
                        Email {selectedUser.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        Kayıt: {selectedUser.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">
                        Son giriş: {selectedUser.lastLogin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kullanıcı Seçin</h3>
                <p className="text-gray-600">
                  Sol panelden bir kullanıcı seçerek detaylı analitik verilerini görüntüleyebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}