import { prisma } from '@/config/db'

export const favoriteRepository = {
  async findByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    })
  },

  async findOne(userId: string, productId: string) {
    return prisma.favorite.findFirst({ where: { userId, productId } })
  },

  async upsert(userId: string, productId: string) {
    return prisma.favorite.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    })
  },

  async remove(userId: string, productId: string) {
    return prisma.favorite.deleteMany({ where: { userId, productId } })
  },

  async countByUser(userId: string) {
    return prisma.favorite.count({ where: { userId } })
  },
}