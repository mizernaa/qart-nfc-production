import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingOverlayProps {
  children?: React.ReactNode
  isLoading?: boolean
}

export function LoadingOverlay({ children, isLoading = true }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {children || <p className="text-gray-600">Yükleniyor...</p>}
      </div>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Sayfa yükleniyor..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

interface InlineLoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function InlineLoading({ message, size = "md" }: InlineLoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <LoadingSpinner size={size} />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  )
}