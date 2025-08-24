const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function fixIssues() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Sorunları düzeltiyorum...\n');
    
    // 1. Admin şifresini resetle
    console.log('1️⃣ Admin şifresi resetleniyor...');
    const adminHash = await bcrypt.hash('admin123', 10);
    
    await prisma.user.update({
      where: { email: 'admin@qart.app' },
      data: { 
        password: adminHash,
        isAdmin: true,
        isActive: true
      }
    });
    console.log('✅ Admin şifresi güncellendi: admin@qart.app / admin123');
    
    // 2. Ömer Aytaç profilini kontrol et ve slug oluştur
    console.log('\n2️⃣ Ömer Aytaç profili kontrol ediliyor...');
    const omerUser = await prisma.user.findUnique({
      where: { email: 'omeraytac@gmail.com' },
      include: { profile: true }
    });
    
    if (omerUser) {
      console.log('✅ Ömer Aytaç kullanıcısı bulundu');
      
      if (!omerUser.profile) {
        // Profil yoksa oluştur
        console.log('📝 Profil oluşturuluyor...');
        await prisma.profile.create({
          data: {
            userId: omerUser.id,
            slug: 'omer-aytac',
            title: 'Dijital Kartvizit Kullanıcısı',
            companyName: 'QART Digital',
            isPublic: true
          }
        });
        console.log('✅ Profil oluşturuldu: /omer-aytac');
      } else if (!omerUser.profile.slug) {
        // Slug yoksa ekle
        console.log('📝 Slug ekleniyor...');
        await prisma.profile.update({
          where: { id: omerUser.profile.id },
          data: { slug: 'omer-aytac' }
        });
        console.log('✅ Slug eklendi: /omer-aytac');
      } else {
        console.log(`✅ Profil mevcut: /${omerUser.profile.slug}`);
      }
    }
    
    // 3. Tüm kullanıcıları listele
    console.log('\n3️⃣ Tüm kullanıcılar:');
    console.log('==================');
    
    const allUsers = await prisma.user.findMany({
      include: { 
        profile: {
          select: {
            slug: true,
            companyName: true,
            title: true
          }
        }
      }
    });
    
    allUsers.forEach(user => {
      console.log(`\n👤 ${user.name || user.email}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Admin: ${user.isAdmin ? '✅' : '❌'}`);
      console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
      if (user.profile) {
        console.log(`   Slug: /${user.profile.slug || '[SLUG YOK]'}`);
        console.log(`   Şirket: ${user.profile.companyName || '-'}`);
      } else {
        console.log(`   ⚠️ Profil yok`);
      }
    });
    
    console.log('\n\n✅ TÜM SORUNLAR DÜZELTİLDİ!');
    console.log('==========================');
    console.log('🔑 Admin Login: admin@qart.app / admin123');
    console.log('🔗 Ömer Aytaç Profili: http://localhost:3001/omer-aytac');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixIssues();