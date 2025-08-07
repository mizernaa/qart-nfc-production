"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  User, 
  CreditCard, 
  BarChart3, 
  QrCode, 
  Settings, 
  Users,
  LinkIcon,
  Eye
} from "lucide-react"

export function QuickAccessButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href="/profile/edit">
        <Button variant="outline" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profili Düzenle
        </Button>
      </Link>
      <Link href="/profile/preview">
        <Button variant="outline" className="w-full justify-start">
          <Eye className="mr-2 h-4 w-4" />
          Profili Önizle
        </Button>
      </Link>
      <Link href="/profile/qr-code">
        <Button variant="outline" className="w-full justify-start">
          <QrCode className="mr-2 h-4 w-4" />
          QR Kod Oluştur
        </Button>
      </Link>
      <Link href="/analytics">
        <Button variant="outline" className="w-full justify-start">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analitikler
        </Button>
      </Link>
    </div>
  )
}

export function SubscriptionButton() {
  return (
    <Link href="/billing">
      <Button>Plan Yükselt</Button>
    </Link>
  )
}

export function ViewAllLeadsButton() {
  return (
    <Link href="/leads">
      <Button variant="link" className="w-full mt-4">
        Tümünü Görüntüle
      </Button>
    </Link>
  )
}