"use client"

import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileQuestion className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            404 - Sayfa Bulunamadı
          </h2>
          <p className="text-gray-600 mb-4">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Bu sayfaya ulaşmaya çalışırken bir sorun yaşandı.</p>
            <p>URL'yi kontrol edin veya ana sayfaya dönün.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
            
            <button 
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}