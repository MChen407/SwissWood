import type { Request, Response } from 'express'
import { cmsService } from '../services/cms.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getCmsContent = asyncHandler(async (req: Request, res: Response) => {
  const content = await cmsService.getAll(req.query.locale)
  ApiResponse.success(res, content)
})

export const updateCmsContent = asyncHandler(async (req: Request, res: Response) => {
  const content = await cmsService.updateById(req.params.id!, req.body)
  ApiResponse.success(res, content)
})