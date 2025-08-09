"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react"
import toast from "react-hot-toast"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  disabled?: boolean
  type?: "logo" | "cover"
  maxSize?: number // MB
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  type = "logo",
  maxSize = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`)
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yükleyebilirsiniz')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload/simple', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onChange(url)
      toast.success('Resim başarıyla yüklendi!')
    } catch (error) {
      toast.error('Resim yüklenirken hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const dimensions = type === "logo" 
    ? "w-32 h-32" 
    : "w-full h-48"

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <Card className="relative group">
          <CardContent className="p-0">
            <img
              src={value}
              alt={`${type} preview`}
              className={`${dimensions} object-cover rounded-lg`}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openFileDialog}
                  disabled={disabled || isUploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onRemove}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`${dimensions} border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {type === "logo" ? "Logo yükle" : "Kapak resmi yükle"}
                </p>
                <p className="text-xs text-gray-500">
                  Sürükle bırak veya tıkla
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max {maxSize}MB
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {type === "logo" && (
        <p className="text-xs text-gray-500">
          Önerilen boyut: 400x400px, PNG veya JPG formatı
        </p>
      )}

      {type === "cover" && (
        <p className="text-xs text-gray-500">
          Önerilen boyut: 1200x400px, PNG veya JPG formatı
        </p>
      )}
    </div>
  )
}