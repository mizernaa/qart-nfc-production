"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Settings
} from "lucide-react"
import toast from "react-hot-toast"

interface CustomField {
  id: string
  label: string
  value: string
  icon?: string | null
  order: number
  isVisible: boolean
}

interface CustomFieldsManagerProps {
  profileId: string
  customFields: CustomField[]
}

export default function CustomFieldsManager({ 
  profileId, 
  customFields: initialCustomFields 
}: CustomFieldsManagerProps) {
  const router = useRouter()
  const [customFields, setCustomFields] = useState(initialCustomFields)
  const [newField, setNewField] = useState({ label: "", value: "", icon: "" })
  const [isLoading, setIsLoading] = useState(false)

  const addCustomField = async () => {
    if (!newField.label || !newField.value) {
      toast.error("Etiket ve değer gereklidir")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/custom-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          label: newField.label,
          value: newField.value,
          icon: newField.icon || null,
          order: customFields.length
        })
      })

      if (!response.ok) {
        throw new Error("Ekleme başarısız")
      }

      const addedField = await response.json()
      setCustomFields([...customFields, addedField])
      setNewField({ label: "", value: "", icon: "" })
      toast.success("Özel alan eklendi!")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const updateCustomField = async (id: string, updates: Partial<CustomField>) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/custom-fields/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error("Güncelleme başarısız")
      }

      setCustomFields(customFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      ))
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCustomField = async (id: string) => {
    if (!confirm("Bu özel alanı silmek istediğinizden emin misiniz?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/custom-fields/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Silme başarısız")
      }

      setCustomFields(customFields.filter(field => field.id !== id))
      toast.success("Özel alan silindi!")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await updateCustomField(id, { isVisible })
  }

  const commonIcons = [
    "📧", "📱", "🌐", "📍", "💼", "🎓", "⭐", "🏆", 
    "🚀", "💡", "🎯", "📊", "🔧", "🎨", "📝", "💰",
    "🏢", "👨‍💻", "📈", "🌟", "🔥", "⚡", "🎵", "📷"
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Özel Alanlar
          </CardTitle>
          <CardDescription>
            Kartvizitinize ek bilgi alanları ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Field */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label>Etiket</Label>
              <Input
                placeholder="Örn: LinkedIn"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Değer</Label>
              <Input
                placeholder="Örn: linkedin.com/in/john"
                value={newField.value}
                onChange={(e) => setNewField({ ...newField, value: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>İkon (Emoji)</Label>
              <div className="space-y-2">
                <Input
                  placeholder="📧"
                  value={newField.icon}
                  onChange={(e) => setNewField({ ...newField, icon: e.target.value })}
                />
                <div className="flex flex-wrap gap-1">
                  {commonIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className="w-6 h-6 text-sm hover:bg-gray-200 rounded"
                      onClick={() => setNewField({ ...newField, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addCustomField}
                disabled={isLoading || !newField.label || !newField.value}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ekle
              </Button>
            </div>
          </div>

          {/* Existing Fields */}
          {customFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz özel alan eklemediniz</p>
              <p className="text-sm">
                Kartvizitinize ek bilgi alanları ekleyebilirsiniz
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customFields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div 
                    key={field.id}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                  >
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {field.icon && (
                        <span className="text-xl flex-shrink-0">{field.icon}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-gray-500 truncate">{field.value}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleVisibility(field.id, !field.isVisible)}
                        disabled={isLoading}
                      >
                        {field.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCustomField(field.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Pro Features */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">
              Pro Özellikler
            </h4>
            <ul className="text-sm text-purple-700 space-y-1 mb-3">
              <li>• Sınırsız özel alan</li>
              <li>• Özel simgeler (SVG)</li>
              <li>• Linklenebilir alanlar</li>
              <li>• Koşullu görünüm</li>
            </ul>
            <Button variant="outline" size="sm">
              Pro Plana Yükselt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}