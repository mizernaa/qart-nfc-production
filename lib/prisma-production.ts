import { PrismaClient } from '@prisma/client'

declare global {
  var prismaProduction: PrismaClient | undefined
}

// Production-specific Prisma client with connection pooling disabled
const prismaProductionClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Disable connection pooling for Vercel
    __internal: {
      engine: {
        enableRequestBatching: false,
        multiSchema: false,
        connectTimeout: 60000,
        queryTimeout: 60000
      }
    }
  } as any)
}

const prismaProduction = globalThis.prismaProduction ?? prismaProductionClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaProduction = prismaProduction
}

// Force single connection in production
if (process.env.NODE_ENV === 'production') {
  // Disable connection pooling entirely
  process.env.DATABASE_URL = process.env.DATABASE_URL?.replace('?sslmode=require', '?sslmode=require&connection_limit=1&pool_timeout=0')
}

export default prismaProduction