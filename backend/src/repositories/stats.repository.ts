import { prisma } from '../config/db.js'

export const statsRepository = {
  async countOrders() {
    return prisma.order.count()
  },

  async countCustomers() {
    return prisma.user.count({ where: { role: 'customer' } })
  },

  async countActiveProducts() {
    return prisma.product.count({ where: { isActive: true } })
  },

  async revenuePaid() {
    const result = await prisma.order.aggregate({
      _sum: { totalEur: true },
      where: { paymentStatus: 'paid' },
    })
    return result._sum.totalEur ?? 0
  },
}