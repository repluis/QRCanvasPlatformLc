import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler, HttpError } from '../lib/http.js'
import { AUTH_COOKIE, requireAuth, setAuthCookie, signToken, type AuthRequest } from '../middleware/auth.js'

export const authRouter = Router()

const publicUser = { id: true, uuid: true, name: true, email: true } as const

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
})

authRouter.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body)
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    return res.status(422).json({
      error: 'Email already registered',
      errors: { email: 'Email already registered' },
    })
  }

  const user = await prisma.user.create({
    data: { ...data, password: await bcrypt.hash(data.password, 12) },
    select: publicUser,
  })

  setAuthCookie(res, signToken(user))
  res.status(201).json({ user })
}))

authRouter.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body)
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new HttpError(401, 'Invalid credentials')
  }

  setAuthCookie(res, signToken(user))
  res.json({ user: { id: user.id, uuid: user.uuid, name: user.name, email: user.email } })
}))

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(AUTH_COOKIE)
  res.status(204).end()
})

authRouter.get('/me', requireAuth, asyncHandler<AuthRequest>(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: publicUser })
  if (!user) {
    throw new HttpError(401, 'User not found')
  }
  res.json({ user })
}))
