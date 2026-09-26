import { Router, Request, Response } from 'express'
import { AppError, asyncHandler } from '../middleware/errorHandler.js'
import { z } from 'zod'

export const qrRouter = Router()

const generateQRSchema = z.object({
  text: z.string().min(1),
  foreground_color: z.string().optional().default('000000'),
  background_color: z.string().optional().default('ffffff'),
  size: z.number().min(100).max(1000).optional().default(200),
})

qrRouter.post('/generate', asyncHandler(async (req: Request, res: Response) => {
  const data = generateQRSchema.parse(req.body)
  
  // Strip # if present
  const fg = data.foreground_color?.replace('#', '') || '000000'
  const bg = data.background_color?.replace('#', '') || 'ffffff'

  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(data.text)}&size=${data.size}&margin=2&dark=${fg}&light=${bg}`

  res.json({ qr_image_url: qrUrl })
}))