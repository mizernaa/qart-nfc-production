# 🐱 GitHub'a Kod Gönderme Rehberi

## 🚀 1. ADIM: GitHub Hesabı ve Depo Oluşturma

### GitHub'da Hesap Aç (Ücretsiz)
1. **[github.com](https://github.com)** adresine git
2. **"Sign up"** tıkla (hesabın yoksa)
3. **E-posta, kullanıcı adı, şifre** gir
4. **E-posta doğrulaması** yap

### Yeni Depo Oluştur
1. GitHub'da **"+"** simgesine tıkla (sağ üst köşe)
2. **"New repository"** seç
3. **Repository name:** `qart-nfc-production`
4. **Description:** `QART NFC Dijital Kartvizit Sistemi`
5. **Private** seç (önerilir - kodun gizli kalması için)
6. **"Create repository"** tıkla

---

## 💻 2. ADIM: Kodu GitHub'a Gönder

### Terminal/Command Prompt'u Aç
Windows'ta **Win + R** tuşla → `cmd` yaz → Enter

### Proje Klasörüne Git
```bash
# Proje klasörüne git
cd "C:\Users\Admin\Desktop\yeni Qart\qart-nfc"

# Mevcut durumu kontrol et
git status
```

### GitHub Deposunu Bağla
```bash
# GitHub depo URL'ini ekle (KENDİ KULLANICI ADIN ile değiştir)
git remote add origin https://github.com/KULLANICI-ADIN/qart-nfc-production.git

# Örnek:
# git remote add origin https://github.com/ahmet123/qart-nfc-production.git
```

### Kodu Gönder
```bash
# Ana branch'i ayarla
git branch -M main

# Kodu GitHub'a gönder
git push -u origin main
```

---

## 🔐 3. ADIM: GitHub Kimlik Doğrulaması

### İlk kez göndermede GitHub şifren isteyecek:

**Seçenek 1: Personal Access Token (Önerilen)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** `QART NFC Project`
4. **Expiration:** 90 days
5. **Select scopes:** `repo` işaretle
6. **"Generate token"** tıkla
7. **Token'ı kopyala** (bir daha gösterilmeyecek!)
8. Terminal'de **şifre yerine token'ı** gir

**Seçenek 2: GitHub Desktop (Kolay yol)**
1. [GitHub Desktop](https://desktop.github.com) indir ve yükle
2. GitHub hesabınla giriş yap
3. **File → Add Local Repository** → Proje klasörünü seç
4. **"Publish repository"** tıkla

---

## 📱 4. ADIM: Mobil GitHub Uygulaması (İsteğe bağlı)

Google Play/App Store'dan **"GitHub"** uygulamasını indir
- Kodlarını mobilde de görebilirsin
- Commit'leri takip edebilirsin

---

## ✅ 5. ADIM: Başarılı Gönderim Kontrolü

### GitHub'da Kontrol Et
1. **github.com/KULLANICI-ADIN/qart-nfc-production** adresine git
2. **120 dosya** görmeli sin
3. **Son commit mesajı** görünmeli: "🇹🇷 Türkçe Vercel kurulum rehberleri..."

### Terminal'de Kontrol Et
```bash
# Remote bağlantıyı kontrol et
git remote -v

# Son commit'i kontrol et  
git log --oneline -5
```

---

## 🆘 Yaygın Sorunlar ve Çözümleri

### "Permission denied" Hatası
```bash
# SSH key kurulumu yerine HTTPS kullan
git remote set-url origin https://github.com/KULLANICI-ADIN/qart-nfc-production.git
```

### "Authentication failed" Hatası
- Personal Access Token kullan (yukarıda açıklandı)
- Veya GitHub Desktop kullan

### "Repository not found" Hatası
- Kullanıcı adını doğru yazdığından emin ol
- Depo adını doğru yazdığından emin ol
- Depo private ise doğru hesapla giriş yaptığından emin ol

### "Files too large" Hatası
```bash
# node_modules klasörünü git'ten çıkar
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules
git add .gitignore
git commit -m "Remove node_modules from git"
git push
```

---

## 🎯 Özet: Tek Komutla Gönderme

Eğer yukarıdaki adımları takip ettiysen, bundan sonra kod değişikliklerini şöyle gönderebilirsin:

```bash
# Değişiklikleri ekle
git add .

# Commit mesajı yaz
git commit -m "Yeni özellik eklendi"

# GitHub'a gönder
git push
```

---

## 🎉 Tebrikler!

Kodun artık GitHub'da güvende! Vercel kurulumuna geçebilirsin:

1. ✅ **GitHub deposu oluşturuldu**
2. ✅ **Kod başarıyla gönderildi** 
3. ⏭️ **Sıradaki adım**: Vercel'de proje oluştur

**GitHub URL'in:** `https://github.com/KULLANICI-ADIN/qart-nfc-production`

Bu URL'i Vercel'de kullanacaksın! 🚀