import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { reviewService } from '@/services/review.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import type { CreateReviewDto } from '@/validators/review.validator'

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.create(req.user!.id, req.body as CreateReviewDto)
  ApiResponse.success(res, review, StatusCodes.CREATED)
})

export const listMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.listMine(req.user!.id)
  ApiResponse.success(res, reviews)
})

export const listAllReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await reviewService.listAll()
  ApiResponse.success(res, reviews)
})

export const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.approve(req.params.id)
  ApiResponse.success(res, review)
})

export const rejectReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.reject(req.params.id)
  ApiResponse.success(res, review)
})