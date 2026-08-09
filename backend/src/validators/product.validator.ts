import { z } from 'zod'
import { PRODUCT_ESSENCES } from '../constants/index.js'

export const listProductsSchema = z.object({
  query: z.object({
    essence: z.enum(PRODUCT_ESSENCES).optional(),
    exclude: z.string().uuid('Identifiant invalide').optional(),
    active: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === 'true')),
    sort: z.enum(['price_asc', 'price_desc']).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
})

export const productBySlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(200),
  }),
})

export const productByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de produit invalide'),
  }),
})

export const productReviewsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de produit invalide'),
  }),
})

export type ListProductsQuery = z.infer<typeof listProductsSchema>['query']