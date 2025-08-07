"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const reset = () => {
        this.setState({ hasError: false, error: undefined })
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={reset} />
      }

      return <DefaultErrorFallback error={this.state.error} reset={reset} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  reset: () => void
}

export function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Bir Hata Oluştu
          </h2>
          <p className="text-gray-600 mb-4">
            Beklenmeyen bir sorun yaşandı. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
          </p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {error && (
            <details className="text-sm bg-gray-50 p-3 rounded border">
              <summary className="cursor-pointer font-medium">Hata Detayları</summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={reset} 
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tekrar Dene
            </button>
            
            <Link href="/" className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AsyncErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
  onError?: (error: Error) => void
}

export function AsyncErrorBoundary({ children, fallback, onError }: AsyncErrorBoundaryProps) {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message))
      onError?.(new Error(event.message))
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason))
      onError?.(new Error(event.reason))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [onError])

  if (error) {
    const retry = () => setError(null)
    
    if (fallback) {
      const FallbackComponent = fallback
      return <FallbackComponent error={error} retry={retry} />
    }
    
    return <DefaultErrorFallback error={error} reset={retry} />
  }

  return <>{children}</>
}

// Component Error Boundary Hook
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    console.error('Component error:', error)
    throw error
  }, [])
}