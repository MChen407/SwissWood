import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { favoriteService } from '@/services/favorite.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favorites = await favoriteService.listForUser(req.user!.id)
  ApiResponse.success(res, favorites)
})

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const favorite = await favoriteService.add(req.user!.id, req.params.productId)
  ApiResponse.success(res, favorite, StatusCodes.CREATED)
})

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  await favoriteService.remove(req.user!.id, req.params.productId)
  ApiResponse.success(res, null)
})