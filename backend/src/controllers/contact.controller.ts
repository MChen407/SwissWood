import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { contactService } from '@/services/contact.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const sendContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const result = await contactService.send(req.body)
  ApiResponse.success(res, result, StatusCodes.CREATED)
})