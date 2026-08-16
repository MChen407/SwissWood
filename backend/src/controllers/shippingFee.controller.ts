import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { shippingFeeService } from '../services/shippingFee.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listShippingRates = asyncHandler(async (_req: Request, res: Response) => {
  const rates = await shippingFeeService.listActiveRates()
  ApiResponse.success(res, { rates })
})

export const listAdminShippingFees = asyncHandler(async (_req: Request, res: Response) => {
  const fees = await shippingFeeService.listAll()
  ApiResponse.success(res, { fees })
})

export const upsertShippingFee = asyncHandler(async (req: Request, res: Response) => {
  const { country, fee_eur, active } = req.body
  const fee = await shippingFeeService.upsert(country, fee_eur, active)
  ApiResponse.success(res, { fee }, StatusCodes.OK)
})

export const deleteShippingFee = asyncHandler(async (req: Request, res: Response) => {
  const { country } = req.body
  await shippingFeeService.remove(country)
  ApiResponse.success(res, { deleted: country }, StatusCodes.OK)
})