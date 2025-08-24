const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres.eketemhixkmvjrbiceym:mizerna5334@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=disable'
    }
  }
});

async function resetAdminPassword() {
  try {
    console.log('🔄 Admin şifresi resetleniyor...');
    
    // Admin kullanıcıyı bul
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@qart.app' }
    });

    if (!adminUser) {
      console.error('❌ Admin kullanıcı bulunamadı!');
      return;
    }

    // Yeni şifre hash'i oluştur
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    await prisma.user.update({
      where: { email: 'admin@qart.app' },
      data: { 
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('✅ Admin şifresi başarıyla güncellendi!');
    console.log('📧 Email: admin@qart.app');
    console.log('🔑 Şifre: admin123');
    
    // Test et
    const updatedUser = await prisma.user.findUnique({
      where: { email: 'admin@qart.app' }
    });
    
    const isValid = await bcrypt.compare('admin123', updatedUser.password);
    console.log('🧪 Şifre doğrulama testi:', isValid ? '✅ Başarılı' : '❌ Başarısız');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();