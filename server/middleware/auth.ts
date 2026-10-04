import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const AUTH_COOKIE = 'token'

export interface AuthUser {
  id: number
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export function signToken(user: AuthUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions)
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE] || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser
    req.user = { id: decoded.id, email: decoded.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
