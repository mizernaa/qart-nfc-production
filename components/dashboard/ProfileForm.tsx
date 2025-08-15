"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileSchema } from "@/lib/validators"
import SocialLinksManager from "@/components/dashboard/SocialLinksManager"
import ThemeSelector from "@/components/dashboard/ThemeSelector"
import CustomFieldsManager from "@/components/dashboard/CustomFieldsManager"
import ImageUpload from "@/components/dashboard/ImageUpload"
import toast from "react-hot-toast"
import { Save, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

type ProfileFormData = z.infer<typeof profileSchema>

interface Profile {
  id: string
  slug: string
  companyName?: string | null
  title?: string | null
  bio?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  website?: string | null
  address?: string | null
  profileImage?: string | null
  logoUrl?: string | null
  coverImageUrl?: string | null
  themeId: string
  language: string
  timezone: string
  isPublic: boolean
  enableLeadCapture: boolean
  enableAnalytics: boolean
  enableCalendar: boolean
  calendarLink?: string | null
  socialLinks: SocialLink[]
  customFields: CustomField[]
  theme: Theme
}

interface SocialLink {
  id: string
  platform: string
  url: string
  isVisible: boolean
  order: number
}

interface CustomField {
  id: string
  label: string
  value: string
  icon?: string
  isVisible: boolean
  order: number
}

interface Theme {
  id: string
  name: string
  backgroundColor: string
  primaryColor: string
  textColor: string
}

interface User {
  id: string
  name: string
  email: string
}

interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  font: string
  layout: string
}

interface ProfileFormProps {
  profile: Profile
  user: User
  themes: Theme[]
}

export default function ProfileForm({ profile, user, themes }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(profile.themeId)
  const [profileImage, setProfileImage] = useState(profile.profileImage || '')
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || '')
  const [coverImageUrl, setCoverImageUrl] = useState(profile.coverImageUrl || '')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      slug: profile.slug,
      companyName: profile.companyName || "",
      title: profile.title || "",
      bio: profile.bio || "",
      phone: profile.phone || "",
      whatsapp: profile.whatsapp || "",
      email: profile.email || "",
      website: profile.website || "",
      address: profile.address || "",
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          ...data,
          themeId: selectedTheme,
          profileImage,
          logoUrl,
          coverImageUrl
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Güncelleme başarısız")
      }

      toast.success("Profil başarıyla güncellendi!")
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Profil URL&apos;iniz</h2>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_SITE_URL}/{profile.slug}
            </code>
            <Link href={`/${profile.slug}`} target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href="/profile/preview">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Önizle
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
              <CardDescription>
                Kartvizitinizde görünecek temel bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Profil URL&apos;i *</Label>
                    <Input
                      id="slug"
                      placeholder="john-doe"
                      {...register("slug")}
                      disabled={isLoading}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Sadece küçük harf, rakam ve tire kullanın
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Ünvan</Label>
                    <Input
                      id="title"
                      placeholder="Yazılım Geliştirici"
                      {...register("title")}
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Şirket Adı</Label>
                  <Input
                    id="companyName"
                    placeholder="ABC Teknoloji"
                    {...register("companyName")}
                    disabled={isLoading}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkımda</Label>
                  <Textarea
                    id="bio"
                    placeholder="Kendinizi kısaca tanıtın..."
                    rows={3}
                    {...register("bio")}
                    disabled={isLoading}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                  <p className="text-xs text-gray-500">Maksimum 500 karakter</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      {...register("phone")}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      {...register("whatsapp")}
                      disabled={isLoading}
                    />
                    {errors.whatsapp && (
                      <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.example.com"
                      {...register("website")}
                      disabled={isLoading}
                    />
                    {errors.website && (
                      <p className="text-sm text-red-500">{errors.website.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    placeholder="İş adresinizi girin..."
                    rows={2}
                    {...register("address")}
                    disabled={isLoading}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                {/* Profil Resmi */}
                <div className="space-y-2">
                  <Label>Profil Resmi</Label>
                  <ImageUpload
                    value={profileImage}
                    onChange={setProfileImage}
                    onRemove={() => setProfileImage('')}
                    disabled={isLoading}
                    type="logo"
                  />
                </div>

                {/* Logo */}
                <div className="space-y-2">
                  <Label>Şirket Logosu</Label>
                  <ImageUpload
                    value={logoUrl}
                    onChange={setLogoUrl}
                    onRemove={() => setLogoUrl('')}
                    disabled={isLoading}
                    type="logo"
                  />
                </div>

                {/* Kapak Resmi */}
                <div className="space-y-2">
                  <Label>Kapak Resmi</Label>
                  <ImageUpload
                    value={coverImageUrl}
                    onChange={setCoverImageUrl}
                    onRemove={() => setCoverImageUrl('')}
                    disabled={isLoading}
                    type="cover"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Kaydediliyor..." : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksManager 
            profileId={profile.id}
            socialLinks={profile.socialLinks}
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeSelector
            themes={themes}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            profileId={profile.id}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <CustomFieldsManager 
            profileId={profile.id}
            customFields={profile.customFields}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}