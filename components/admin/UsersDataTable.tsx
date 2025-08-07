"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  MoreHorizontal,
  Eye,
  UserX,
  UserCheck,
  Mail,
  Shield,
  CreditCard,
  ExternalLink
} from "lucide-react"
import toast from "react-hot-toast"

interface User {
  id: string
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  emailVerified: boolean
  createdAt: Date
  lastLoginAt?: Date | null
  profile?: {
    slug: string
  } | null
  subscription?: {
    plan: string
    status: string
  } | null
  _count: {
    cards: number
  }
}

interface UsersDataTableProps {
  users: User[]
}

export default function UsersDataTable({ users: initialUsers }: UsersDataTableProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive) ||
      (statusFilter === "admin" && user.isAdmin) ||
      (statusFilter === "verified" && user.emailVerified)
    
    return matchesSearch && matchesStatus
  })

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive })
      })

      if (!response.ok) {
        throw new Error("Güncelleme başarısız")
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ))
      
      toast.success(`Kullanıcı ${isActive ? 'aktif' : 'pasif'} hale getirildi`)
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin })
      })

      if (!response.ok) {
        throw new Error("Güncelleme başarısız")
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin } : user
      ))
      
      toast.success(`Admin yetkisi ${isAdmin ? 'verildi' : 'kaldırıldı'}`)
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Pasif</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="verified">Doğrulanmış</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>Son Giriş</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      {user.isAdmin && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.profile && (
                      <p className="text-xs text-blue-600">
                        /{user.profile.slug}
                      </p>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                    {user.emailVerified ? (
                      <Badge variant="outline" className="text-green-600">
                        Doğrulanmış
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600">
                        Beklemede
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {user.subscription?.plan || "Free"}
                    </Badge>
                    {user._count.cards > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {user._count.cards}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <p className="text-sm">
                    {user.createdAt.toLocaleDateString('tr-TR')}
                  </p>
                </TableCell>
                
                <TableCell>
                  <p className="text-sm">
                    {user.lastLoginAt 
                      ? user.lastLoginAt.toLocaleDateString('tr-TR')
                      : "Hiç"
                    }
                  </p>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {user.profile && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a 
                          href={`/${user.profile.slug}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kullanıcı Yönetimi</DialogTitle>
                          <DialogDescription>
                            {user.name} için işlem seçin
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={user.isActive ? "destructive" : "default"}
                              onClick={() => updateUserStatus(user.id, !user.isActive)}
                              disabled={isLoading}
                              className="w-full"
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Pasif Yap
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Aktif Yap
                                </>
                              )}
                            </Button>

                            <Button
                              variant={user.isAdmin ? "outline" : "secondary"}
                              onClick={() => toggleAdminStatus(user.id, !user.isAdmin)}
                              disabled={isLoading}
                              className="w-full"
                            >
                              {user.isAdmin ? (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Admin Kaldır
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Admin Yap
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Kullanıcı Bilgileri</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span>{user.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kayıt:</span>
                                <span>{user.createdAt.toLocaleDateString('tr-TR')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Son Giriş:</span>
                                <span>{user.lastLoginAt?.toLocaleDateString('tr-TR') || "Hiç"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kart Sayısı:</span>
                                <span>{user._count.cards}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        Toplam {filteredUsers.length} kullanıcı gösteriliyor
      </div>
    </div>
  )
}