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

  // Gerçek kullanıcı verileri API'den çekilecek
  const [users, setUsers] = useState<any[]>([])

  // Analytics summary data for selected user
  const [userAnalytics] = useState<any>({})

  // API'den kullanıcıları çek
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/register')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.users) {
          // API'den gelen kullanıcıları formatla
          const formattedUsers = data.users.map((user: any) => ({
            ...user,
            profileSlug: user.name?.toLowerCase().replace(/\s+/g, '-') || 'user',
            subscription: user.isAdmin ? 'QART Lifetime' : 'Free',
            totalViews: 0,
            totalLeads: 0,
            lastLogin: user.createdAt || new Date().toISOString(),
            emailVerified: true,
            title: user.isAdmin ? 'Sistem Yöneticisi' : 'Kullanıcı',
            company: user.isAdmin ? 'QART Team' : '',
            avatar: null
          }))
          setUsers(formattedUsers)
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      fetchUsers() // Kullanıcıları çek
    } else {
      window.location.href = "/login"
      return
    }
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
      case 'QART Lifetime': return 'bg-orange-100 text-orange-800'
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
  const analytics = selectedUserId ? userAnalytics[selectedUserId] : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/main-dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Dashboard'a Dön
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Detaylı Analiz
          </h1>
          <p className="text-gray-600 mt-2">
            Kullanıcı seçerek detaylı analitik verilerini görüntüleyin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Kullanıcı Listesi */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Kullanıcılar ({users.length})
              </h2>
              
              {/* Search */}
              <div className="relative mt-4">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 mt-3">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="admin">Admin</option>
                  <option value="verified">Doğrulanmış</option>
                  <option value="unverified">Doğrulanmamış</option>
                </select>
              </div>
            </div>

            {/* Kullanıcı Listesi */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  Kullanıcı bulunamadı
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedUserId === user.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            user.isAdmin ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {user.isAdmin ? <Shield className="h-5 w-5" /> : user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                              {user.name}
                              {user.isAdmin && <Crown className="h-4 w-4 text-orange-500" />}
                            </h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionColor(user.subscription)}`}>
                            {user.subscription}
                          </span>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            {user.isActive ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analitik Paneli */}
          <div className="lg:col-span-3">
            {!selectedUser ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kullanıcı Seçin</h3>
                <p className="text-gray-500">
                  Sol panelden bir kullanıcı seçerek detaylı analitik verilerini görüntüleyin
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Kullanıcı Bilgileri */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      {selectedUser.name}
                    </h2>
                    <Link
                      href={`/kullanici-detay/${selectedUser.id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tam Detay Sayfası
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Telefon:</span>
                          <span className="ml-2 font-medium">{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Üyelik:</span>
                        <span className="ml-2 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600">Durum:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600">Abonelik:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getSubscriptionColor(selectedUser.subscription)}`}>
                          {selectedUser.subscription}
                        </span>
                      </div>
                      {selectedUser.isAdmin && (
                        <div className="flex items-center text-sm">
                          <Shield className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="font-medium text-orange-600">Yönetici</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedUser.totalViews || 0}</p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Toplam Lead</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedUser.totalLeads || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                        <p className="text-2xl font-bold text-gray-900">0%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Hesap Durumu</p>
                        <p className={`text-lg font-bold ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedUser.isActive ? 'Aktif' : 'Pasif'}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Cihaz Dağılımı */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium text-gray-900">Mobil</p>
                      <p className="text-lg font-bold text-blue-600">0%</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Monitor className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm font-medium text-gray-900">Masaüstü</p>
                      <p className="text-lg font-bold text-green-600">0%</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Tablet className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-medium text-gray-900">Tablet</p>
                      <p className="text-lg font-bold text-purple-600">0%</p>
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