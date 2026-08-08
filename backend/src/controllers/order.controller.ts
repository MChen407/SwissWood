import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderService } from '@/services/order.service'
import { paymentService } from '@/services/payment.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import type { CreateOrderDto } from '@/validators/order.validator'

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.create(req.user!.id, req.body as CreateOrderDto)
  ApiResponse.success(res, order, StatusCodes.CREATED)
})

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.listMine(req.user!.id)
  ApiResponse.success(res, orders)
})

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getMine(req.user!.id, req.params.id)
  ApiResponse.success(res, order)
})

export const initPayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.initialize(req.user!.id, req.params.id, req.body.method)
  ApiResponse.success(res, result)
})

export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const order = await paymentService.confirm(req.user!.id, req.params.id)
  ApiResponse.success(res, order)
})

export const adminListOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await orderService.listAll()
  ApiResponse.success(res, orders)
})

export const adminUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status)
  ApiResponse.success(res, order)
})

export const adminUpdateOrderPayment = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updatePaymentStatus(req.params.id, req.body.payment_status)
  ApiResponse.success(res, order)
})