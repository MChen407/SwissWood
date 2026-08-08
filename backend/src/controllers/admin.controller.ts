import type { Request, Response } from 'express'
import { adminService } from '@/services/admin.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.stats()
  ApiResponse.success(res, stats)
})

export const listPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await adminService.listPayments()
  ApiResponse.success(res, payments)
})

export const listClients = asyncHandler(async (_req: Request, res: Response) => {
  const clients = await adminService.listClients()
  ApiResponse.success(res, clients)
})

export const updateClientRole = asyncHandler(async (req: Request, res: Response) => {
  const client = await adminService.updateRole(req.params.id, req.body.role)
  ApiResponse.success(res, client)
})