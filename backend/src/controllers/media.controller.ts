import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { findMediaById } from '../services/media.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { NotFoundError } from '../utils/httpErrors.js'

export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  const media = await findMediaById(req.params.id!)

  if (!media) {
    throw new NotFoundError('Média introuvable')
  }

  res.set({
    'Content-Type': media.mimetype,
    'Content-Length': String(media.size),
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  res.status(StatusCodes.OK).send(media.data)
})
