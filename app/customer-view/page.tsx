"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomerView() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    const isAdminView = localStorage.getItem("adminViewAsCustomer")
    
    if (user) {
      const userData = JSON.parse(user)
      
      // Eğer admin müşteri görünümüne geçmek istiyorsa
      if (userData.isAdmin && isAdminView === "true") {
        // Flag'i temizle ve main-dashboard'a yönlendir
        localStorage.removeItem("adminViewAsCustomer")
        
        // Geçici olarak admin flag'ini kaldır
        const tempUser = { ...userData, isAdmin: false }
        localStorage.setItem("tempUser", JSON.stringify(userData))
        localStorage.setItem("user", JSON.stringify(tempUser))
        
        // Main dashboard'a yönlendir
        window.location.href = "/main-dashboard"
      } else {
        // Normal kullanıcı veya yetkisiz erişim
        window.location.href = "/login"
      }
    } else {
      window.location.href = "/login"
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Müşteri paneline yönlendiriliyorsunuz...</p>
      </div>
    </div>
  )
}