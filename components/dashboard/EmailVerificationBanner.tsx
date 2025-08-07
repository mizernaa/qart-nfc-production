"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Mail, X } from "lucide-react"
import toast from "react-hot-toast"

interface EmailVerificationBannerProps {
  email: string
  isVerified: boolean
}

export default function EmailVerificationBanner({ email, isVerified }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isVerified || isDismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Doğrulama e-postası gönderildi!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'E-posta gönderilemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-amber-800">
              E-posta Doğrulama Gerekli
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              <strong>{email}</strong> adresine gönderilen doğrulama e-postasını kontrol edin.
              Bazı özellikler e-posta doğrulanana kadar sınırlı olabilir.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending}
                className="bg-white hover:bg-amber-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isResending ? 'Gönderiliyor...' : 'Tekrar Gönder'}
              </Button>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}