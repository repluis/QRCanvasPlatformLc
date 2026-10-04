import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/http.js'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const errors: Record<string, string> = {}
    for (const issue of err.issues) {
      const field = issue.path.join('.') || 'general'
      errors[field] ??= issue.message
    }
    return res.status(422).json({ error: err.issues[0]?.message ?? 'Invalid data', errors })
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message })
  }

  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' })
}
