import { Router, Request, Response } from 'express'
import { pool, query } from '../db/connection.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'

export const templatesRouter = Router()

templatesRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT id, name, description, emoji, preview_image, canvas_data FROM templates ORDER BY created_at DESC`
  )

  res.json({ templates: result.rows })
}))

templatesRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const result = await query('SELECT * FROM templates WHERE id = $1', [req.params.id])

  if (result.rows.length === 0) {
    throw new AppError(404, 'Plantilla no encontrada')
  }

  res.json(result.rows[0])
}))