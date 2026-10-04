import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { authRouter } from './routes/auth.js'
import { pagesRouter } from './routes/pages.js'
import { templatesRouter } from './routes/templates.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: config.frontendUrl, credentials: true }))
// Canvases embed uploaded images as data URLs
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later' },
}))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.use('/api/auth', authRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/templates', templatesRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
