import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routes/auth.js'
import { pagesRouter } from './routes/pages.js'
import { qrRouter } from './routes/qr.js'
import { imagesRouter } from './routes/images.js'
import { templatesRouter } from './routes/templates.js'
import { userRouter } from './routes/user.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/pages', authMiddleware, pagesRouter)
app.use('/api/qr', authMiddleware, qrRouter)
app.use('/api/images', authMiddleware, imagesRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/user', authMiddleware, userRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app