import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { productService } from '@/services/product.service'
import { reviewService } from '@/services/review.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query as unknown) as {
    essence?: string
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
  const product = await productService.getBySlug(req.params.slug)
  ApiResponse.success(res, product)
})

export const productReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getApprovedByProduct(req.params.id)
  ApiResponse.success(res, reviews, StatusCodes.OK)
})