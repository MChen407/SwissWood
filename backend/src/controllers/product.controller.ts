import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminProductService, productService } from '../services/product.service.js'
import { reviewService } from '../services/review.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import type { AdminProductInput } from '../services/product.service.js'

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query as unknown) as {
    essence?: string
    group?: string
    exclude?: string
    active?: boolean | undefined
    sort?: string
    limit?: number
    offset?: number
  }
  const result = await productService.list(query)
  ApiResponse.success(res, result)
})

export const featuredProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 6)
  const items = await productService.featured(limit)
  ApiResponse.success(res, items)
})

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getBySlug(req.params.slug!)
  ApiResponse.success(res, product)
})

export const productReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getApprovedByProduct(req.params.id!)
  ApiResponse.success(res, reviews, StatusCodes.OK)
})

export const adminListProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await adminProductService.listAll()
  ApiResponse.success(res, products)
})

export const adminCreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminProductService.create(req.body as AdminProductInput)
  ApiResponse.success(res, product, StatusCodes.CREATED)
})

export const adminUpdateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminProductService.update(req.params.id!, req.body as Partial<AdminProductInput>)
  ApiResponse.success(res, product)
})

export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await adminProductService.remove(req.params.id!)
  ApiResponse.success(res, null)
})