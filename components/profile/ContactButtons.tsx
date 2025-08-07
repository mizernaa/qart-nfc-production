"use client"

import { Phone, Mail, MessageCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  id: string
  phone?: string | null
  email?: string | null
  whatsapp?: string | null
  user: {
    name: string
    email: string
  }
}

interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
}

interface ContactButtonsProps {
  profile: Profile
  theme: Theme
}

export default function ContactButtons({ profile, theme }: ContactButtonsProps) {
  const generateVCF = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.user.name}
EMAIL:${profile.email || profile.user.email}
${profile.phone ? `TEL:${profile.phone}` : ''}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.user.name.replace(/\s+/g, '_')}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-3 mt-6 justify-center">
      {profile.phone && (
        <Button
          size="lg"
          className="flex items-center gap-2"
          style={{ 
            backgroundColor: theme.primaryColor,
            color: "#fff"
          }}
          asChild
        >
          <a href={`tel:${profile.phone}`}>
            <Phone className="h-4 w-4" />
            Ara
          </a>
        </Button>
      )}

      {profile.email && (
        <Button
          size="lg"
          variant="outline"
          className="flex items-center gap-2"
          style={{ 
            borderColor: theme.primaryColor,
            color: theme.primaryColor
          }}
          asChild
        >
          <a href={`mailto:${profile.email}`}>
            <Mail className="h-4 w-4" />
            Email
          </a>
        </Button>
      )}

      {profile.whatsapp && (
        <Button
          size="lg"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
          asChild
        >
          <a 
            href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      )}

      <Button
        size="lg"
        variant="outline"
        className="flex items-center gap-2"
        onClick={generateVCF}
        style={{ 
          borderColor: theme.primaryColor,
          color: theme.primaryColor
        }}
      >
        <Download className="h-4 w-4" />
        Kişilere Kaydet
      </Button>
    </div>
  )
}