"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Shield } from "lucide-react"
import toast from "react-hot-toast"

interface PricingCardsProps {
  currentPlan?: string
  userId: string
  hasPurchased?: boolean
}

export default function PricingCards({ currentPlan = "", userId, hasPurchased = false }: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const plan = {
    name: "QART Lifetime",
    description: "Ömür boyu kullanım hakkı",
    price: 799,
    currency: "₺",
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
    ]
  }

  const handlePurchase = async () => {
    setIsLoading(true)

    try {
      // Ödeme işlemi simülasyonu
      toast.success("Ödeme işlemi başlatılıyor...")
      
      // Buraya gerçek ödeme entegrasyonu gelecek
      setTimeout(() => {
        toast.success("Satın alma işlemi tamamlandı!")
        window.location.href = "/billing"
      }, 2000)

    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="relative border-primary shadow-lg max-w-md w-full">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white px-3 py-1">
            Tek Seçenek
          </Badge>
        </div>

        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <CardTitle className="flex items-center justify-center gap-2">
            {plan.name}
            {hasPurchased && (
              <Badge variant="outline" className="text-xs text-green-600">
                Satın Alındı
              </Badge>
            )}
          </CardTitle>
          
          <CardDescription>{plan.description}</CardDescription>
          
          <div className="mt-4">
            <span className="text-4xl font-bold">
              {plan.price} {plan.currency}
            </span>
            <div className="text-gray-500 text-sm mt-1">Tek seferlik ödeme</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            disabled={hasPurchased || isLoading}
            onClick={handlePurchase}
          >
            {isLoading ? "İşleniyor..." : 
             hasPurchased ? "Satın Alındı" :
             "799 ₺ - Hemen Satın Al"}
          </Button>

          {hasPurchased && (
            <p className="text-xs text-center text-green-600">
              <Shield className="h-3 w-3 inline mr-1" />
              Ömür boyu aktif
            </p>
          )}

          {!hasPurchased && (
            <p className="text-xs text-center text-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              30 gün para iade garantisi
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}