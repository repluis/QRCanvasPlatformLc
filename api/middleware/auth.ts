import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../db/connection.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface AuthRequest extends Request {
  user?: { id: number; uuid: string; email: string; name: string }
  file?: Express.Multer.File
}

export function generateToken(user: { id: number; uuid: string; email: string; name: string }): string {
  return jwt.sign(
    { id: user.id, uuid: user.uuid, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): { id: number; uuid: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; uuid: string; email: string; name: string }
  } catch {
    return null
  }
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado - Token requerido' })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }

  const result = await pool.query('SELECT id, uuid, email, name FROM users WHERE id = $1', [decoded.id])

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Usuario no encontrado' })
  }

  req.user = result.rows[0]
  next()
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (decoded) {
    pool.query('SELECT id, uuid, email, name FROM users WHERE id = $1', [decoded.id])
      .then(result => {
        if (result.rows.length > 0) {
          req.user = result.rows[0]
        }
        next()
      })
      .catch(() => next())
  } else {
    next()
  }
}