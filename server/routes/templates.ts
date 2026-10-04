import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { templates } from '../templates/index.js'

export const templatesRouter = Router()

templatesRouter.get('/', requireAuth, (_req, res) => {
  res.json({
    data: templates.map(({ id, name, description, emoji }) => ({ id, name, description, emoji })),
  })
})
