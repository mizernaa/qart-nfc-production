import { useState } from "react"
import { Upload, X, FileText, Link2 } from "lucide-react"

interface DocumentUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder: string
  type: 'cv' | 'portfolio' | 'brochure'
}

export default function DocumentUpload({ label, value, onChange, placeholder, type }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'document')
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success && data.url) {
        onChange(data.url)
        alert('Belge başarıyla yüklendi!')
      } else {
        alert('Yükleme başarısız: ' + (data.message || 'Bilinmeyen hata'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Belge yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-2 py-1 text-xs rounded ${
              uploadMode === 'url' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Link2 className="h-3 w-3 inline mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-2 py-1 text-xs rounded ${
              uploadMode === 'file' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Upload className="h-3 w-3 inline mr-1" />
            Yükle
          </button>
        </div>
      </div>

      {uploadMode === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
          placeholder={placeholder}
        />
      ) : (
        <div className="space-y-2">
          {value && (
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <span className="text-sm text-gray-300 truncate">{value}</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    alert('Dosya boyutu 10MB\'dan küçük olmalıdır')
                    return
                  }
                  handleFileUpload(file)
                }
              }}
              className="hidden"
              id={`${type}-upload`}
              disabled={uploading}
            />
            <label
              htmlFor={`${type}-upload`}
              className={`w-full px-4 py-2 ${
                uploading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              } text-white rounded-lg flex items-center justify-center space-x-2`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Dosya Seç</span>
                </>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-400">
            PDF, Word, Excel, PowerPoint veya görsel dosyaları (Max: 10MB)
          </p>
        </div>
      )}
    </div>
  )
}