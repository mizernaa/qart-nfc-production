const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function exportUser() {
  try {
    console.log('🔍 Exporting user from local database...')
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: 'omeraytac@gmail.com' },
      include: {
        profile: true,
        subscription: true
      }
    })
    
    if (!user) {
      console.log('❌ User not found in local database')
      return
    }
    
    console.log('✅ User found:', user.email)
    console.log('📧 Email:', user.email)
    console.log('👤 Name:', user.name)
    
    // Create fresh hash for production
    const newPassword = 'omer123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    console.log('\n🔑 New password hash for production:', hashedPassword.substring(0, 20) + '...')
    
    // Generate SQL for manual insertion
    const userId = `user_${Date.now()}`
    const profileId = `profile_${Date.now()}`
    const subscriptionId = `sub_${Date.now()}`
    
    const sql = `
-- Insert user
INSERT INTO "User" (
  id, email, password, name, "isActive", "isAdmin", 
  "createdAt", "updatedAt", "emailVerified"
) VALUES (
  '${userId}',
  '${user.email}',
  '${hashedPassword}',
  '${user.name}',
  true,
  false,
  NOW(),
  NOW(),
  true
);

-- Insert profile
INSERT INTO "Profile" (
  id, "userId", slug, title, bio, phone, "isPublic", "createdAt", "updatedAt"
) VALUES (
  '${profileId}',
  '${userId}',
  'omer-aytac',
  'CEO & Founder',
  'QART Digital kullanıcısı',
  '+90 555 123 4567',
  true,
  NOW(),
  NOW()
);

-- Insert subscription
INSERT INTO "Subscription" (
  id, "userId", plan, status, "currentPeriodEnd", "createdAt", "updatedAt"
) VALUES (
  '${subscriptionId}',
  '${userId}',
  'Free',
  'active',
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
);
`;

    console.log('\n📄 SQL for production database:')
    console.log(sql)
    
    console.log('\n✅ Export completed!')
    console.log('📧 Production Login Credentials:')
    console.log('   Email:', user.email)
    console.log('   Password:', newPassword)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportUser()