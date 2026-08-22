import { prisma } from '../config/db.js'

export const statsRepository = {
  async countOrders(userId?: string) {
    return prisma.order.count({ where: userId ? { userId } : {} })
  },

  async countCustomers() {
    return prisma.user.count({ where: { role: 'customer' } })
  },

  async countActiveProducts() {
    return prisma.product.count({ where: { isActive: true } })
  },

  async revenuePaid(userId?: string) {
    const result = await prisma.order.aggregate({
      _sum: { totalEur: true },
      where: { paymentStatus: 'paid', ...(userId ? { userId } : {}) },
    })
    return result._sum.totalEur ?? 0
  },
}