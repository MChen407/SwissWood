import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE } from '../config/upload.js'
import { deleteImage, storeImageFiles } from '../services/media.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { BadRequestError } from '../utils/httpErrors.js'

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

  const images = await storeImageFiles(files)

  ApiResponse.success(
    res,
    { urls: images.map((image) => image.url), publicIds: images.map((image) => image.publicId) },
    StatusCodes.CREATED
  )
})

export const deleteImageController = asyncHandler(async (req: Request, res: Response) => {
  const publicId = (req.params as Record<string, string | undefined>)['0']

  if (!publicId) {
    throw new BadRequestError('publicId manquant')
  }

  await deleteImage(publicId)

  ApiResponse.success(res, { deleted: publicId }, StatusCodes.OK)
})
