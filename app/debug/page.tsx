"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<any>({})

  useEffect(() => {
    // Check localStorage
    const user = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    
    setLocalStorageData({
      user: user ? JSON.parse(user) : null,
      isLoggedIn,
      rawUser: user
    })
  }, [])

  const clearStorage = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    setLocalStorageData({})
  }

  const testLogin = async () => {
    const response = await fetch("/api/auth/simple-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@qart.app",
        password: "admin123"
      })
    })
    
    const data = await response.json()
    console.log("Test login response:", data)
    
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("isLoggedIn", "true")
      
      setLocalStorageData({
        user: data.user,
        isLoggedIn: "true",
        rawUser: JSON.stringify(data.user)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage Status</h2>
            <div className="space-y-2">
              <p><strong>isLoggedIn:</strong> {localStorageData.isLoggedIn || "null"}</p>
              <p><strong>User exists:</strong> {localStorageData.user ? "Yes" : "No"}</p>
              {localStorageData.user && (
                <div>
                  <p><strong>Email:</strong> {localStorageData.user.email}</p>
                  <p><strong>Name:</strong> {localStorageData.user.name}</p>
                  <p><strong>isAdmin:</strong> {localStorageData.user.isAdmin ? "Yes" : "No"}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-x-2">
              <button
                onClick={clearStorage}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Storage
              </button>
              <button
                onClick={testLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Test Login
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Links</h2>
            <div className="space-y-2">
              <a href="/login" className="block text-blue-600 hover:underline">
                → Login Page
              </a>
              <a href="/admin-dashboard" className="block text-blue-600 hover:underline">
                → Admin Dashboard
              </a>
              <a href="/user-dashboard" className="block text-blue-600 hover:underline">
                → User Dashboard
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}