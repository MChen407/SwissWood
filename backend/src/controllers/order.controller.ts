import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { orderService } from '../services/order.service.js'
import { paymentService } from '../services/payment.service.js'
import { invoiceService } from '../services/invoice.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import type { CreateOrderDto } from '../validators/order.validator.js'

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.create(req.user!.id, req.body as CreateOrderDto)
  ApiResponse.success(res, order, StatusCodes.CREATED)
})

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.listMine(req.user!.id)
  ApiResponse.success(res, orders)
})

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getMine(req.user!.id, req.params.id!)
  ApiResponse.success(res, order)
})

export const initPayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.initialize(req.user!.id, req.params.id!, req.body.method)
  ApiResponse.success(res, result)
})

export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const code = (req.body as { code?: string } | undefined)?.code
  const order = await paymentService.confirm(req.user!.id, req.params.id!, code)
  ApiResponse.success(res, order)
})

export const resendPaymentCode = asyncHandler(async (req: Request, res: Response) => {
  await paymentService.resendCode(req.user!.id, req.params.id!)
  ApiResponse.success(res, { message: 'Un nouveau code de sécurité a été envoyé' })
})

export const adminListOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await orderService.listAll()
  ApiResponse.success(res, orders)
})

export const adminUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateStatus(req.params.id!, req.body.status)
  ApiResponse.success(res, order)
})

export const adminUpdateOrderPayment = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updatePaymentStatus(req.params.id!, req.body.payment_status)
  ApiResponse.success(res, order)
})

export const downloadInvoice = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'super_admin' || req.user!.role === 'admin'
  const order = await orderService.getByIdForInvoice(req.params.id!, req.user!.id, isAdmin)
  const pdf = await invoiceService.generateInvoicePdf(order)
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="facture-${order.order_number}.pdf"`,
    'Content-Length': pdf.length.toString()
  })
  res.send(pdf)
})