import { z } from 'zod'

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Identifiant de produit invalide'),
    rating: z.number().int().min(1).max(5, 'La note doit être comprise entre 1 et 5'),
    comment: z.string().trim().min(1).max(2000).optional(),
  }),
})

export const reviewParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant d’avis invalide'),
  }),
})

export type CreateReviewDto = z.infer<typeof createReviewSchema>['body']