"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Palette } from "lucide-react"
import toast from "react-hot-toast"

interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  font: string
  layout: string
  isDefault?: boolean
}

interface ThemeSelectorProps {
  themes: Theme[]
  selectedTheme: string
  onThemeChange: (themeId: string) => void
  profileId: string
}

export default function ThemeSelector({ 
  themes, 
  selectedTheme, 
  onThemeChange, 
  profileId 
}: ThemeSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const applyTheme = async (themeId: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId })
      })

      if (!response.ok) {
        throw new Error("Tema uygulanamadı")
      }

      onThemeChange(themeId)
      toast.success("Tema başarıyla uygulandı!")
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Tema Seçimi
        </CardTitle>
        <CardDescription>
          Kartvizitinizin görünümünü özelleştirin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTheme === theme.id
                  ? "border-primary shadow-md"
                  : "border-gray-200"
              }`}
              onClick={() => !isLoading && applyTheme(theme.id)}
            >
              {/* Theme Preview */}
              <div
                className="w-full h-24 rounded-lg mb-3 p-3 relative overflow-hidden"
                style={{
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                  fontFamily: theme.font
                }}
              >
                {/* Header bar */}
                <div
                  className="w-full h-2 rounded mb-2"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                
                {/* Content lines */}
                <div className="space-y-1">
                  <div
                    className="w-3/4 h-1 rounded"
                    style={{ backgroundColor: theme.textColor, opacity: 0.7 }}
                  />
                  <div
                    className="w-1/2 h-1 rounded"
                    style={{ backgroundColor: theme.textColor, opacity: 0.5 }}
                  />
                </div>

                {/* Button */}
                <div
                  className="absolute bottom-2 right-2 w-4 h-2 rounded text-xs"
                  style={{ backgroundColor: theme.secondaryColor }}
                />

                {/* Selected indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{theme.name}</h3>
                  {theme.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Varsayılan
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.primaryColor }}
                    title="Ana renk"
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.secondaryColor }}
                    title="İkincil renk"
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.backgroundColor }}
                    title="Arkaplan rengi"
                  />
                </div>

                <p className="text-xs text-gray-500 capitalize">
                  {theme.layout} • {theme.font}
                </p>
              </div>

              {/* Apply button */}
              {selectedTheme !== theme.id && (
                <Button
                  size="sm"
                  className="w-full mt-3"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation()
                    applyTheme(theme.id)
                  }}
                >
                  {isLoading ? "Uygulanıyor..." : "Uygula"}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Custom Theme Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Özel Tema Oluştur
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Pro planında kendi renklerinizi ve fontlarınızı kullanarak özel temalar oluşturabilirsiniz.
          </p>
          <Button variant="outline" size="sm">
            Pro Plana Yükselt
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}