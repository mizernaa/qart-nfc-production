"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Github,
  ExternalLink
} from "lucide-react"
import toast from "react-hot-toast"

interface SocialLink {
  id: string
  platform: string
  url: string
  isVisible: boolean
  order: number
}

interface SocialLinksManagerProps {
  profileId: string
  socialLinks: SocialLink[]
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "github", label: "GitHub", icon: Github },
  { value: "tiktok", label: "TikTok", icon: ExternalLink },
  { value: "whatsapp", label: "WhatsApp", icon: ExternalLink },
  { value: "telegram", label: "Telegram", icon: ExternalLink },
  { value: "discord", label: "Discord", icon: ExternalLink },
  { value: "pinterest", label: "Pinterest", icon: ExternalLink },
  { value: "spotify", label: "Spotify", icon: ExternalLink },
  { value: "behance", label: "Behance", icon: ExternalLink },
  { value: "dribbble", label: "Dribbble", icon: ExternalLink },
  { value: "medium", label: "Medium", icon: ExternalLink }
]

export default function SocialLinksManager({ profileId, socialLinks: initialSocialLinks }: SocialLinksManagerProps) {
  const router = useRouter()
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks)
  const [newLink, setNewLink] = useState({ platform: "", url: "" })
  const [isLoading, setIsLoading] = useState(false)

  const addSocialLink = async () => {
    if (!newLink.platform || !newLink.url) {
      toast.error("Platform ve URL gereklidir")
      return
    }

    // Validate URL
    try {
      new URL(newLink.url)
    } catch {
      toast.error("Geçerli bir URL girin")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          platform: newLink.platform,
          url: newLink.url,
          order: socialLinks.length
        })
      })

      if (!response.ok) {
        throw new Error("Ekleme başarısız")
      }

      const addedLink = await response.json()
      setSocialLinks([...socialLinks, addedLink])
      setNewLink({ platform: "", url: "" })
      toast.success("Sosyal medya linki eklendi!")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/social-links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error("Güncelleme başarısız")
      }

      setSocialLinks(socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ))
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSocialLink = async (id: string) => {
    if (!confirm("Bu sosyal medya linkini silmek istediğinizden emin misiniz?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/social-links/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Silme başarısız")
      }

      setSocialLinks(socialLinks.filter(link => link.id !== id))
      toast.success("Sosyal medya linki silindi!")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await updateSocialLink(id, { isVisible })
  }

  const getPlatformIcon = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform)
    return option ? option.icon : ExternalLink
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sosyal Medya Linkleri</CardTitle>
          <CardDescription>
            Sosyal medya hesaplarınızı ekleyin ve düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newLink.platform}
                onValueChange={(value) => setNewLink({ ...newLink, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Platform seçin" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://..."
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addSocialLink}
                disabled={isLoading || !newLink.platform || !newLink.url}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </div>
          </div>

          {/* Existing Links */}
          {socialLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz sosyal medya linki eklemediniz</p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks
                .sort((a, b) => a.order - b.order)
                .map((link) => {
                  const Icon = getPlatformIcon(link.platform)
                  return (
                    <div 
                      key={link.id}
                      className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                    >
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium capitalize">{link.platform}</p>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleVisibility(link.id, !link.isVisible)}
                          disabled={isLoading}
                        >
                          {link.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSocialLink(link.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}