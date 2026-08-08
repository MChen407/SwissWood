import type { Favorite, Product } from '@prisma/client'
import { toProductDto, type ProductDto } from '@/dto/public.dto'

export interface FavoriteItemDto {
  id: string
  user_id: string
  product_id: string
  created_at: Date
  product: ProductDto
}

export function toFavoriteItemDto(favorite: Favorite & { product?: Product }): FavoriteItemDto {
  return {
    id: favorite.id,
    user_id: favorite.userId,
    product_id: favorite.productId,
    created_at: favorite.createdAt,
    product: favorite.product ? toProductDto(favorite.product) : ({} as ProductDto),
  }
}