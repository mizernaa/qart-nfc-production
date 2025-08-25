import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Production-ready singleton pattern for enterprise-grade stability
const prismaClientSingleton = () => {
  // Configure connection URL with proper pooling parameters
  const databaseUrl = process.env.DATABASE_URL || ''
  
  // Ensure URL has proper connection pooling parameters for production
  const configuredUrl = databaseUrl.includes('pgbouncer=true') 
    ? databaseUrl 
    : `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}pgbouncer=true&connection_limit=10&pool_timeout=30`

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: configuredUrl
      }
    },
    // Prisma's built-in connection management is production-ready
    // No need for custom pool configuration - Prisma handles this internally
  })
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Graceful shutdown handling
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export default prisma