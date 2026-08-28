import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminProductService, productService } from '../services/product.service.js'
import { reviewService } from '../services/review.service.js'
import { deeplService } from '../services/deepl.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { BadRequestError } from '../utils/httpErrors.js'
import type { AdminProductInput } from '../services/product.service.js'
import { normalizeLocale } from '../dto/public.dto.js'

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
  const items = await productService.featured(limit, req.query.locale)
  ApiResponse.success(res, items)
})

export const homeSelection = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.homeSelection(req.query.locale)
  ApiResponse.success(res, result)
})

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getBySlug(req.params.slug!, req.query.locale)
  ApiResponse.success(res, product)
})

export const productReviews = asyncHandler(async (req: Request, res: Response) => {
  const locale = normalizeLocale(req.query.locale)
  const reviews = await reviewService.getApprovedByProduct(req.params.id!, locale)
  ApiResponse.success(res, reviews, StatusCodes.OK)
})

export const adminListProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await adminProductService.listAll(req.user!)
  ApiResponse.success(res, products)
})

export const adminCreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminProductService.create(req.body as AdminProductInput, req.user!.id)
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

export const adminTranslateAll = asyncHandler(async (req: Request, res: Response) => {
  const force = (req.body as { force?: unknown })?.force === true
  if (!deeplService.isConfigured()) {
    throw new BadRequestError('La clé DEEPL_API_KEY n\'est pas configurée côté serveur.')
  }
  const productsResult = await adminProductService.translateAllMissing(force)

  let reviewsResult: { translated: number; skipped: number; failed: number; lastError: string | undefined } = { translated: 0, skipped: 0, failed: 0, lastError: undefined }
  try {
    reviewsResult = await reviewService.translateAllMissing(force) as typeof reviewsResult
  } catch (err) {
    reviewsResult.failed += 1
    reviewsResult.lastError = err instanceof Error ? err.message : String(err)
    console.error('[DeepL] review batch translation failed:', err)
  }

  const result = {
    translated: productsResult.translated + reviewsResult.translated,
    skipped: productsResult.skipped + reviewsResult.skipped,
    failed: productsResult.failed + reviewsResult.failed,
    lastError: productsResult.lastError ?? reviewsResult.lastError,
    products: productsResult,
    reviews: reviewsResult,
  }

  ApiResponse.success(res, result)
})