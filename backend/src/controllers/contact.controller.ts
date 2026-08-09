import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { contactService } from '../services/contact.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const sendContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const result = await contactService.send(req.body)
  ApiResponse.success(res, result, StatusCodes.CREATED)
})