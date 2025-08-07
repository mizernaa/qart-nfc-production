"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, AlertTriangle } from "lucide-react"

interface CurrentPlanProps {
  user: {
    subscription?: {
      plan: string
      status: string
      currentPeriodEnd: Date
    } | null
  }
  planConfig: {
    name: string
    description: string
    price: number
    features: string[]
  }
}

export default function CurrentPlan({ user, planConfig }: CurrentPlanProps) {
  const subscription = user.subscription
  const isActive = subscription?.status === 'active'
  const isCanceled = subscription?.status === 'cancelled'
  
  // Calculate days until renewal/expiration
  const daysUntilEnd = subscription?.currentPeriodEnd 
    ? Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{planConfig.name}</h3>
        <p className="text-gray-600">{planConfig.description}</p>
        
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {planConfig.price === 0 ? 'Ücretsiz' : `₺${planConfig.price}`}
          </span>
          {planConfig.price > 0 && (
            <span className="text-gray-500 ml-1">/ay</span>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <Badge 
          variant={isActive ? "default" : isCanceled ? "destructive" : "secondary"}
          className="flex items-center gap-1"
        >
          <CreditCard className="h-3 w-3" />
          {isActive ? "Aktif" : isCanceled ? "İptal Edildi" : "Beklemede"}
        </Badge>
      </div>

      {/* Renewal/Expiration Info */}
      {subscription && daysUntilEnd !== null && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            {daysUntilEnd <= 7 ? (
              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
            ) : (
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isCanceled ? 'Bitiş Tarihi' : 'Yenileme Tarihi'}
              </p>
              <p className="text-sm text-gray-600">
                {subscription.currentPeriodEnd.toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {daysUntilEnd > 0 
                  ? `${daysUntilEnd} gün kaldı`
                  : 'Süresi doldu'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Plan Özellikleri:</h4>
        <ul className="text-sm space-y-1">
          {planConfig.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-gray-600">• {feature}</li>
          ))}
          {planConfig.features.length > 3 && (
            <li className="text-gray-500 text-xs">
              +{planConfig.features.length - 3} özellik daha
            </li>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {planConfig.price === 0 ? (
          <Button className="w-full" asChild>
            <a href="#pricing">Plan Yükselt</a>
          </Button>
        ) : (
          <>
            {isActive && (
              <Button variant="outline" className="w-full" disabled>
                Aboneliği Yönet
              </Button>
            )}
            
            {isCanceled && (
              <Button className="w-full">
                Yeniden Aktifleştir
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}