"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  Activity,
  TrendingUp,
  Database,
  FileText,
  DollarSign,
  Eye,
  Clock,
  UserCheck,
  UserX,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Package,
  Zap,
  Globe,
  Server,
  HardDrive,
  Cpu,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  MoreVertical
} from "lucide-react"

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [refreshing, setRefreshing] = useState(false)

  // Admin istatistikleri
  const stats = {
    users: {
      total: 127,
      active: 89,
      inactive: 38,
      premium: 42,
      growth: 12.5
    },
    revenue: {
      total: 98750,
      monthly: 15600,
      today: 2399,
      growth: 8.3
    },
    system: {
      uptime: 99.9,
      cpu: 45,
      memory: 62,
      storage: 73,
      requests: 1234567
    },
    activities: {
      newUsers: 7,
      newOrders: 12,
      supportTickets: 5,
      systemAlerts: 2
    }
  }

  // Son kullanıcı aktiviteleri
  const recentActivities = [
    { id: 1, user: "Ahmet Yılmaz", action: "Yeni hesap oluşturdu", time: "5 dk önce", type: "success" },
    { id: 2, user: "Mehmet Demir", action: "Premium plan satın aldı", time: "15 dk önce", type: "premium" },
    { id: 3, user: "Ayşe Kaya", action: "Profil güncelledi", time: "1 saat önce", type: "info" },
    { id: 4, user: "Fatma Öz", action: "Destek talebi açtı", time: "2 saat önce", type: "warning" },
    { id: 5, user: "Ali Çelik", action: "Hesabını kapattı", time: "3 saat önce", type: "danger" }
  ]

  // Son siparişler
  const recentOrders = [
    { id: "#12345", customer: "Hüseyin Demir", plan: "QART Lifetime", amount: 799, status: "completed", date: "2024-01-15" },
    { id: "#12344", customer: "Zeynep Ak", plan: "QART Lifetime", amount: 799, status: "pending", date: "2024-01-15" },
    { id: "#12343", customer: "Mustafa Yıldız", plan: "QART Lifetime", amount: 799, status: "completed", date: "2024-01-14" },
    { id: "#12342", customer: "Elif Kara", plan: "QART Lifetime", amount: 799, status: "refunded", date: "2024-01-14" }
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.isAdmin) {
        router.push("/main-dashboard")
        return
      }
      setUser(userData)
    } else {
      router.push("/login")
      return
    }
    setLoading(false)
  }, [router])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

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
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-gray-400">Sistem Yönetimi</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700"
              >
                <option value="today">Bugün</option>
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="year">Bu Yıl</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                <Bell className="h-4 w-4 text-gray-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Süper Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <span className={`text-xs flex items-center ${stats.users.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.users.growth > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.users.growth)}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.users.total}</h3>
            <p className="text-sm text-gray-400">Toplam Kullanıcı</p>
            <div className="mt-3 flex items-center space-x-4 text-xs">
              <span className="text-green-400">{stats.users.active} Aktif</span>
              <span className="text-gray-400">{stats.users.inactive} Pasif</span>
              <span className="text-purple-400">{stats.users.premium} Premium</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-6 border border-green-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <span className={`text-xs flex items-center ${stats.revenue.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.revenue.growth > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(stats.revenue.growth)}%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">₺{stats.revenue.total.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">Toplam Gelir</p>
            <div className="mt-3 flex items-center space-x-4 text-xs">
              <span className="text-green-400">₺{stats.revenue.today} Bugün</span>
              <span className="text-blue-400">₺{stats.revenue.monthly.toLocaleString()} Bu Ay</span>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-6 border border-purple-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-xs text-green-400 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Sağlıklı
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">%{stats.system.uptime}</h3>
            <p className="text-sm text-gray-400">Sistem Uptime</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">CPU:</span>
                <span className="text-white ml-1">{stats.system.cpu}%</span>
              </div>
              <div>
                <span className="text-gray-500">RAM:</span>
                <span className="text-white ml-1">{stats.system.memory}%</span>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 rounded-xl p-6 border border-orange-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-xs text-orange-400">Son 24 Saat</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.activities.newUsers + stats.activities.newOrders}</h3>
            <p className="text-sm text-gray-400">Yeni İşlemler</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="text-blue-400">{stats.activities.newUsers} Yeni Kullanıcı</div>
              <div className="text-green-400">{stats.activities.newOrders} Sipariş</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <a href="/kullanici-yonetimi" className="bg-gray-900/50 hover:bg-gray-900/70 rounded-xl p-4 border border-gray-800 transition group">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-400 group-hover:scale-110 transition" />
              <span className="text-sm font-medium text-gray-300">Kullanıcı Yönetimi</span>
            </div>
          </a>
          <a href="/sistem-ayarlari" className="bg-gray-900/50 hover:bg-gray-900/70 rounded-xl p-4 border border-gray-800 transition group">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-purple-400 group-hover:scale-110 transition" />
              <span className="text-sm font-medium text-gray-300">Sistem Ayarları</span>
            </div>
          </a>
          <a href="/detayli-analiz" className="bg-gray-900/50 hover:bg-gray-900/70 rounded-xl p-4 border border-gray-800 transition group">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-green-400 group-hover:scale-110 transition" />
              <span className="text-sm font-medium text-gray-300">Detaylı Analiz</span>
            </div>
          </a>
          <button 
            onClick={() => {
              // Admin'i geçici olarak normal kullanıcı gibi davranması için işaretle
              const user = JSON.parse(localStorage.getItem("user") || "{}")
              localStorage.setItem("adminViewAsCustomer", "true")
              window.location.href = "/customer-view"
            }}
            className="bg-gray-900/50 hover:bg-gray-900/70 rounded-xl p-4 border border-gray-800 transition group"
          >
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-orange-400 group-hover:scale-110 transition" />
              <span className="text-sm font-medium text-gray-300">Müşteri Görünümü</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-400" />
                  Son Aktiviteler
                </h2>
                <button className="text-xs text-gray-400 hover:text-gray-300">Tümünü Gör</button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'success' ? 'bg-green-600/20' :
                        activity.type === 'premium' ? 'bg-purple-600/20' :
                        activity.type === 'warning' ? 'bg-yellow-600/20' :
                        activity.type === 'danger' ? 'bg-red-600/20' :
                        'bg-blue-600/20'
                      }`}>
                        {activity.type === 'success' ? <UserCheck className="h-4 w-4 text-green-400" /> :
                         activity.type === 'premium' ? <CreditCard className="h-4 w-4 text-purple-400" /> :
                         activity.type === 'warning' ? <AlertCircle className="h-4 w-4 text-yellow-400" /> :
                         activity.type === 'danger' ? <UserX className="h-4 w-4 text-red-400" /> :
                         <Activity className="h-4 w-4 text-blue-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.user}</p>
                        <p className="text-xs text-gray-400">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-400" />
                  Son Siparişler
                </h2>
                <button className="text-xs text-gray-400 hover:text-gray-300">Tümünü Gör</button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-white">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.plan} - {order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">₺{order.amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {order.status === 'completed' ? 'Tamamlandı' :
                         order.status === 'pending' ? 'Bekliyor' : 'İade'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Server className="h-5 w-5 mr-2 text-purple-400" />
            Sistem Durumu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  CPU Kullanımı
                </span>
                <span className="text-sm font-medium text-white">{stats.system.cpu}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.system.cpu}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  RAM Kullanımı
                </span>
                <span className="text-sm font-medium text-white">{stats.system.memory}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.system.memory}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400 flex items-center">
                  <HardDrive className="h-4 w-4 mr-1" />
                  Disk Kullanımı
                </span>
                <span className="text-sm font-medium text-white">{stats.system.storage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.system.storage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  API İstekleri
                </span>
                <span className="text-sm font-medium text-white">{stats.system.requests.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">Son 24 saat</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}