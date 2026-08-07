import type { Request, Response } from 'express'
import { cmsService } from '@/services/cms.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const getCmsContent = asyncHandler(async (_req: Request, res: Response) => {
  const content = await cmsService.getAll()
  ApiResponse.success(res, content)
})