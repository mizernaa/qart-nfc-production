"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { leadFormSchema } from "@/lib/validators"
import toast from "react-hot-toast"
import { Send } from "lucide-react"

type LeadFormData = z.infer<typeof leadFormSchema>

interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
}

interface LeadCaptureFormProps {
  profileId: string
  theme: Theme
}

export default function LeadCaptureForm({ profileId, theme }: LeadCaptureFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          profileId
        }),
      })

      if (!response.ok) {
        throw new Error("Gönderim başarısız")
      }

      toast.success("Mesajınız başarıyla gönderildi!")
      setIsSubmitted(true)
      reset()
    } catch (error) {
      toast.error("Bir hata oluştu, lütfen tekrar deneyin")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card 
        className="p-6 text-center"
        style={{ backgroundColor: `${theme.backgroundColor}ee` }}
      >
        <div className="space-y-4">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <Send className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Mesajınız Gönderildi!</h3>
          <p className="opacity-80">
            En kısa sürede size geri dönüş yapacağız.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            style={{ 
              borderColor: theme.primaryColor,
              color: theme.primaryColor
            }}
          >
            Yeni Mesaj Gönder
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: `${theme.backgroundColor}ee` }}>
      <CardHeader>
        <CardTitle>İletişime Geçin</CardTitle>
        <CardDescription>
          Sorularınız için bize mesaj gönderin
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 555 123 45 67"
              {...register("phone")}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              placeholder="Mesajınızı buraya yazın..."
              rows={4}
              {...register("message")}
              disabled={isLoading}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full flex items-center gap-2"
            disabled={isLoading}
            style={{ 
              backgroundColor: theme.primaryColor,
              color: "#fff"
            }}
          >
            {isLoading ? "Gönderiliyor..." : (
              <>
                <Send className="h-4 w-4" />
                Mesaj Gönder
              </>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}