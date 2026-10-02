import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import QRCode from 'qrcode'

export const prisma = new PrismaClient()

const app = express()
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
})
app.use('/api/', limiter)

// Auth middleware
export interface AuthRequest extends express.Request {
  user?: { id: number; email: string }
}

const authMiddleware = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8),
})

const pageSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  canvases: z.array(z.any()).optional(),
  elements: z.array(z.any()).optional(),
  background: z.string().optional(),
  status: z.boolean().optional(),
})

const qrSchema = z.object({
  text: z.string().min(1),
  size: z.number().min(50).max(1000).default(200),
  foreground_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#ffffff'),
  error_correction_level: z.enum(['low', 'medium', 'quartile', 'high']).default('medium'),
  margin: z.number().default(10),
  logo_path: z.string().optional(),
})

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: { id: true, uuid: true, name: true, email: true, createdAt: true },
    })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({ user, token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      user: { id: user.id, uuid: user.uuid, name: user.name, email: user.email },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, uuid: true, name: true, email: true, createdAt: true },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Page routes
app.get('/api/pages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const pages = await prisma.page.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, uuid: true, title: true, slug: true, status: true, updatedAt: true },
    })
    res.json({ data: pages })
  } catch (error) {
    console.error('Get pages error:', error)
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
})

app.get('/api/pages/:uuid', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { uuid: req.params.uuid },
      include: { user: { select: { id: true, name: true } } },
    })
    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }
    if (!page.status) {
      return res.status(404).json({ error: 'Page not found' })
    }
    res.json({ data: page })
  } catch (error) {
    console.error('Get page error:', error)
    res.status(500).json({ error: 'Failed to fetch page' })
  }
})

app.post('/api/pages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = pageSchema.parse(req.body)
    const existing = await prisma.page.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        elements: data.elements || [],
        canvases: data.canvases ?? undefined,
        background: data.background || '#ffffff',
        status: data.status ?? true,
        userId: req.user!.id,
      },
    })
    res.status(201).json({ data: page })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Create page error:', error)
    res.status(500).json({ error: 'Failed to create page' })
  }
})

app.put('/api/pages/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string)
    const page = await prisma.page.findUnique({ where: { id } })
    if (!page || page.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const data = pageSchema.parse(req.body)
    if (data.slug && data.slug !== page.slug) {
      const existing = await prisma.page.findUnique({ where: { slug: data.slug } })
      if (existing) {
        return res.status(400).json({ error: 'Slug already exists' })
      }
    }

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        elements: data.elements ?? page.elements ?? [],
        canvases: data.canvases ?? page.canvases ?? undefined,
        background: data.background ?? page.background,
        status: data.status ?? page.status,
      },
    })
    res.json({ data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Update page error:', error)
    res.status(500).json({ error: 'Failed to update page' })
  }
})

app.delete('/api/pages/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string)
    const page = await prisma.page.findUnique({ where: { id } })
    if (!page || page.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Page not found' })
    }

    await prisma.page.delete({ where: { id } })
    res.json({ message: 'Page deleted' })
  } catch (error) {
    console.error('Delete page error:', error)
    res.status(500).json({ error: 'Failed to delete page' })
  }
})

app.post('/api/pages/:id/toggle-status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id as string)
    const page = await prisma.page.findUnique({ where: { id } })
    if (!page || page.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const updated = await prisma.page.update({
      where: { id },
      data: { status: !page.status },
    })
    res.json({ data: updated })
  } catch (error) {
    console.error('Toggle status error:', error)
    res.status(500).json({ error: 'Failed to toggle status' })
  }
})

// Templates
const templates = [
  {
    id: 'birthday',
    name: 'Birthday Invitation',
    description: 'Colorful birthday party invitation with balloons and cake',
    emoji: '🎂',
    canvases: [{
      elements: [],
      background: '#fef3c7',
      width: 800,
      height: 600,
      visible: true,
    }],
  },
  {
    id: 'wedding',
    name: 'Wedding Invitation',
    description: 'Elegant wedding invitation with floral design',
    emoji: '💍',
    canvases: [{
      elements: [],
      background: '#fdf2f8',
      width: 800,
      height: 600,
      visible: true,
    }],
  },
  {
    id: 'love',
    name: 'Love Letter',
    description: 'Romantic love letter template with hearts',
    emoji: '❤️',
    canvases: [{
      elements: [],
      background: '#fff1f2',
      width: 800,
      height: 600,
      visible: true,
    }],
  },
]

app.get('/api/templates', (req, res) => {
  res.json({ data: templates })
})

app.post('/api/pages/from-template/:templateId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const templateId = req.params.templateId as string
    const template = templates.find(t => t.id === templateId)
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    const page = await prisma.page.create({
      data: {
        title: template.name,
        slug: `${template.id}-${Date.now()}`,
        elements: [],
        canvases: template.canvases,
        background: template.canvases[0]?.background || '#ffffff',
        status: true,
        userId: req.user!.id,
      },
    })
    res.status(201).json({ data: page })
  } catch (error) {
    console.error('Create from template error:', error)
    res.status(500).json({ error: 'Failed to create page from template' })
  }
})

// QR routes
app.post('/api/qr/generate', async (req, res) => {
  try {
    const data = qrSchema.parse(req.body)
    const qrDataUrl = await QRCode.toDataURL(data.text, {
      width: data.size,
      margin: data.margin,
      color: {
        dark: data.foreground_color,
        light: data.background_color,
      },
      errorCorrectionLevel: data.error_correction_level.charAt(0).toUpperCase() as 'L' | 'M' | 'Q' | 'H',
    })

    res.json({
      image_url: qrDataUrl,
      text: data.text,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('QR generate error:', error)
    res.status(500).json({ error: 'Failed to generate QR code' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

export default app