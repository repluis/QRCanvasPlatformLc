import { PrismaClient } from '@prisma/client'

/**
 * Picks the connection string. On Vercel the Supabase integration injects
 * POSTGRES_PRISMA_URL (the pooler URL, reachable from serverless); the direct
 * db.<ref>.supabase.co host is IPv6-only and fails there. Locally DATABASE_URL
 * from .env is used.
 */
function resolveDatabaseUrl() {
  const raw = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
  if (!raw) {
    throw new Error('Set DATABASE_URL (or POSTGRES_PRISMA_URL) to your PostgreSQL connection string')
  }

  const url = new URL(raw)
  // Supabase's transaction pooler needs pgbouncer mode, and one connection per
  // serverless instance avoids exhausting the pool
  if (url.hostname.endsWith('.pooler.supabase.com')) {
    if (!url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true')
    if (!url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', '1')
  }
  return url.toString()
}

// Reuse one client across hot reloads and serverless invocations
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: resolveDatabaseUrl() })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
