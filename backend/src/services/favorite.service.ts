import { favoriteRepository } from '../repositories/favorite.repository.js'
import { productRepository } from '../repositories/product.repository.js'
import { toFavoriteItemDto, type FavoriteItemDto } from '../dto/favorite.dto.js'
import { toProductDto, normalizeLocale } from '../dto/public.dto.js'
import { NotFoundError } from '../utils/httpErrors.js'

export const favoriteService = {
  async listForUser(userId: string, locale?: unknown): Promise<FavoriteItemDto[]> {
    const favorites = await favoriteRepository.findByUser(userId)
    const loc = normalizeLocale(locale)
    return favorites.map((f) => (f.product ? { ...toFavoriteItemDto(f), product: toProductDto(f.product, loc) } : toFavoriteItemDto(f)))
  },

  async add(userId: string, productId: string, locale?: unknown): Promise<FavoriteItemDto> {
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
      product: toProductDto(product, normalizeLocale(locale)),
    }
  },

  async remove(userId: string, productId: string): Promise<void> {
    await favoriteRepository.remove(userId, productId)
  },

  async countForUser(userId: string): Promise<number> {
    return favoriteRepository.countByUser(userId)
  },
}