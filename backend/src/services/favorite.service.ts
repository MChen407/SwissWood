import { favoriteRepository } from '@/repositories/favorite.repository'
import { productRepository } from '@/repositories/product.repository'
import { toFavoriteItemDto, type FavoriteItemDto } from '@/dto/favorite.dto'
import { toProductDto } from '@/dto/public.dto'
import { NotFoundError } from '@/utils/httpErrors'

export const favoriteService = {
  async listForUser(userId: string): Promise<FavoriteItemDto[]> {
    const favorites = await favoriteRepository.findByUser(userId)
    return favorites.map(toFavoriteItemDto)
  },

  async add(userId: string, productId: string): Promise<FavoriteItemDto> {
    const product = await productRepository.findById(productId)
    if (!product) {
      throw new NotFoundError('Produit introuvable')
    }
    const favorite = await favoriteRepository.upsert(userId, productId)
    return {
      id: favorite.id,
      user_id: favorite.userId,
      product_id: favorite.productId,
      created_at: favorite.createdAt,
      product: toProductDto(product),
    }
  },

  async remove(userId: string, productId: string): Promise<void> {
    await favoriteRepository.remove(userId, productId)
  },

  async countForUser(userId: string): Promise<number> {
    return favoriteRepository.countByUser(userId)
  },
}