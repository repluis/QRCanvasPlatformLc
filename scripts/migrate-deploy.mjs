// Applies pending Prisma migrations (the `php artisan migrate --force` of this app).
// Runs on every Vercel build and can be run locally with `npm run db:deploy`.
import 'dotenv/config'
import { spawnSync } from 'node:child_process'

const BASELINE = '0_init'

/**
 * Migrations need a session connection. On Vercel + Supabase the runtime URL
 * (POSTGRES_PRISMA_URL) is the transaction pooler on port 6543, which can't run
 * them, and the direct db.<ref>.supabase.co host is IPv6-only. The same pooler
 * host in session mode (port 5432) works for both, so it is derived from there.
 */
function resolveMigrationUrl() {
  const pooled = process.env.POSTGRES_PRISMA_URL
  if (pooled) {
    const url = new URL(pooled)
    if (url.hostname.endsWith('.pooler.supabase.com')) {
      url.port = '5432'
      return { source: 'POSTGRES_PRISMA_URL (session mode)', url }
    }
  }

  const source = ['POSTGRES_URL_NON_POOLING', 'DATABASE_URL'].find((name) => process.env[name])
  return source ? { source, url: new URL(process.env[source]) } : null
}

const resolved = resolveMigrationUrl()
if (!resolved) {
  console.error('[migrate] Set DATABASE_URL to run migrations')
  process.exit(1)
}

const { source, url } = resolved
// Pooler-only params that don't apply to a session connection
for (const param of ['pgbouncer', 'connection_limit', 'supa']) url.searchParams.delete(param)

console.log(`[migrate] using ${source}: ${url.username}@${url.hostname}:${url.port}${url.pathname}`)

/** Runs a Prisma CLI command, echoing its output. */
function prisma(...args) {
  const result = spawnSync('npx', ['prisma', ...args], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: { ...process.env, DATABASE_URL: url.toString() },
  })
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  return { ok: result.status === 0, output: `${result.stdout}${result.stderr}` }
}

let deploy = prisma('migrate', 'deploy')

// P3005: tables exist but there is no migration history (created by hand or by
// the old Laravel app). The baseline migration is idempotent, so run it and
// record it as applied, then apply anything newer.
if (!deploy.ok && deploy.output.includes('P3005')) {
  console.log(`[migrate] existing database without migration history: baselining ${BASELINE}`)
  const steps = [
    ['db', 'execute', '--schema', 'prisma/schema.prisma', '--file', `prisma/migrations/${BASELINE}/migration.sql`],
    ['migrate', 'resolve', '--applied', BASELINE],
  ]
  for (const step of steps) {
    if (!prisma(...step).ok) process.exit(1)
  }
  deploy = prisma('migrate', 'deploy')
}

process.exit(deploy.ok ? 0 : 1)
