"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  ExternalLink,
  Copy
} from "lucide-react"
import toast from "react-hot-toast"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string | null
  message?: string | null
  createdAt: Date
}

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Panoya kopyalandı!')
  }

  const sendEmail = (email: string, name: string) => {
    window.open(`mailto:${email}?subject=QART Dijital Kartvizit&body=Merhaba ${name},`)
  }

  const callPhone = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const sendWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Merhaba ${name}, QART dijital kartvizitim üzerinden iletişime geçtiniz.`)
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>İletişim</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{lead.name}</p>
                    {lead.message && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {lead.message}
                      </p>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-xs">{lead.email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(lead.email)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(lead.phone!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={lead.phone ? "default" : "secondary"}>
                      {lead.phone ? "Telefon var" : "Email sadece"}
                    </Badge>
                    {lead.message && (
                      <Badge variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Mesaj
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {lead.createdAt.toLocaleDateString('tr-TR')}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendEmail(lead.email, lead.name)}
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                    
                    {lead.phone && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => callPhone(lead.phone!)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100"
                          onClick={() => sendWhatsApp(lead.phone!, lead.name)}
                        >
                          <MessageSquare className="h-3 w-3 text-green-600" />
                        </Button>
                      </>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Lead Detayları</DialogTitle>
                          <DialogDescription>
                            {lead.name} tarafından gönderilen iletişim formu
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Ad Soyad</label>
                            <p className="text-sm text-gray-600">{lead.name}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{lead.email}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendEmail(lead.email, lead.name)}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Email Gönder
                              </Button>
                            </div>
                          </div>
                          
                          {lead.phone && (
                            <div>
                              <label className="text-sm font-medium">Telefon</label>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">{lead.phone}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => callPhone(lead.phone!)}
                                >
                                  <Phone className="h-3 w-3 mr-1" />
                                  Ara
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-50 hover:bg-green-100"
                                  onClick={() => sendWhatsApp(lead.phone!, lead.name)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1 text-green-600" />
                                  WhatsApp
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {lead.message && (
                            <div>
                              <label className="text-sm font-medium">Mesaj</label>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                  {lead.message}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-sm font-medium">Gönderim Tarihi</label>
                            <p className="text-sm text-gray-600">
                              {lead.createdAt.toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}