const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPassword() {
  try {
    console.log('🔄 Resetting password for omeraytac@gmail.com...')
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('omer123', 12)
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: {
        email: 'omeraytac@gmail.com'
      },
      data: {
        password: hashedPassword
      }
    })
    
    console.log('✅ Password reset successfully for:', updatedUser.email)
    console.log('📧 Email: omeraytac@gmail.com')
    console.log('🔑 New Password: omer123')
    
  } catch (error) {
    console.error('❌ Error resetting password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()