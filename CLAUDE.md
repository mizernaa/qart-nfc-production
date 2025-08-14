# QART NFC - Dijital Kartvizit Projesi

## 🚀 PROJENİN DURUMU: LOCALHOST VE PRODUCTION TAMAMEN ÇALIŞIR DURUMDA! ✅

**KULLANICI TALEBİ - 14 Ağustos 2025:**
"Bu taleplerimi nasıl ve nereye kaydedersin bilmiyorum, gerekli yerlere kaydet bu proje kapsamında geçici çözüm istemiyorum. en doğru gerekli olan sistem neyse onu kurmalı ve sorun çıkarsa sorunları çözmeye çalışalım. PostgreSQL den vazgeçip sqlite geçtin. PostgreSQL de şifre sorunu var diye onu çözüp PostgreSQL kullansak projemiz için daha uygun olmazmıydı ?"

**YANIT: HAKLISIZ! PostgreSQL kalıcı çözümdür. Şifre sorununu çözüp PostgreSQL kuruyoruz.**

## KRİTİK SORUN: PostgreSQL Credentials Issue
**Şimdiki Durum (14 Ağustos 2025):**
- Neon PostgreSQL database'e bağlantı şifre hatası veriyor
- Error: "password authentication failed for user 'neondb_owner'"
- Mevcut connection string: postgresql://neondb_owner:npg_AzuTsd6wRv3I@...

**ÇÖZÜM SEÇENEKLER:**
1. **Neon Console'dan şifre reset**: https://console.neon.tech/
2. **Vercel Postgres kullanım**: Daha stabil ve entegre
3. **Yeni PostgreSQL provider**: Supabase, Railway, PlanetScale

**KALICI ÇÖZÜM YAKLAŞIMI:**
- ❌ Geçici SQLite/in-memory çözümler KULLANILMAYACAK
- ✅ Production-grade PostgreSQL kurulacak
- ✅ Tüm file-based sistem PostgreSQL'e migrate edilecek
- ✅ DatabaseUserStore ile kalıcı sistem kurulacak

## Proje Özeti
Bu proje, NFC teknolojisi ve QR kod ile çalışan dijital kartvizit sistemidir. Kullanıcılar profil oluşturabilir, sosyal medya bağlantılarını paylaşabilir ve analitik verileri takip edebilirler.

## Teknoloji Stack
- **Framework:** Next.js 15.4.5 (App Router)
- **Veritabanı:** **PostgreSQL + Prisma ORM** (KALICI ÇÖZÜM)
- **Authentication:** Custom auth sistemi
- **Deployment:** Vercel
- **UI Kütüphaneleri:** 
  - Radix UI
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons
- **Email:** Resend
- **QR Kod:** qrcode.js
- **Bulut Depolama:** Cloudinary

## Veritabanı Modelleri
### Ana Modeller:
- **User:** Kullanıcı bilgileri, admin yetkisi, email doğrulama
- **Profile:** Kullanıcı profil bilgileri, slug, tema, özel domain
- **Card:** NFC kart bilgileri, QR kod, tarama sayısı
- **Analytics:** Profil görüntüleme analitiği
- **Subscription:** Abonelik ve ödeme bilgileri
- **Theme:** Profil temaları
- **LeadForm:** Lead toplama formu kayıtları
- **SocialLink:** Sosyal medya bağlantıları
- **CustomField:** Özel alan eklemeleri
- **Gallery, Service, Testimonial:** Ek içerik modülleri

## Sayfa Yapısı
### Ana Sayfalar:
- `/` - Ana sayfa
- `/[slug]` - Kullanıcı profil sayfası

### Dashboard (Kimlik doğrulama gerekli):
- `/main-dashboard` - Ana navigation merkezi
- `/profile/edit` - Profil düzenleme
- `/profile/preview` - Profil önizleme  
- `/profile/qr-code` - QR kod oluşturma
- `/profil-analitik` - Kullanıcı profil analitikleri
- `/billing` - Ödeme ve abonelik
- `/leads` - Lead yönetimi

### Admin Paneli:
- `/kullanici-yonetimi` - Kullanıcı yönetimi (CRUD işlemleri)
- `/kullanici-detay/[id]` - Detaylı kullanıcı analitik sayfası
- `/sistem-ayarlari` - Sistem konfigürasyonu
- `/detayli-analiz` - Tüm kullanıcı analitik listesi

### Analitik Sayfaları:
- `/profil-analitik` - Kullanıcı kendi profil istatistikleri
- `/detayli-analiz` - Kullanıcı seçmeli analiz sayfası
- `/kullanici-detay/[id]` - Kapsamlı kullanıcı detay analizi

### Auth Sayfaları:
- `/auth/login` - Giriş
- `/auth/register` - Kayıt
- `/auth/forgot-password` - Şifre sıfırlama
- `/auth/email-verified` - Email doğrulama

## API Endpoints
### Auth:
- `/api/auth/unified-login` - **UniversalUserStore** ile login
- `/api/unified-register` - **UniversalUserStore** ile kayıt
- `/api/auth/verify-email/[token]` - Email doğrulama
- `/api/auth/forgot-password` - Şifre sıfırlama isteği
- `/api/auth/reset-password` - Şifre güncelleme

### Admin:
- `/api/admin/unified-users` - **UniversalUserStore** ile CRUD işlemleri
- `/api/stats` - **UniversalUserStore** ile istatistikler

### Profil:
- `/api/user/profile` - Profil CRUD işlemleri
- `/api/user/social-links` - Sosyal medya bağlantıları
- `/api/user/custom-fields` - Özel alanlar
- `/api/profile/lead` - Lead formu kayıt

### Analytics:
- `/api/analytics/view` - Görüntüleme kaydı
- `/api/analytics/duration` - Görüntüleme süresi

### Diğer:
- `/api/billing/create-session` - Stripe ödeme oturumu
- `/api/webhook/stripe` - Stripe webhook
- `/api/upload/image` - Görsel yükleme
- `/api/themes` - Tema listesi

## Komutlar
```bash
npm run dev        # Geliştirme sunucusu
npm run build      # Production build
npm run start      # Production sunucu
npm run lint       # Kod kalite kontrolü
npx prisma generate # Prisma client generate
npx prisma db push  # Database schema push
npx prisma studio   # Database GUI
```

## Environment Variables (.env)
```bash
# PostgreSQL (Production-grade solution)
DATABASE_URL="postgresql://neondb_owner:PASSWORD@HOST/DATABASE?sslmode=require"

# Neon/Vercel Database vars
DATABASE_URL_UNPOOLED="postgresql://..."
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."

# Application vars
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Son Yapılan Çalışmalar

### 14 Ağustos 2025 - PostgreSQL Kalıcı Çözüm İçin Çalışma Başlatıldı

#### 🔥 KULLANICI FEEDBACK'İ:
**"Geçici çözüm istemiyorum. PostgreSQL de şifre sorunu var diye onu çözüp PostgreSQL kullansak projemiz için daha uygun olmazmıydı?"**

#### ✅ DOĞRU YAKLAŞIM:
- **PostgreSQL production için en uygun çözüm**
- **Scalability, performance, ACID compliance**
- **Vercel native PostgreSQL support**
- **Real enterprise-grade solution**

#### 🔧 ŞİMDİKİ SORUN:
- Neon PostgreSQL credentials expired/invalid
- "password authentication failed for user 'neondb_owner'"
- Connection string test failed

#### 📋 YAPILACAKLAR (ÖNCELIK SIRASI):
1. **Neon console'dan şifre reset** (veya Vercel Postgres'e geç)
2. **PostgreSQL schema push** - `npx prisma db push`
3. **DatabaseUserStore migration** - File system'dan PostgreSQL'e
4. **Production test** - Admin login PostgreSQL ile
5. **File-based backup removal** - Sadece PostgreSQL kullan

#### 🎯 HEDEF:
- **Zero geçici çözüm**
- **Production-ready PostgreSQL**
- **DatabaseUserStore ile persistence**
- **Scalable architecture**

### Önceki Çalışmalar (Geçici Çözümler - KALDIRILACAK)

### 13 Ağustos 2025 - UNIFIED LOGIN & STATS SYSTEM
- ✅ Şifre doğrulama sorunları çözüldü
- ✅ Login endpoint tutarlılığı sağlandı
- ✅ Admin panel real-time stats
- **NOT: File-based sistem geçici, PostgreSQL'e geçilecek**

### 9 Ağustos 2025 - Session 4: Login Sistemi Düzeltildi
- ✅ Admin panel 401 hataları giderildi
- ✅ Logo display sorunları çözüldü
- ✅ Vercel production login başarılı
- **NOT: Geçici çözüm, PostgreSQL migration gerekli**

### 8 Ağustos 2025 - Dynamic Profile System
- ✅ Her kullanıcı kendi profil sayfası
- ✅ Auto-slug generation
- ✅ Real API data feeding
- ✅ Production deployment
- **NOT: File-based storage, PostgreSQL'e migrate edilecek**

### 6-7 Ağustos 2025 - Customer Dashboard & Dark Theme
- ✅ Customer dashboard features
- ✅ QR kod generation
- ✅ PDF report system
- ✅ Dark theme implementation

### 4 Ağustos 2025 - Premium Features
- ✅ Google business integration
- ✅ Premium theme system
- ✅ Live preview enhancements
- ✅ Pro/Free model implementation

## Bilinen Sorunlar ve Yapılacaklar

### 🔥 KRİTİK: PostgreSQL Migration (14 Ağustos 2025)
1. **Neon database credentials fix**
   - Console'dan şifre reset
   - Yeni connection string al
2. **Database schema deployment**
   - `npx prisma db push`
   - Tables oluşturma
3. **Data migration**
   - File-based users → PostgreSQL
   - Admin/demo accounts creation
4. **API endpoints update**
   - UniversalUserStore → DatabaseUserStore
   - Production PostgreSQL kullanımı
5. **Testing & validation**
   - Local PostgreSQL test
   - Production deployment
   - Admin login verification

### Gelecek Adımlar (PostgreSQL Sonrası)
1. **Email verification system**
2. **Password reset functionality**  
3. **Stripe payment integration**
4. **Real analytics system**
5. **Mobile app API**

## Notlar
- **Proje Next.js 15 App Router kullanıyor**
- **PostgreSQL production için ZORUNLU**
- **Geçici çözümler KALDIRILACAK**
- **DatabaseUserStore kalıcı çözüm**

## Claude ile Çalışma Notları
Bu proje için saatlerce çalışıldı. Konuşma devamlılığı için:
- `--resume` komutu ile kaldığınız yerden devam edebilirsiniz
- Bu CLAUDE.md dosyası güncel tutulacak
- **ÖNEMLI: Geçici çözümler dökümante edildi ama KALDIRILACAK**
- **HEDEF: PostgreSQL ile enterprise-grade solution**

## Kullanıcı Talepleri - Kayıt Sistemi

### 14 Ağustos 2025 - Kritik Feedback
**Talep:** "Bu proje kapsamında geçici çözüm istemiyorum. en doğru gerekli olan sistem neyse onu kurmalı ve sorun çıkarsa sorunları çözmeye çalışalım."

**Değerlendirme:** DOĞRU! PostgreSQL enterprise solution, geçici çözümler yerine kalıcı sistem kurulmalı.

**Aksiyon:** PostgreSQL credentials düzeltilecek, file-based sistem kaldırılacak, production-grade database implementasyonu yapılacak.

## Son Güncelleme
**14 Ağustos 2025** - PostgreSQL kalıcı çözüm çalışması başlatıldı, geçici çözümler kaldırılacak, Neon credentials sorunu çözülecek.