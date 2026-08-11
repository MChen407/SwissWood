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

  async setSecurityCode(id: string, code: { hash: string; expiresAt: Date }) {
    return prisma.payment.update({
      where: { id },
      data: { securityCodeHash: code.hash, securityCodeExpiresAt: code.expiresAt, securityCodeAttempts: 0 },
    })
  },

  async incrementCodeAttempt(id: string) {
    return prisma.payment.update({
      where: { id },
      data: { securityCodeAttempts: { increment: 1 } },
    })
  },

  async resetSecurityCode(id: string) {
    return prisma.payment.update({
      where: { id },
      data: { securityCodeHash: null, securityCodeExpiresAt: null, securityCodeAttempts: 0 },
    })
  },

  async listAll() {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: { select: { orderNumber: true } } },
    })
  },
}