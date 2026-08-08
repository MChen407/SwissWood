import { z } from 'zod'

export const favoriteParamsSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Identifiant de produit invalide'),
  }),
})

export type FavoriteParamsDto = z.infer<typeof favoriteParamsSchema>['params']