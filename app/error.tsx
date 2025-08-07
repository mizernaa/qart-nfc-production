"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Bir Hata Oluştu
          </CardTitle>
          <CardDescription>
            Beklenmeyen bir sorun yaşandı. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <details className="text-sm bg-gray-50 p-3 rounded border">
            <summary className="cursor-pointer font-medium">Hata Detayları</summary>
            <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
              {error.message}
              {error.digest && (
                <>
                  {"\n"}
                  Hata ID: {error.digest}
                </>
              )}
            </pre>
          </details>
          
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tekrar Dene
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}