"use client"

import { Download, Share2, Calendar } from "lucide-react"
import toast from "react-hot-toast"

interface ProfileActionButtonsProps {
  profile: {
    name: string
    email?: string
    phone?: string
    website?: string
    enableCalendar?: boolean
    calendarLink?: string
  }
}

export default function ProfileActionButtons({ profile }: ProfileActionButtonsProps) {
  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
${profile.email ? `EMAIL:${profile.email}` : ''}
${profile.phone ? `TEL:${profile.phone}` : ''}
${profile.website ? `URL:${profile.website}` : ''}
END:VCARD`

    const blob = new Blob([vCardData], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.name.replace(' ', '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success('Kişi bilgileri indirildi!')
  }

  const shareProfile = async () => {
    const profileUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - QART Profil`,
          text: `${profile.name}'in dijital kartvizitini inceleyin`,
          url: profileUrl,
        })
        toast.success('Profil paylaşıldı!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(profileUrl)
        }
      }
    } else {
      copyToClipboard(profileUrl)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Profil linki kopyalandı!')
    }).catch(() => {
      toast.error('Kopyalama başarısız')
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button 
        onClick={downloadVCard}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Download className="h-5 w-5" />
        Kişilere Kaydet (VCF)
      </button>
      
      <button 
        onClick={shareProfile}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Share2 className="h-5 w-5" />
        Profili Paylaş
      </button>

      {profile.enableCalendar && profile.calendarLink && (
        <a 
          href={profile.calendarLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Calendar className="h-5 w-5" />
          Randevu Al
        </a>
      )}
    </div>
  )
}