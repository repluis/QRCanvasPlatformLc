import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Configure it in Vercel Dashboard → Settings → Environment Variables')
}

console.log('Raw DATABASE_URL:', databaseUrl)
console.log('Connecting to database:', databaseUrl.replace(/:[^:@]+@/, ':****@'))

try {
  new URL(databaseUrl)
  console.log('DATABASE_URL is valid URL format')
} catch (e) {
  console.error('DATABASE_URL is NOT a valid URL:', e)
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount })
  return res
}

export async function getClient(): Promise<pg.PoolClient> {
  return pool.connect()
}

export async function initializeDatabase() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified_at TIMESTAMP NULL,
        password VARCHAR(255) NOT NULL,
        remember_token VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        title VARCHAR(255) DEFAULT 'Sin título',
        slug VARCHAR(255) UNIQUE NOT NULL,
        elements JSONB DEFAULT '[]'::jsonb,
        canvases JSONB DEFAULT '[]'::jsonb,
        background VARCHAR(500) DEFAULT '#ffffff',
        status BOOLEAN DEFAULT true,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        emoji VARCHAR(10),
        preview_image TEXT,
        canvas_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id)
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pages_uuid ON pages(uuid)
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id)
    `)

    console.log('✅ Database initialized successfully')
  } finally {
    client.release()
  }
}

export async function closePool() {
  await pool.end()
}