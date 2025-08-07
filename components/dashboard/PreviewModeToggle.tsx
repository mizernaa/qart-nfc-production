"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PreviewModeToggleProps {
  profileSlug: string
  isPublic: boolean
  onToggle: (isPublic: boolean) => void
}

export default function PreviewModeToggle({ 
  profileSlug, 
  isPublic, 
  onToggle 
}: PreviewModeToggleProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      })

      if (response.ok) {
        onToggle(!isPublic)
      }
    } catch (error) {
      console.error('Toggle failed:', error)
    } finally {
      setIsToggling(false)
    }
  }

  if (!mounted) {
    return null
  }

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${profileSlug}`

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Profil Görünürlüğü
            </CardTitle>
            <CardDescription>
              Profilinizin herkese açık olup olmadığını kontrol edin
            </CardDescription>
          </div>
          <Badge variant={isPublic ? "default" : "secondary"}>
            {isPublic ? "Canlı" : "Taslak"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isPublic ? "Profil Herkese Açık" : "Profil Gizli"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPublic 
                ? "Profil linkiniz herkes tarafından görülebilir"
                : "Profil linkiniz sadece size görünür (taslak modu)"
              }
            </p>
          </div>
          
          <Button
            variant={isPublic ? "destructive" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={isToggling}
          >
            {isToggling ? (
              "Güncelleniyor..."
            ) : isPublic ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Gizle
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Yayınla
              </>
            )}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <p className="text-sm font-medium">Profil Linki:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-xs">
                {profileUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(profileUrl)}
              >
                Kopyala
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Link href={`/${profileSlug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Önizle
              </Button>
            </Link>
            
            {isPublic && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = `Dijital kartvizitimi inceleyin: ${profileUrl}`
                  navigator.share?.({ 
                    title: 'Dijital Kartvizitim', 
                    text, 
                    url: profileUrl 
                  }) || navigator.clipboard.writeText(text)
                }}
              >
                Paylaş
              </Button>
            )}
          </div>
        </div>

        {!isPublic && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <EyeOff className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  Taslak Modu Aktif
                </p>
                <p className="text-xs text-amber-700">
                  Profiliniz şu anda gizli. Değişikliklerinizi tamamladıktan sonra 
                  &quot;Yayınla&quot; butonuna tıklayarak herkese açık hale getirebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}