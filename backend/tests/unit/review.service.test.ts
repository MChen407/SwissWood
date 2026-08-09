import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/repositories/review.repository', () => ({
  reviewRepository: {
    findApprovedByProduct: vi.fn(),
    create: vi.fn(),
    findByUser: vi.fn(),
    listAll: vi.fn(),
    findById: vi.fn(),
    setModeration: vi.fn(),
  },
}))
vi.mock('../../src/repositories/product.repository', () => ({
  productRepository: { findById: vi.fn() },
}))

import { reviewService } from '../../src/services/review.service.js'
import { reviewRepository } from '../../src/repositories/review.repository.js'
import { productRepository } from '../../src/repositories/product.repository.js'
import { NotFoundError } from '../../src/utils/httpErrors.js'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rev-1',
    productId: UUID,
    userId: UUID,
    rating: 5,
    comment: 'Excellent',
    isApproved: false,
    isRejected: false,
    createdAt: new Date(),
    ...overrides,
  }
}

describe('reviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('liste les avis approuvés d’un produit actif', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({
      id: UUID,
      isActive: true,
    } as never)
    vi.mocked(reviewRepository.findApprovedByProduct).mockResolvedValue([
      makeReview({ isApproved: true }),
    ] as never)
    const reviews = await reviewService.getApprovedByProduct(UUID)
    expect(reviews).toHaveLength(1)
    expect(reviews[0]?.is_approved).toBe(true)
  })

  it('lève NotFoundError si le produit est inactif', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({
      id: UUID,
      isActive: false,
    } as never)
    await expect(reviewService.getApprovedByProduct(UUID)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('crée un avis', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue({
      id: UUID,
      isActive: true,
    } as never)
    vi.mocked(reviewRepository.create).mockResolvedValue(makeReview() as never)
    const review = await reviewService.create(UUID, { productId: UUID, rating: 4, comment: 'Bien' })
    expect(review.rating).toBe(5)
    expect(reviewRepository.create).toHaveBeenCalledWith({
      userId: UUID,
      productId: UUID,
      rating: 4,
      comment: 'Bien',
    })
  })

  it('liste mes avis', async () => {
    vi.mocked(reviewRepository.findByUser).mockResolvedValue([makeReview()] as never)
    const reviews = await reviewService.listMine(UUID)
    expect(reviews).toHaveLength(1)
    expect(reviewRepository.findByUser).toHaveBeenCalledWith(UUID)
  })

  it('approuve un avis existant', async () => {
    vi.mocked(reviewRepository.findById).mockResolvedValue(makeReview() as never)
    vi.mocked(reviewRepository.setModeration).mockResolvedValue(
      makeReview({ isApproved: true }) as never
    )
    const review = await reviewService.approve('rev-1')
    expect(review.is_approved).toBe(true)
    expect(reviewRepository.setModeration).toHaveBeenCalledWith('rev-1', {
      isApproved: true,
      isRejected: false,
    })
  })

  it('lève NotFoundError en cas d’avis inconnu', async () => {
    vi.mocked(reviewRepository.findById).mockResolvedValue(null)
    await expect(reviewService.approve('rev-1')).rejects.toBeInstanceOf(NotFoundError)
    await expect(reviewService.reject('rev-1')).rejects.toBeInstanceOf(NotFoundError)
  })
})