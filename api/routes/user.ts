import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool, query } from '../db/connection.js'
import { AuthRequest } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'
import { z } from 'zod'

export const userRouter = Router()

const updateProfileSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
})

const updatePasswordSchema = z.object({
  current_password: z.string().min(1),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine(data => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

userRouter.put('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = updateProfileSchema.parse(req.body)

  const existing = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [data.email, req.user!.id])

  if (existing.rows.length > 0) {
    throw new AppError(409, 'El email ya está en uso')
  }

  await query('UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [data.name, data.email, req.user!.id])

  const updated = await query('SELECT id, uuid, name, email FROM users WHERE id = $1', [req.user!.id])
  res.json({ user: updated.rows[0] })
}))

userRouter.put('/password', asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = updatePasswordSchema.parse(req.body)

  const result = await query('SELECT password FROM users WHERE id = $1', [req.user!.id])
  const user = result.rows[0]

  const validPassword = await bcrypt.compare(data.current_password, user.password)

  if (!validPassword) {
    throw new AppError(401, 'Contraseña actual incorrecta')
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)
  await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, req.user!.id])

  res.json({ message: 'Contraseña actualizada correctamente' })
}))

userRouter.delete('/account', asyncHandler(async (req: AuthRequest, res: Response) => {
  await query('DELETE FROM users WHERE id = $1', [req.user!.id])
  res.json({ message: 'Cuenta eliminada correctamente' })
}))