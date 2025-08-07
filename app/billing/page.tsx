"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Crown,
  Check,
  Star,
  CreditCard,
  Receipt,
  Calendar,
  DollarSign,
  Zap,
  Shield,
  Users,
  BarChart3,
  Globe,
  Infinity
} from "lucide-react"

export default function BillingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)

  const plan = {
    id: "lifetime",
    name: "QART Lifetime",
    price: 799,
    period: "Tek Seferlik Ödeme",
    description: "Ömür boyu kullanım hakkı",
    features: [
      "Sınırsız Dijital Kartvizit",
      "Gelişmiş Analitik",
      "Sınırsız Sosyal Link",
      "Özel QR Kod Tasarımları",
      "Premium Temalar",
      "Öncelikli Destek",
      "Lead Yönetimi",
      "Özel Domain",
      "API Erişimi",
      "Ömür Boyu Güncellemeler"
    ],
    color: "bg-blue-100 text-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700"
  }

  const billingHistory = [
    { id: 1, date: "2024-12-15", amount: 799, status: "paid", invoice: "INV-LT-001", description: "QART Lifetime License" }
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      // Kullanıcının satın alma durumunu kontrol et (demo için true)
      setHasPurchased(true)
    } else {
      window.location.href = "/main-dashboard"
      return
    }
    setLoading(false)
  }, [])

  const handlePurchase = () => {
    // Ödeme işlemi simülasyonu
    alert("Ödeme işlemi başlatılıyor... 799 TL için güvenli ödeme sayfasına yönlendiriliyorsunuz.")
    setHasPurchased(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Satın Alma</h1>
                <p className="text-sm text-gray-600 mt-1">QART Lifetime Lisansınızı alın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasPurchased ? (
          <>
            {/* Purchased Status */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Crown className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">QART Lifetime Lisansı</h2>
                    <p className="text-green-600 font-medium">Aktif - Ömür Boyu</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">799 ₺</p>
                  <p className="text-sm text-gray-600">Tek seferlik ödeme</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">Sınırsız Profil</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">Kısıtlama yok</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-medium">Sınırsız Görüntülenme</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">Kısıtlama yok</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-900 font-medium">Sınırsız Lead</span>
                  </div>
                  <p className="text-purple-700 text-sm mt-1">Kısıtlama yok</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-900 font-medium">Premium Özellikler</span>
                  </div>
                  <p className="text-orange-700 text-sm mt-1">Tümü dahil</p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satın Alma Geçmişi</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Açıklama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fatura
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.amount} ₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Ödendi
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                          <button className="underline">{item.invoice}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Purchase Page */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">QART Lifetime</h2>
              <p className="text-gray-600">Tek seferlik ödeme ile ömür boyu kullanım hakkı</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Crown className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price} ₺</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handlePurchase}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition ${plan.buttonColor}`}
              >
                799 ₺ - Hemen Satın Al
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <Shield className="h-4 w-4 inline mr-1" />
                  30 gün para iade garantisi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}