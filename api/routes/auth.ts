import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool, query } from '../db/connection.js'
import { generateToken } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'
import { z } from 'zod'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine(data => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

authRouter.post('/login', async (req, res) => {
  const data = loginSchema.parse(req.body)

  const result = await query('SELECT * FROM users WHERE email = $1', [data.email])

  if (result.rows.length === 0) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  const user = result.rows[0]
  const validPassword = await bcrypt.compare(data.password, user.password)

  if (!validPassword) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  const token = generateToken({
    id: user.id,
    uuid: user.uuid,
    email: user.email,
    name: user.name,
  })

  res.json({
    user: {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
    },
    token,
  })
})

authRouter.post('/register', async (req, res) => {
  const data = registerSchema.parse(req.body)

  const existing = await query('SELECT id FROM users WHERE email = $1', [data.email])

  if (existing.rows.length > 0) {
    throw new AppError(409, 'El email ya está registrado')
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const result = await query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, uuid, name, email`,
    [data.name, data.email, hashedPassword]
  )

  const user = result.rows[0]
  const token = generateToken({
    id: user.id,
    uuid: user.uuid,
    email: user.email,
    name: user.name,
  })

  res.status(201).json({
    user: {
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
    },
    token,
  })
})

authRouter.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' })
})

authRouter.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Token requerido')
  }

  const token = authHeader.substring(7)
  const jwt = await import('jsonwebtoken')
  const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

  try {
    const decoded = jwt.default.verify(token, JWT_SECRET) as { id: number }
    const result = await query('SELECT id, uuid, name, email FROM users WHERE id = $1', [decoded.id])

    if (result.rows.length === 0) {
      throw new AppError(404, 'Usuario no encontrado')
    }

    res.json({ user: result.rows[0] })
  } catch {
    throw new AppError(401, 'Token inválido')
  }
})