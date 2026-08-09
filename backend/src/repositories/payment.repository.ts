import type { PaymentStatus } from '@prisma/client'
import { prisma } from '../config/db.js'

export const paymentRepository = {
  async findLatestByOrder(orderId: string) {
    return prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findByOrder(orderId: string) {
    return prisma.payment.findMany({ where: { orderId }, orderBy: { createdAt: 'desc' } })
  },

  async setStatus(id: string, status: PaymentStatus) {
    return prisma.payment.update({ where: { id }, data: { status } })
  },

  async listAll() {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: { select: { orderNumber: true } } },
    })
  },
}