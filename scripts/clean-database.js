const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Veritabanı temizleniyor...')
  
  try {
    // Tüm tabloları temizle (sıralama önemli - foreign key constraints)
    await prisma.analytics.deleteMany({})
    console.log('✅ Analytics temizlendi')
    
    await prisma.leadForm.deleteMany({})
    console.log('✅ Lead forms temizlendi')
    
    await prisma.socialLink.deleteMany({})
    console.log('✅ Social links temizlendi')
    
    await prisma.customField.deleteMany({})
    console.log('✅ Custom fields temizlendi')
    
    await prisma.gallery.deleteMany({})
    console.log('✅ Gallery temizlendi')
    
    await prisma.service.deleteMany({})
    console.log('✅ Services temizlendi')
    
    await prisma.testimonial.deleteMany({})
    console.log('✅ Testimonials temizlendi')
    
    await prisma.card.deleteMany({})
    console.log('✅ Cards temizlendi')
    
    await prisma.profile.deleteMany({})
    console.log('✅ Profiles temizlendi')
    
    await prisma.subscription.deleteMany({})
    console.log('✅ Subscriptions temizlendi')
    
    await prisma.emailVerificationToken.deleteMany({})
    await prisma.passwordResetToken.deleteMany({})
    await prisma.apiKey.deleteMany({})
    console.log('✅ Tokens temizlendi')
    
    await prisma.team.deleteMany({})
    console.log('✅ Teams temizlendi')
    
    await prisma.user.deleteMany({})
    console.log('✅ Users temizlendi')
    
    await prisma.theme.deleteMany({})
    console.log('✅ Themes temizlendi')
    
    console.log('✨ Veritabanı tamamen temizlendi!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()