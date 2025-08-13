"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Download,
  Upload,
  MoreVertical,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  ArrowLeft,
  Link as LinkIcon
} from "lucide-react"
import EditUserModal from "@/components/EditUserModal"

export default function KullaniciYonetimiPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
    subscription: "Free"
  })
  
  // Gerçek kullanıcı verileri API'den çekilecek
  const [users, setUsers] = useState<any[]>([])

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    adminUsers: users.filter(u => u.isAdmin).length,
    verifiedUsers: users.filter(u => u.emailVerified || u.email).length,
    proUsers: users.filter(u => u.subscription === 'Pro').length,
    businessUsers: users.filter(u => u.subscription === 'Business').length,
    freeUsers: users.filter(u => u.subscription === 'Free').length
  }

  // API'den kullanıcıları çek
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/hybrid-users')
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
            emailVerified: true
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
      const userData = JSON.parse(savedUser)
      if (!userData.isAdmin) {
        window.location.href = "/admin-panel"
        return
      }
      setUser(userData)
      fetchUsers() // Admin ise kullanıcıları çek
    } else {
      window.location.href = "/login"
      return
    }
    setLoading(false)
  }, [])

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        setDropdownOpen(null)
      }
    }
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

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

  // Pagination hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleNewUser = () => {
    setShowNewUserModal(true)
  }

  const handleEditUser = (user: any) => {
    setEditingUser({...user})
    setShowEditUserModal(true)
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/hybrid-users?id=${userId}&action=toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // Kullanıcı listesini yenile
        fetchUsers()
        alert('Kullanıcı durumu güncellendi!')
      } else {
        alert('Hata: ' + data.message)
      }
    } catch (error) {
      console.error('Toggle user status error:', error)
      alert('Bir hata oluştu!')
    }
  }

  const deleteUser = async (userId: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/hybrid-users?id=${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()
        
        if (data.success) {
          // Kullanıcı listesini yenile
          fetchUsers()
          alert('Kullanıcı başarıyla silindi!')
        } else {
          alert('Hata: ' + data.message)
        }
      } catch (error) {
        console.error('Delete user error:', error)
        alert('Bir hata oluştu!')
      }
    }
  }

  const viewUser = (user: any) => {
    // Kullanıcı detay sayfasına yönlendir
    window.location.href = `/kullanici-detay/${user.id}`
  }

  const viewUserProfile = (user: any) => {
    // Kullanıcının public profiline git
    const slug = user.name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    window.open(`/${slug}`, '_blank')
  }

  const saveNewUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      alert("Lütfen tüm zorunlu alanları doldurun!")
      return
    }

    if (newUserData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!")
      return
    }

    try {
      const response = await fetch("/api/admin/hybrid-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserData.name,
          email: newUserData.email,
          password: newUserData.password,
          isAdmin: newUserData.isAdmin
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Kullanıcı eklenemedi!")
        return
      }

      if (data.success) {
        // Yeni kullanıcıyı listeye ekle
        const newUser = {
          id: data.user.id,
          ...newUserData,
          isActive: true,
          emailVerified: false,
          profileSlug: newUserData.name.toLowerCase().replace(/\s+/g, '-'),
          lastLogin: "Henüz giriş yapmadı",
          createdAt: new Date().toISOString().split('T')[0],
          totalViews: 0,
          totalLeads: 0
        }

        setUsers([...users, newUser])
        setShowNewUserModal(false)
        setNewUserData({
          name: "",
          email: "",
          phone: "",
          password: "",
          isAdmin: false,
          subscription: "Free"
        })
        alert("Kullanıcı başarıyla eklendi! Artık giriş yapabilir.")
      } else {
        alert(data.message || "Kullanıcı eklenemedi!")
      }
    } catch (error) {
      console.error("Kullanıcı ekleme hatası:", error)
      alert("Bir hata oluştu!")
    }
  }

  const saveEditUser = () => {
    if (!editingUser.name || !editingUser.email) {
      alert("Lütfen gerekli alanları doldurun!")
      return
    }

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ))
    setShowEditUserModal(false)
    setEditingUser(null)
    alert("Kullanıcı başarıyla güncellendi!")
  }

  const getSubscriptionColor = (subscription: string) => {
    switch(subscription) {
      case 'Free': return 'bg-gray-800 text-gray-300 border border-gray-700'
      case 'Pro': return 'bg-blue-900/30 text-blue-400 border border-blue-800'
      case 'Business': return 'bg-purple-900/30 text-purple-400 border border-purple-800'
      case 'Enterprise': return 'bg-orange-900/30 text-orange-400 border border-orange-800'
      case 'QART Lifetime': return 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-400 border border-yellow-800'
      default: return 'bg-gray-800 text-gray-300 border border-gray-700'
    }
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
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin-panel" className="text-2xl font-bold text-blue-500 hover:text-blue-400">
                QART
              </Link>
              <div className="h-6 w-px bg-gray-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
                <p className="text-sm text-gray-400 mt-1">Sistem kullanıcılarını yönetin</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
              <button 
                onClick={handleNewUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Yeni Kullanıcı</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-400">Toplam</p>
                <p className="text-lg font-semibold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-400">Aktif</p>
                <p className="text-lg font-semibold text-green-400">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-400">Admin</p>
                <p className="text-lg font-semibold text-red-400">{stats.adminUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-400" />
              <div className="ml-3">
                <p className="text-sm text-gray-400">Doğrulanmış</p>
                <p className="text-lg font-semibold text-purple-400">{stats.verifiedUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-900/30 rounded flex items-center justify-center border border-blue-800">
                <span className="text-blue-400 font-semibold text-sm">P</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Pro</p>
                <p className="text-lg font-semibold text-blue-400">{stats.proUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-900/30 rounded flex items-center justify-center border border-purple-800">
                <span className="text-purple-400 font-semibold text-sm">B</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Business</p>
                <p className="text-lg font-semibold text-purple-400">{stats.businessUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
                <span className="text-gray-400 font-semibold text-sm">F</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-400">Free</p>
                <p className="text-lg font-semibold text-gray-300">{stats.freeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 mb-6">
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara (isim, email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Kullanıcılar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="admin">Admin</option>
                  <option value="verified">Email Doğrulanmış</option>
                  <option value="unverified">Email Doğrulanmamış</option>
                </select>
                <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 text-white flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtrele</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Abonelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Son Giriş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => window.location.href = `/kullanici-detay/${user.id}`}
                              className="text-sm font-medium text-white hover:text-blue-400 transition"
                            >
                              {user.name}
                            </button>
                            {user.isAdmin && (
                              <Shield className="h-4 w-4 text-red-400" title="Admin" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">/{user.profileSlug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-900/30 text-green-400 border border-green-800' 
                            : 'bg-red-900/30 text-red-400 border border-red-800'
                        }`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Pasif
                            </>
                          )}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.emailVerified 
                            ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                        }`}>
                          {user.emailVerified ? (
                            <>
                              <Mail className="h-3 w-3 mr-1" />
                              Doğrulanmış
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Bekliyor
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <div>{user.totalViews.toLocaleString()} görüntülenme</div>
                        <div className="text-gray-500">{user.totalLeads} lead</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => window.location.href = `/kullanici-detay/${user.id}`}
                          className="text-blue-400 hover:text-blue-300" 
                          title="Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-green-400 hover:text-green-300" 
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className={`${user.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                          title={user.isActive ? 'Devre Dışı Bırak' : 'Aktif Et'}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                            className="text-gray-400 hover:text-gray-300"
                            title="Daha fazla seçenek"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {dropdownOpen === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  viewUserProfile(user)
                                  setDropdownOpen(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Public Profilini Görüntüle
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/${user.name.toLowerCase().replace(/\s+/g, '-')}`)
                                  alert('Profil linki kopyalandı!')
                                  setDropdownOpen(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                              >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Profil Linkini Kopyala
                              </button>
                              <button
                                onClick={() => {
                                  window.location.href = `mailto:${user.email}`
                                  setDropdownOpen(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                E-posta Gönder
                              </button>
                              <div className="border-t border-gray-600 my-1"></div>
                              <button
                                onClick={() => {
                                  if(confirm(`${user.name} kullanıcısını ${user.isActive ? 'devre dışı bırak' : 'aktif et'}?`)) {
                                    toggleUserStatus(user.id)
                                  }
                                  setDropdownOpen(null)
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center ${
                                  user.isActive ? 'text-red-400' : 'text-green-400'
                                }`}
                              >
                                {user.isActive ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                                {user.isActive ? 'Devre Dışı Bırak' : 'Aktif Et'}
                              </button>
                              <button
                                onClick={() => {
                                  if(confirm(`${user.name} kullanıcısını kalıcı olarak sil?`)) {
                                    deleteUser(user.id)
                                  }
                                  setDropdownOpen(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 rounded-b-lg flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Kullanıcıyı Sil
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Toplam <span className="font-medium text-white">{filteredUsers.length}</span> kullanıcıdan{' '}
                <span className="font-medium text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)}</span> gösteriliyor
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    const showPage = 
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    
                    if (!showPage && pageNumber === currentPage - 2) {
                      return <span key={pageNumber} className="px-2 text-gray-500">...</span>
                    }
                    if (!showPage && pageNumber === currentPage + 2) {
                      return <span key={pageNumber} className="px-2 text-gray-500">...</span>
                    }
                    if (!showPage) return null
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded ${
                          pageNumber === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => setShowEditUserModal(false)}
          onSave={fetchUsers}
        />
      )}

      {/* Yeni Kullanıcı Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Yeni Kullanıcı Ekle</h2>
              <button 
                onClick={() => setShowNewUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Şifre *
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="En az 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="0555 555 5555"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={newUserData.isAdmin}
                    onChange={(e) => setNewUserData({...newUserData, isAdmin: e.target.checked})}
                    className="rounded bg-gray-800 border-gray-700"
                  />
                  <span>Admin Yetkisi</span>
                </label>

                <select
                  value={newUserData.subscription}
                  onChange={(e) => setNewUserData({...newUserData, subscription: e.target.value})}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                  <option value="QART Lifetime">QART Lifetime</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={saveNewUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Kullanıcı Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}