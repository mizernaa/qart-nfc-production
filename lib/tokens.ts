import { prisma } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function generateVerificationToken(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  })

  return token
}

export async function generatePasswordResetToken(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  // Delete existing password reset tokens
  await prisma.passwordResetToken.deleteMany({
    where: { userId }
  })

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  })

  return token
}

export async function verifyPasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!resetToken) {
    return null
  }

  if (resetToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })
    return null
  }

  return resetToken
}

export async function deletePasswordResetToken(token: string) {
  await prisma.passwordResetToken.delete({
    where: { token }
  })
}