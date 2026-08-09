import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '@/config/env'
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE } from '@/config/upload'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { BadRequestError } from '@/utils/httpErrors'

const MB = 1024 * 1024

export const uploadImagesController = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined

  if (!files || files.length === 0) {
    throw new BadRequestError('Aucun fichier fourni')
  }
  if (files.length > MAX_IMAGE_COUNT) {
    throw new BadRequestError(`Maximum de ${MAX_IMAGE_COUNT} images par requête`)
  }

  const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE)
  if (oversized) {
    throw new BadRequestError(
      `Fichier trop volumineux (max ${MAX_IMAGE_SIZE / MB} Mo) : ${oversized.originalname}`
    )
  }

  const urls = files.map((file) => `${env.API_PUBLIC_URL.replace(/\/$/, '')}/uploads/${file.filename}`)

  ApiResponse.success(res, { urls }, StatusCodes.CREATED)
})
