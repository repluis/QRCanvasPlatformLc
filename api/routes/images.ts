import { Router, Response } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { pool, query } from '../db/connection.js'
import { AuthRequest } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'

export const imagesRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new AppError(400, 'Solo se permiten imágenes'))
    }
  },
})

imagesRouter.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT id, uuid, name, url, created_at FROM images WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user!.id]
  )

  res.json(result.rows)
}))

imagesRouter.post('/', upload.single('image'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError(400, 'No se proporcionó ninguna imagen')
  }

  const filename = `${uuidv4()}-${req.file.originalname}`
  const url = `/uploads/${filename}`

  const result = await query(
    `INSERT INTO images (name, url, user_id) VALUES ($1, $2, $3) RETURNING *`,
    [req.file.originalname, url, req.user!.id]
  )

  res.status(201).json(result.rows[0])
}))

imagesRouter.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query('DELETE FROM images WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user!.id])

  if (result.rows.length === 0) {
    throw new AppError(404, 'Imagen no encontrada')
  }

  res.json({ message: 'Imagen eliminada correctamente' })
}))