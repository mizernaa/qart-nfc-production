"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Palette, Eye, Save, RotateCcw } from "lucide-react"
import toast from "react-hot-toast"
import { themes as defaultThemes, type Theme } from "@/lib/themes"

interface AdvancedThemeSelectorProps {
  themes?: Theme[]
  currentTheme?: Theme
  onThemeChange: (themeId: string) => void
  onCustomThemeCreate: (theme: Omit<Theme, 'id' | 'isDefault'>) => void
}

export default function AdvancedThemeSelector({
  themes = defaultThemes,
  currentTheme = defaultThemes[0],
  onThemeChange,
  onCustomThemeCreate
}: AdvancedThemeSelectorProps) {
  const [customTheme, setCustomTheme] = useState<Omit<Theme, 'id' | 'isDefault'>>({
    name: 'Özel Tema',
    primaryColor: currentTheme.primaryColor,
    secondaryColor: currentTheme.secondaryColor,
    backgroundColor: currentTheme.backgroundColor,
    textColor: currentTheme.textColor,
    font: currentTheme.font,
    layout: currentTheme.layout
  })

  const [previewMode, setPreviewMode] = useState(false)

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Arial', label: 'Arial (Klasik)' },
    { value: 'Georgia', label: 'Georgia (Serif)' },
    { value: 'Helvetica', label: 'Helvetica (Clean)' },
    { value: 'Roboto', label: 'Roboto (Google)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' },
    { value: 'Lato', label: 'Lato (Professional)' },
    { value: 'Montserrat', label: 'Montserrat (Designer)' }
  ]

  const layoutOptions = [
    { value: 'modern', label: 'Modern (Kartlar)' },
    { value: 'minimal', label: 'Minimal (Sade)' },
    { value: 'classic', label: 'Klasik (Geleneksel)' },
    { value: 'gradient', label: 'Gradient (Renkli)' },
    { value: 'creative', label: 'Yaratıcı (Artistik)' }
  ]

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#000000', '#FFFFFF', '#6B7280', '#1F2937', '#F3F4F6'
  ]

  const handleSaveCustomTheme = async () => {
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customTheme),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Tema kaydetme hatası')
      }

      const newTheme = await response.json()
      onCustomThemeCreate(newTheme)
      toast.success('Özel tema başarıyla kaydedildi!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Tema kaydedilirken hata oluştu')
    }
  }

  const handleThemeChange = async (themeId: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      })

      if (!response.ok) {
        throw new Error('Tema güncellenemedi')
      }

      onThemeChange(themeId)
      toast.success('Tema başarıyla güncellendi!')
    } catch (error) {
      toast.error('Tema güncellenirken hata oluştu')
    }
  }

  const resetToCurrentTheme = () => {
    setCustomTheme({
      name: 'Özel Tema',
      primaryColor: currentTheme.primaryColor,
      secondaryColor: currentTheme.secondaryColor,
      backgroundColor: currentTheme.backgroundColor,
      textColor: currentTheme.textColor,
      font: currentTheme.font,
      layout: currentTheme.layout
    })
  }

  const ThemePreview = ({ theme }: { theme: Omit<Theme, 'id' | 'isDefault'> }) => (
    <div 
      className="border rounded-lg p-4 min-h-[200px]"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.font
      }}
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Ahmet Yılmaz</h3>
        <p className="text-sm opacity-80">Yazılım Geliştirici</p>
        <div 
          className="inline-block px-3 py-1 rounded text-sm text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >
          İletişim
        </div>
        <div 
          className="h-2 rounded"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        <div className="text-xs opacity-60">
          Bu tema ile profiliniz bu şekilde görünecek
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Gelişmiş Tema Ayarları
        </CardTitle>
        <CardDescription>
          Hazır temalar arasından seçim yapın veya kendi özel temanızı oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preset" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Hazır Temalar</TabsTrigger>
            <TabsTrigger value="custom">Özel Tema</TabsTrigger>
          </TabsList>

          {/* Preset Themes */}
          <TabsContent value="preset" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentTheme.id === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{theme.name}</h4>
                        {theme.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Varsayılan
                          </Badge>
                        )}
                        {currentTheme.id === theme.id && (
                          <Badge className="text-xs">Aktif</Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: theme.primaryColor }}
                          title="Ana Renk"
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: theme.secondaryColor }}
                          title="İkincil Renk"
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: theme.backgroundColor }}
                          title="Arkaplan"
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Font: {theme.font} • Layout: {theme.layout}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Theme Creator */}
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="themeName">Tema Adı</Label>
                  <Input
                    id="themeName"
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Özel tema adınız"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Ana Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={customTheme.primaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {predefinedColors.slice(0, 5).map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 hover:scale-110 transition"
                          style={{ backgroundColor: color }}
                          onClick={() => setCustomTheme(prev => ({ ...prev, primaryColor: color }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">İkincil Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={customTheme.secondaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={customTheme.secondaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#10B981"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {predefinedColors.slice(5, 10).map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 hover:scale-110 transition"
                          style={{ backgroundColor: color }}
                          onClick={() => setCustomTheme(prev => ({ ...prev, secondaryColor: color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Arkaplan Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={customTheme.backgroundColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={customTheme.backgroundColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Yazı Rengi</Label>
                    <div className="flex gap-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={customTheme.textColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={customTheme.textColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#1F2937"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font">Font Ailesi</Label>
                    <Select
                      value={customTheme.font}
                      onValueChange={(value) => setCustomTheme(prev => ({ ...prev, font: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout Stili</Label>
                    <Select
                      value={customTheme.layout}
                      onValueChange={(value) => setCustomTheme(prev => ({ ...prev, layout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {layoutOptions.map((layout) => (
                          <SelectItem key={layout.value} value={layout.value}>
                            {layout.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveCustomTheme} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Temayı Kaydet
                  </Button>
                  <Button variant="outline" onClick={resetToCurrentTheme}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Sıfırla
                  </Button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Canlı Önizleme</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {previewMode ? 'Önizlemeyi Kapat' : 'Tam Önizleme'}
                  </Button>
                </div>
                
                <ThemePreview theme={customTheme} />
                
                <div className="text-xs text-muted-foreground">
                  💡 Değişiklikler anlık olarak önizlemede görünür
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}