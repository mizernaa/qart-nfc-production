import { toast as hotToast } from "react-hot-toast"
import { toast as shadcnToast } from "@/lib/use-toast"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Unified notification system that can use either react-hot-toast or shadcn toast
export const notifications = {
  success: (message: string, options?: NotificationOptions) => {
    // Use react-hot-toast for simple success messages
    hotToast.success(message, {
      duration: options?.duration || 4000,
    })
    
    // Use shadcn toast for more complex notifications
    if (options?.title || options?.description || options?.action) {
      shadcnToast({
        title: options?.title || "Başarılı",
        description: options?.description || message,
        variant: "success",
        action: options?.action ? {
          altText: options.action.label,
          onClick: options.action.onClick,
          children: options.action.label
        } : undefined
      })
    }
  },

  error: (message: string, options?: NotificationOptions) => {
    hotToast.error(message, {
      duration: options?.duration || 6000,
    })
    
    if (options?.title || options?.description || options?.action) {
      shadcnToast({
        title: options?.title || "Hata",
        description: options?.description || message,
        variant: "destructive",
        action: options?.action ? {
          altText: options.action.label,
          onClick: options.action.onClick,
          children: options.action.label
        } : undefined
      })
    }
  },

  warning: (message: string, options?: NotificationOptions) => {
    // react-hot-toast doesn't have warning, use custom style
    hotToast(message, {
      duration: options?.duration || 5000,
      style: {
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #f59e0b'
      },
      icon: '⚠️'
    })
    
    if (options?.title || options?.description || options?.action) {
      shadcnToast({
        title: options?.title || "Uyarı",
        description: options?.description || message,
        variant: "warning",
        action: options?.action ? {
          altText: options.action.label,
          onClick: options.action.onClick,
          children: options.action.label
        } : undefined
      })
    }
  },

  info: (message: string, options?: NotificationOptions) => {
    hotToast(message, {
      duration: options?.duration || 4000,
      style: {
        background: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #3b82f6'
      },
      icon: 'ℹ️'
    })
    
    if (options?.title || options?.description || options?.action) {
      shadcnToast({
        title: options?.title || "Bilgi",
        description: options?.description || message,
        variant: "default",
        action: options?.action ? {
          altText: options.action.label,
          onClick: options.action.onClick,
          children: options.action.label
        } : undefined
      })
    }
  },

  loading: <T>(message: string, promise: Promise<T>) => {
    return hotToast.promise(promise, {
      loading: message,
      success: 'Tamamlandı!',
      error: 'Bir hata oluştu'
    })
  },

  custom: (jsx: React.ReactElement) => {
    return hotToast.custom(jsx)
  }
}

// Shorthand exports
export const notify = notifications
export { notifications as toast }