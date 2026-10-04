import app from './app.js'
import { config } from './config.js'
import { prisma } from './lib/prisma.js'

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
})

async function shutdown() {
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
