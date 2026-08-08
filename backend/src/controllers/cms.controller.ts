import type { Request, Response } from 'express'
import { cmsService } from '@/services/cms.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const getCmsContent = asyncHandler(async (_req: Request, res: Response) => {
  const content = await cmsService.getAll()
  ApiResponse.success(res, content)
})

export const updateCmsContent = asyncHandler(async (req: Request, res: Response) => {
  const content = await cmsService.updateById(req.params.id, req.body)
  ApiResponse.success(res, content)
})