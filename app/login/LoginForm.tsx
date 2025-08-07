"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Giriş başarısız")
        return
      }

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("isLoggedIn", "true")
        
        // Admin ise admin paneline, değilse main dashboard'a yönlendir
        if (data.user.isAdmin) {
          window.location.href = "/admin-panel"
        } else {
          window.location.href = "/main-dashboard"
        }
      } else {
        setError("Giriş başarısız")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <Link href="/" className="inline-block mb-4">
          <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors">QART</h1>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Giriş Yap</h2>
        <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {/* Kayıt Ol Linki */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Henüz hesabınız yok mu?{" "}
          <Link href="/kayit-ol" className="text-blue-600 hover:text-blue-800 font-semibold">
            Kayıt Ol
          </Link>
        </p>
      </div>

    </div>
  )
}