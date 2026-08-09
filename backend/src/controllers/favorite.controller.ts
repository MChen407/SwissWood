import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { favoriteService } from '../services/favorite.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favorites = await favoriteService.listForUser(req.user!.id)
  ApiResponse.success(res, favorites)
})

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const favorite = await favoriteService.add(req.user!.id, req.params.productId!)
  ApiResponse.success(res, favorite, StatusCodes.CREATED)
})

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  await favoriteService.remove(req.user!.id, req.params.productId!)
  ApiResponse.success(res, null)
})