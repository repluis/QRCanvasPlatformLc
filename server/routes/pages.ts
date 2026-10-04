import { randomUUID } from 'node:crypto'
import { Router, type Request } from 'express'
import type { Page, Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler, HttpError } from '../lib/http.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { findTemplate } from '../templates/index.js'
import { config } from '../config.js'

export const pagesRouter = Router()

const DEFAULT_CANVAS = { width: 800, height: 600, visible: true }

const elementSchema = z.object({ id: z.string(), type: z.string() }).passthrough()

const canvasSchema = z.object({
  elements: z.array(elementSchema).default([]),
  background: z.string().default('#ffffff'),
  width: z.number().int().min(100).max(2000).default(DEFAULT_CANVAS.width),
  height: z.number().int().min(100).max(2000).default(DEFAULT_CANVAS.height),
  visible: z.boolean().default(true),
})

const savePageSchema = z.object({
  title: z.string().trim().min(1).max(255).default('My page'),
  canvases: z.array(canvasSchema).min(1).max(50),
})

type Canvas = z.infer<typeof canvasSchema>

/** Pages saved before multi-card support only have `elements` + `background`. */
function canvasesOf(page: Page): Canvas[] {
  const canvases = page.canvases as Canvas[] | null
  if (Array.isArray(canvases) && canvases.length > 0) return canvases
  return [{
    elements: (page.elements as Canvas['elements']) ?? [],
    background: page.background,
    ...DEFAULT_CANVAS,
  }]
}

function serializePage(page: Page) {
  return {
    id: page.id,
    uuid: page.uuid,
    title: page.title,
    slug: page.slug,
    status: page.status,
    updatedAt: page.updatedAt,
    canvases: canvasesOf(page),
  }
}

function toJson(canvases: Canvas[]) {
  return canvases as unknown as Prisma.InputJsonValue
}

function publicOrigin(req: Request) {
  return config.appUrl || req.get('origin') || `${req.protocol}://${req.get('host')}`
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Malformed uuids would make Postgres throw, so treat them as not found. */
async function findByUuid(uuid: unknown) {
  return typeof uuid === 'string' && UUID_RE.test(uuid)
    ? prisma.page.findUnique({ where: { uuid } })
    : null
}

async function findOwnedPage(id: number, userId: number) {
  const page = Number.isInteger(id) ? await prisma.page.findUnique({ where: { id } }) : null
  if (!page || page.userId !== userId) {
    throw new HttpError(404, 'Page not found')
  }
  return page
}

// Public view — only active pages are visible
pagesRouter.get('/public/:uuid', asyncHandler(async (req, res) => {
  const page = await findByUuid(req.params.uuid)
  if (!page || !page.status) {
    throw new HttpError(404, 'Page not found')
  }
  res.json({ data: serializePage(page) })
}))

pagesRouter.use(requireAuth)

pagesRouter.get('/', asyncHandler<AuthRequest>(async (req, res) => {
  const pages = await prisma.page.findMany({
    where: { userId: req.user!.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, uuid: true, title: true, slug: true, status: true, updatedAt: true },
  })
  res.json({ data: pages })
}))

pagesRouter.get('/:uuid', asyncHandler<AuthRequest>(async (req, res) => {
  const page = await findByUuid(req.params.uuid)
  if (!page || page.userId !== req.user!.id) {
    throw new HttpError(404, 'Page not found')
  }
  res.json({ data: serializePage(page) })
}))

pagesRouter.post('/', asyncHandler<AuthRequest>(async (req, res) => {
  const data = savePageSchema.parse(req.body)
  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug: `page-${randomUUID()}`,
      canvases: toJson(data.canvases),
      background: data.canvases[0].background,
      userId: req.user!.id,
    },
  })
  res.status(201).json({ data: serializePage(page) })
}))

pagesRouter.put('/:id', asyncHandler<AuthRequest>(async (req, res) => {
  const page = await findOwnedPage(Number(req.params.id), req.user!.id)
  const data = savePageSchema.parse(req.body)
  const updated = await prisma.page.update({
    where: { id: page.id },
    data: {
      title: data.title,
      canvases: toJson(data.canvases),
      background: data.canvases[0].background,
    },
  })
  res.json({ data: serializePage(updated) })
}))

pagesRouter.delete('/:id', asyncHandler<AuthRequest>(async (req, res) => {
  const page = await findOwnedPage(Number(req.params.id), req.user!.id)
  await prisma.page.delete({ where: { id: page.id } })
  res.status(204).end()
}))

pagesRouter.post('/:id/toggle-status', asyncHandler<AuthRequest>(async (req, res) => {
  const page = await findOwnedPage(Number(req.params.id), req.user!.id)
  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { status: !page.status },
  })
  res.json({ data: serializePage(updated) })
}))

/**
 * Instantiates a template. The first (hidden) card gets a QR pointing to the
 * new page, so the uuid is generated up front instead of saving twice.
 */
pagesRouter.post('/from-template/:templateId', asyncHandler<AuthRequest>(async (req, res) => {
  const template = findTemplate(String(req.params.templateId))
  if (!template) {
    throw new HttpError(404, 'Template not found')
  }

  const uuid = randomUUID()
  const canvases = structuredClone(template.canvases) as Canvas[]
  canvases[0].elements = [{
    id: `qr-${uuid}`,
    type: 'qr',
    x: 100, y: 100, width: 200, height: 200,
    content: `${publicOrigin(req)}/page?uuid=${uuid}`,
    foregroundColor: '#be185d',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'medium',
  }]

  const page = await prisma.page.create({
    data: {
      uuid,
      title: template.defaultTitle,
      slug: `${template.id}-${uuid}`,
      canvases: toJson(canvases),
      background: canvases[0].background,
      userId: req.user!.id,
    },
  })
  res.status(201).json({ data: serializePage(page) })
}))
