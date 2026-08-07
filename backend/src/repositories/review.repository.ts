import { prisma } from '@/config/db'

export const reviewRepository = {
  async findApprovedByProduct(productId: string) {
    return prisma.productReview.findMany({
      where: { productId, isApproved: true, isRejected: false },
      orderBy: { createdAt: 'desc' },
    })
  },
}