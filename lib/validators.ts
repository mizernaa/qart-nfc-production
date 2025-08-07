import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir")
    .regex(/[a-z]/, "Şifre en az bir küçük harf içermelidir")
    .regex(/[0-9]/, "Şifre en az bir rakam içermelidir"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
})

export const profileSchema = z.object({
  slug: z.string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  companyName: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().max(500, "Bio maksimum 500 karakter olabilir").optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
})

export const leadFormSchema = z.object({
  name: z.string().min(2, "İsim gereklidir"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  phone: z.string().optional(),
  message: z.string().optional(),
})