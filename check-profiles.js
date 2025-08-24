const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres.eketemhixkmvjrbiceym:mizerna5334@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=disable'
    }
  }
});

async function checkProfiles() {
  try {
    console.log('📊 Profil bilgileri kontrol ediliyor...\n');
    
    // Tüm profilleri listele
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        companyName: true,
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    console.log('Bulunan profiller:');
    console.log('==================');
    
    profiles.forEach(profile => {
      console.log(`\n📌 Profil ID: ${profile.id}`);
      console.log(`   Slug: ${profile.slug || 'YOK'}`);
      console.log(`   Title: ${profile.title || 'YOK'}`);
      console.log(`   Şirket: ${profile.companyName || 'YOK'}`);
      console.log(`   Email: ${profile.user?.email}`);
      console.log(`   User Name: ${profile.user?.name}`);
      console.log(`   URL: http://localhost:3001/${profile.slug || '[SLUG-YOK]'}`);
    });

    // Ömer Aytaç'ı özel olarak kontrol et
    console.log('\n\n🔍 Ömer Aytaç kullanıcısı aranıyor...');
    const omerUser = await prisma.user.findUnique({
      where: { email: 'omeraytac@gmail.com' },
      include: {
        profile: true
      }
    });

    if (omerUser) {
      console.log('✅ Ömer Aytaç bulundu!');
      console.log(`   User ID: ${omerUser.id}`);
      console.log(`   İsim: ${omerUser.name}`);
      if (omerUser.profile) {
        console.log(`   Profile ID: ${omerUser.profile.id}`);
        console.log(`   Slug: ${omerUser.profile.slug || 'YOK - SLUG OLUŞTURULMALI!'}`);
        console.log(`   Profile Title: ${omerUser.profile.title || 'YOK'}`);
        console.log(`   Company Name: ${omerUser.profile.companyName || 'YOK'}`);
      } else {
        console.log('   ❌ PROFİL YOK - PROFİL OLUŞTURULMALI!');
      }
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProfiles();