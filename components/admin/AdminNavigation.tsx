"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  Home,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminNavigationProps {
  user: {
    id: string
    email?: string | null
    name?: string | null
    isAdmin: boolean
  }
}

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users },
  { name: "Kart Yönetimi", href: "/admin/cards", icon: CreditCard },
  { name: "Sistem Analitik", href: "/admin/analytics", icon: BarChart3 },
  { name: "Tema Yönetimi", href: "/admin/themes", icon: Palette },
  { name: "Sistem Ayarları", href: "/admin/settings", icon: Settings },
]

export default function AdminNavigation({ user }: AdminNavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    window.location.href = "/main-dashboard"
  }

  return (
    <nav className="bg-red-600 border-b border-red-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/main-dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-white hover:text-red-200 transition-colors">QART</span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-red-700 text-white"
                        : "text-red-100 hover:bg-red-700 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/main-dashboard">
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <Home className="h-4 w-4 mr-2" />
                Ana Dashboard
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-red-700">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Hesabı</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/main-dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Ana Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Sistem Ayarları
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-red-700 border-t border-red-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-red-800 text-white"
                      : "text-red-100 hover:bg-red-600 hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}