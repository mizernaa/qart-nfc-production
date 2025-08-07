"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, Receipt, CreditCard, Calendar } from "lucide-react"

interface Invoice {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  invoice_pdf?: string
  period_start: number
  period_end: number
  description?: string
}

interface BillingHistoryProps {
  subscription?: {
    stripeCustomerId?: string | null
  } | null
  stripeCustomerId?: string | null
}

export default function BillingHistory({ subscription, stripeCustomerId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!subscription?.stripeCustomerId && !stripeCustomerId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/billing/invoices')
        if (response.ok) {
          const data = await response.json()
          setInvoices(data.invoices || [])
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [subscription?.stripeCustomerId, stripeCustomerId])

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">Ödendi</Badge>
      case 'open':
        return <Badge variant="secondary">Beklemede</Badge>
      case 'void':
        return <Badge variant="destructive">İptal</Badge>
      case 'uncollectible':
        return <Badge variant="destructive">Tahsil Edilemez</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">Henüz fatura yok</h3>
        <p className="text-gray-600">
          Ücretli plana geçtiğinizde faturalarınız burada görünecektir.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Dönem</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">#{invoice.id.slice(-8)}</p>
                      {invoice.description && (
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="font-medium">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </span>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(invoice.status)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm">
                    {formatDate(invoice.created)}
                  </span>
                </TableCell>
                
                <TableCell className="text-right">
                  {invoice.invoice_pdf && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a 
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        Son {invoices.length} fatura gösteriliyor
      </div>
    </div>
  )
}