import { prisma } from '@/config/db'

export interface CreateReviewData {
  userId: string
  productId: string
  rating: number
  comment?: string
}

export const reviewRepository = {
  async findApprovedByProduct(productId: string) {
    return prisma.productReview.findMany({
      where: { productId, isApproved: true, isRejected: false },
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(data: CreateReviewData) {
    return prisma.productReview.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment ?? '',
      },
    })
  },

  async findByUser(userId: string) {
    return prisma.productReview.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },

  async listAll() {
    return prisma.productReview.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { id: true, name: true, slug: true } } },
    })
  },

  async findById(id: string) {
    return prisma.productReview.findUnique({ where: { id } })
  },

  async setModeration(id: string, moderation: { isApproved: boolean; isRejected: boolean }) {
    return prisma.productReview.update({ where: { id }, data: moderation })
  },
}