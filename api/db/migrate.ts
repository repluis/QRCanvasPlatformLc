import { pool, initializeDatabase } from './connection.js'

async function migrate() {
  console.log('🔄 Running migrations...')
  try {
    await initializeDatabase()
    console.log('✅ Migrations completed')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()