import { Router, Response } from 'express'
import { pool, query } from '../db/connection.js'
import { AuthRequest } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const pagesRouter = Router()

const savePageSchema = z.object({
  title: z.string().min(1).max(255).default('My page'),
  slug: z.string().min(1).max(255).optional(),
  canvases: z.array(z.object({
    elements: z.array(z.any()),
    background: z.string().default('#ffffff'),
    width: z.number().default(800),
    height: z.number().default(600),
    visible: z.boolean().default(true),
  })).min(1),
  elements: z.array(z.any()).optional(),
  background: z.string().default('#ffffff'),
  id: z.number().optional(),
})

pagesRouter.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT id, uuid, title, slug, elements, canvases, background, status, user_id, created_at, updated_at
     FROM pages WHERE user_id = $1 ORDER BY updated_at DESC`,
    [req.user!.id]
  )

  res.json(result.rows)
}))

pagesRouter.get('/editor/data', asyncHandler(async (req: AuthRequest, res: Response) => {
  const pagesResult = await query(
    `SELECT id, uuid, title, slug, elements, canvases, background, status, user_id, created_at, updated_at
     FROM pages WHERE user_id = $1 ORDER BY updated_at DESC`,
    [req.user!.id]
  )

  const imagesResult = await query(
    `SELECT id, url, name FROM images WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user!.id]
  )

  res.json({
    images: imagesResult.rows.map((img: any) => img.url),
    userPages: pagesResult.rows,
    page: null,
  })
}))

pagesRouter.get('/:uuid', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT * FROM pages WHERE uuid = $1`,
    [req.params.uuid]
  )

  if (result.rows.length === 0) {
    throw new AppError(404, 'Página no encontrada')
  }

  const page = result.rows[0]

  if (!page.status) {
    throw new AppError(403, 'Esta página está deshabilitada')
  }

  res.json(page)
}))

pagesRouter.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = savePageSchema.parse(req.body)

  let slug = data.slug || `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  // Ensure slug is unique
  while (true) {
    const existing = await query('SELECT id FROM pages WHERE slug = $1', [slug])
    if (existing.rows.length === 0) break
    slug = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
  const canvasesJson = JSON.stringify(data.canvases)
  const elementsJson = JSON.stringify(data.canvases[0]?.elements || [])

  if (data.id) {
    const existing = await query('SELECT id FROM pages WHERE id = $1 AND user_id = $2', [data.id, req.user!.id])

    if (existing.rows.length === 0) {
      throw new AppError(404, 'Página no encontrada')
    }

    await query(
      `UPDATE pages SET title = $1, slug = $2, canvases = $3, elements = $4, background = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [data.title, slug, canvasesJson, elementsJson, data.background, data.id]
    )

    const updated = await query('SELECT * FROM pages WHERE id = $1', [data.id])
    return res.json({ page: updated.rows[0] })
  }

  const result = await query(
    `INSERT INTO pages (title, slug, elements, canvases, background, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, slug, elementsJson, canvasesJson, data.background, req.user!.id]
  )

  res.status(201).json({ page: result.rows[0] })
}))

pagesRouter.post('/:id/toggle-status', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query('SELECT * FROM pages WHERE id = $1 AND user_id = $2', [req.params.id, req.user!.id])

  if (result.rows.length === 0) {
    throw new AppError(404, 'Página no encontrada')
  }

  const page = result.rows[0]
  const newStatus = !page.status

  await query('UPDATE pages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newStatus, req.params.id])

  const updated = await query('SELECT * FROM pages WHERE id = $1', [req.params.id])
  res.json({ page: updated.rows[0] })
}))

pagesRouter.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query('DELETE FROM pages WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user!.id])

  if (result.rows.length === 0) {
    throw new AppError(404, 'Página no encontrada')
  }

  res.json({ message: 'Página eliminada correctamente' })
}))

pagesRouter.post('/from-template/:templateId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const templateResult = await query('SELECT canvas_data FROM templates WHERE id = $1', [req.params.templateId])

  if (templateResult.rows.length === 0) {
    throw new AppError(404, 'Plantilla no encontrada')
  }

  const template = templateResult.rows[0]
  const canvases = template.canvas_data
  let slug = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  while (true) {
    const existing = await query('SELECT id FROM pages WHERE slug = $1', [slug])
    if (existing.rows.length === 0) break
    slug = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
  const elementsJson = JSON.stringify(canvases[0]?.elements || [])
  const canvasesJson = JSON.stringify(canvases)

  const result = await query(
    `INSERT INTO pages (title, slug, elements, canvases, background, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    ['From template', slug, elementsJson, canvasesJson, canvases[0]?.background || '#ffffff', req.user!.id]
  )

  res.status(201).json({ page: result.rows[0] })
}))