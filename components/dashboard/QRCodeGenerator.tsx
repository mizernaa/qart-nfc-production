"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { QrCode, Download, Share2, Copy, Palette } from "lucide-react"
import toast from "react-hot-toast"

interface Profile {
  id: string
  slug: string
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
  user?: {
    name: string
  }
}

interface QRCodeGeneratorProps {
  profile: Profile
  profileUrl: string
}

export default function QRCodeGenerator({ profile, profileUrl }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrSettings, setQRSettings] = useState({
    size: 300,
    margin: 20,
    errorCorrectionLevel: 'M',
    foregroundColor: profile.theme.primaryColor,
    backgroundColor: '#ffffff',
    logoSize: 50,
    style: 'square',
    roundedCorners: false
  })

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateQRCode()
  }, [qrSettings, profileUrl])

  const generateQRCode = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)

    try {
      // Dynamically import QR code library to avoid SSR issues
      const QRCode = await import('qrcode')
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      // Set canvas size
      canvas.width = qrSettings.size + (qrSettings.margin * 2)
      canvas.height = qrSettings.size + (qrSettings.margin * 2)

      // Clear canvas
      ctx.fillStyle = qrSettings.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Generate QR code
      await QRCode.toCanvas(canvas, profileUrl, {
        width: qrSettings.size,
        margin: qrSettings.margin / 10,
        color: {
          dark: qrSettings.foregroundColor,
          light: qrSettings.backgroundColor
        },
        errorCorrectionLevel: qrSettings.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
      })

      // Add logo if enabled and available
      if (qrSettings.logoSize > 0 && profile.theme.primaryColor) {
        await addLogoToQR(ctx, canvas.width, canvas.height)
      }

      // Apply style modifications
      if (qrSettings.roundedCorners) {
        applyRoundedCorners(ctx, canvas.width, canvas.height)
      }

    } catch (error) {
      console.error('QR Code generation error:', error)
      toast.error('QR kod oluşturulurken hata oluştu')
    } finally {
      setIsGenerating(false)
    }
  }

  const addLogoToQR = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a simple logo using the profile's primary color
    const logoSize = qrSettings.logoSize
    const x = (width - logoSize) / 2
    const y = (height - logoSize) / 2

    // Draw white background for logo
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

    // Draw logo background
    ctx.fillStyle = profile.theme.primaryColor
    ctx.fillRect(x, y, logoSize, logoSize)

    // Draw "Q" text in the center
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${logoSize / 2}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Q', x + logoSize / 2, y + logoSize / 2)
  }

  const applyRoundedCorners = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // This is a simplified implementation
    // In a real app, you'd want more sophisticated rounded corner logic
    const radius = 10
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.roundRect(0, 0, width, height, radius)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = `qr-code-${profile.slug}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
    
    toast.success('QR kod indirildi!')
  }

  const copyQRCodeImage = async () => {
    if (!canvasRef.current) return

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          toast.success('QR kod panoya kopyalandı!')
        }
      })
    } catch (error) {
      toast.error('Kopyalama desteklenmiyor')
    }
  }

  const shareQRCode = async () => {
    if (!navigator.share || !canvasRef.current) {
      toast.error('Paylaşım desteklenmiyor')
      return
    }

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `qr-code-${profile.slug}.png`, { type: 'image/png' })
          await navigator.share({
            title: 'Dijital Kartvizit QR Kodu',
            text: 'QR kodu tarayarak dijital kartvizitimi görüntüleyebilirsiniz',
            files: [file]
          })
        }
      })
    } catch (error) {
      toast.error('Paylaşım başarısız')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* QR Code Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Kod Önizleme
          </CardTitle>
          <CardDescription>
            Oluşturulan QR kodunuzu görüntüleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-sm border">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Bu QR kodu tarayarak profilinizi görüntüleyebilirler
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {profileUrl}
            </code>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={downloadQRCode} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              İndir
            </Button>
            
            <Button 
              onClick={copyQRCodeImage} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Kopyala
            </Button>
            
            <Button 
              onClick={shareQRCode} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Paylaş
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            QR Kod Ayarları
          </CardTitle>
          <CardDescription>
            QR kodunuzu özelleştirin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Size */}
          <div className="space-y-2">
            <Label>Boyut: {qrSettings.size}px</Label>
            <Slider
              value={[qrSettings.size]}
              onValueChange={(value) => 
                setQRSettings({ ...qrSettings, size: value[0] })
              }
              min={200}
              max={600}
              step={10}
              className="w-full"
            />
          </div>

          {/* Margin */}
          <div className="space-y-2">
            <Label>Kenar Boşluğu: {qrSettings.margin}px</Label>
            <Slider
              value={[qrSettings.margin]}
              onValueChange={(value) => 
                setQRSettings({ ...qrSettings, margin: value[0] })
              }
              min={10}
              max={50}
              step={5}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="foreground">Ön Plan Rengi</Label>
              <div className="flex gap-2">
                <Input
                  id="foreground"
                  type="color"
                  value={qrSettings.foregroundColor}
                  onChange={(e) => 
                    setQRSettings({ ...qrSettings, foregroundColor: e.target.value })
                  }
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={qrSettings.foregroundColor}
                  onChange={(e) => 
                    setQRSettings({ ...qrSettings, foregroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Arka Plan Rengi</Label>
              <div className="flex gap-2">
                <Input
                  id="background"
                  type="color"
                  value={qrSettings.backgroundColor}
                  onChange={(e) => 
                    setQRSettings({ ...qrSettings, backgroundColor: e.target.value })
                  }
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={qrSettings.backgroundColor}
                  onChange={(e) => 
                    setQRSettings({ ...qrSettings, backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div className="space-y-2">
            <Label>Hata Düzeltme Seviyesi</Label>
            <Select
              value={qrSettings.errorCorrectionLevel}
              onValueChange={(value) => 
                setQRSettings({ ...qrSettings, errorCorrectionLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Düşük (7%)</SelectItem>
                <SelectItem value="M">Orta (15%)</SelectItem>
                <SelectItem value="Q">Yüksek (25%)</SelectItem>
                <SelectItem value="H">En Yüksek (30%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Yüksek seviye daha fazla hasar tolere eder ancak QR kod daha karmaşık olur
            </p>
          </div>

          {/* Logo Size */}
          <div className="space-y-2">
            <Label>Logo Boyutu: {qrSettings.logoSize}px</Label>
            <Slider
              value={[qrSettings.logoSize]}
              onValueChange={(value) => 
                setQRSettings({ ...qrSettings, logoSize: value[0] })
              }
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              0 değeri logoyu gizler
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label>Hızlı Ayarlar</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQRSettings({
                  ...qrSettings,
                  foregroundColor: '#000000',
                  backgroundColor: '#ffffff'
                })}
              >
                Klasik
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQRSettings({
                  ...qrSettings,
                  foregroundColor: profile.theme.primaryColor,
                  backgroundColor: '#ffffff'
                })}
              >
                Tema Rengi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}