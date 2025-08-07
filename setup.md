# QART - Dijital Kartvizit Sistemi

Modern NFC teknolojisi ile dijital kartvizit sistemi. Next.js 14, TypeScript, Tailwind CSS, Prisma ORM ve PostgreSQL kullanılarak geliştirilmiştir.

## Özellikler

### 🚀 Temel Özellikler
- **NFC Desteği**: Telefonunuzu yaklaştırın, bilgilerinizi anında paylaşın
- **QR Kod**: Özelleştirilebilir QR kodlar ile hem modern hem klasik paylaşım
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Çoklu Tema**: 5+ hazır tema ve özel tema desteği
- **Çoklu Dil**: Türkçe, İngilizce, Almanca, Fransızca

### 📊 Analitik & İstatistik
- Detaylı görüntülenme istatistikleri
- Ziyaretçi analizi (cihaz, tarayıcı, konum)
- Link tıklama takibi
- Ziyaret süreleri ve referrer analizi
- Real-time dashboard

### 💼 İş Özellikleri
- Lead yakalama formları
- CRM entegrasyonları
- Ekip yönetimi
- Toplu kart yönetimi
- API erişimi

### 🔒 Güvenlik
- NextAuth.js ile güvenli authentication
- 2FA desteği
- KVKV uyumlu
- Rate limiting
- Input validation

## Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5
- **Analytics**: Custom analytics system
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/your-username/qart-nfc.git
cd qart-nfc
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env.local` dosyasını oluşturun:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/qart_nfc"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Stripe (Opsiyonel)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Veritabanını Başlatın
```bash
# Prisma veritabanını oluştur
npx prisma db push

# Seed data ekle (varsayılan temalar)
npm run db:seed
```

### 5. Uygulamayı Çalıştırın
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Kullanım

### İlk Kayıt
1. `http://localhost:3000` adresine gidin
2. "Kayıt Ol" butonuna tıklayın
3. Bilgilerinizi girin ve hesabınızı oluşturun
4. Dashboard'a yönlendirileceksiniz

### Profil Oluşturma
1. Dashboard'dan "Profili Düzenle" seçin
2. Temel bilgilerinizi girin
3. Sosyal medya hesaplarınızı ekleyin
4. Tema seçin ve özelleştirin
5. Değişiklikleri kaydedin

### QR Kod Oluşturma
1. "QR Kod" sekmesine gidin
2. QR kod ayarlarını özelleştirin
3. QR kodu indirin veya paylaşın

### Analitik Takibi
1. "Analitik" sayfasında istatistiklerinizi görün
2. Ziyaretçi analizini inceleyin
3. Lead formlarını "Lead'ler" sayfasından takip edin

## API Kullanımı

### Profile API
```bash
# Profil bilgilerini al
GET /api/user/profile

# Profili güncelle
PATCH /api/user/profile
```

### Analytics API
```bash
# Görüntülenme kaydı
POST /api/analytics/view

# Lead formu gönder
POST /api/profile/lead
```

## Deployment

### Vercel (Önerilen)
1. Projeyi GitHub'a push edin
2. Vercel'e bağlayın
3. Environment variables'ları ayarlayın
4. PostgreSQL veritabanını bağlayın (Neon, Supabase, vb.)

### Environment Variables (Production)
```env
DATABASE_URL="your-production-postgres-url"
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## Destek

- 📧 Email: support@qart.com
- 📱 WhatsApp: +90 555 123 45 67
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/qart-nfc/issues)

## Özellik İstekleri

Yeni özellik talepleri için GitHub Issues kullanın veya bize direkt ulaşın.

---

Made with ❤️ by QART Team