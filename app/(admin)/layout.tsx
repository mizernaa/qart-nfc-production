"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AdminNavigation from "@/components/admin/AdminNavigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAdmin, loading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (!isAdmin) {
      router.push("/main-dashboard")
      return
    }

    setIsReady(true)
  }, [user, isAdmin, loading, router])

  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Yükleniyor...</h2>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <>
      <AdminNavigation user={user} />
      <main>{children}</main>
    </>
  )
}