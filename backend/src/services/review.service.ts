import { reviewRepository } from '../repositories/review.repository.js'
import { productRepository } from '../repositories/product.repository.js'
import { toProductReviewDto } from '../dto/public.dto.js'
import { NotFoundError } from '../utils/httpErrors.js'

export interface CreateReviewInput {
  productId: string
  rating: number
  comment?: string
}

interface ReviewAuthor {
  id: string
  firstName: string
  lastName: string
}

function toReviewAuthor(user: ReviewAuthor) {
  return { id: user.id, first_name: user.firstName, last_name: user.lastName }
}

export const reviewService = {
  async getApprovedByProduct(productId: string) {
    const product = await productRepository.findById(productId)
    if (!product || !product.isActive) {
      throw new NotFoundError('Produit introuvable')
    }
    const reviews = await reviewRepository.findApprovedByProduct(productId)
    return reviews.map((review) => ({
      ...toProductReviewDto(review),
      user: toReviewAuthor(review.user),
    }))
  },

  async listLatestApproved(limit: number) {
    const reviews = await reviewRepository.findLatestApproved(limit)
    return reviews.map((review) => ({
      ...toProductReviewDto(review),
      product: review.product,
      user: toReviewAuthor(review.user),
    }))
  },

  async create(userId: string, input: CreateReviewInput) {
    const product = await productRepository.findById(input.productId)
    if (!product || !product.isActive) {
      throw new NotFoundError('Produit introuvable')
    }
    const review = await reviewRepository.create({
      userId,
      productId: input.productId,
      rating: input.rating,
      comment: input.comment,
    })
    return toProductReviewDto(review)
  },

  async listMine(userId: string) {
    const reviews = await reviewRepository.findByUser(userId)
    return reviews.map(toProductReviewDto)
  },

  async listAll() {
    const reviews = await reviewRepository.listAll()
    return reviews.map((review) => ({
      ...toProductReviewDto(review),
      product: review.product,
      user: toReviewAuthor(review.user),
    }))
  },

  async approve(id: string) {
    const existing = await reviewRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Avis introuvable')
    }
    const review = await reviewRepository.setModeration(id, { isApproved: true, isRejected: false })
    return toProductReviewDto(review)
  },

  async reject(id: string) {
    const existing = await reviewRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Avis introuvable')
    }
    const review = await reviewRepository.setModeration(id, { isApproved: false, isRejected: true })
    return toProductReviewDto(review)
  },
}