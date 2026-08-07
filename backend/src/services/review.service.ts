import { reviewRepository } from '@/repositories/review.repository'
import { productRepository } from '@/repositories/product.repository'
import { toProductReviewDto } from '@/dto/public.dto'
import { NotFoundError } from '@/utils/httpErrors'

export const reviewService = {
  async getApprovedByProduct(productId: string) {
    // Vérifie l'existence du produit pour un 404 propre
    const product = await productRepository.findById(productId)
    if (!product || !product.isActive) {
      throw new NotFoundError('Produit introuvable')
    }
    const reviews = await reviewRepository.findApprovedByProduct(productId)
    return reviews.map(toProductReviewDto)
  },
}