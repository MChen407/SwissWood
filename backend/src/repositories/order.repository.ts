import { Prisma, type OrderStatus, type OrderPaymentStatus, type PaymentMethod } from '@prisma/client'
import { prisma } from '@/config/db'

export interface CreateOrderItemData {
  productId: string
  quantity: number
  unit: string
  unitPriceEur: number
  customization: unknown
}

export interface CreateOrderData {
  userId: string
  orderNumber: string
  currency: string
  shippingAddress: unknown
  notes?: string
  subtotalEur: number
  totalEur: number
  items: CreateOrderItemData[]
}

export const orderRepository = {
  async createWithItems(data: CreateOrderData) {
    return prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          orderNumber: data.orderNumber,
          userId: data.userId,
          paymentMethod: 'card',
          paymentStatus: 'pending',
          currency: data.currency,
          shippingAddress: (data.shippingAddress ?? {}) as Prisma.InputJsonValue,
          notes: data.notes,
          subtotalEur: data.subtotalEur,
          totalEur: data.totalEur,
          orderItems: {
            createMany: {
              data: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unit: item.unit,
                unitPriceEur: item.unitPriceEur,
                customization: (item.customization ?? {}) as Prisma.InputJsonValue,
              })),
            },
          },
        },
      })
    })
  },

  async findById(id: string) {
    return prisma.order.findUnique({ where: { id } })
  },

  async findByUser(userId: string) {
    return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },

  async findDetailById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payments: true },
    })
  },

  async listAll({ skip, take }: { skip?: number; take?: number } = {}) {
    return prisma.order.findMany({ orderBy: { createdAt: 'desc' }, skip, take })
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } })
  },

  async updatePaymentStatus(id: string, paymentStatus: OrderPaymentStatus) {
    return prisma.order.update({ where: { id }, data: { paymentStatus } })
  },

  async initializePayment(input: {
    orderId: string
    userId: string
    method: PaymentMethod
    paymentStatus: OrderPaymentStatus
    amountEur: number
    reference: string
  }) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId: input.orderId,
          userId: input.userId,
          method: input.method,
          status: 'pending',
          amountEur: input.amountEur,
          reference: input.reference,
        },
      })
      const order = await tx.order.update({
        where: { id: input.orderId },
        data: { paymentMethod: input.method, paymentStatus: input.paymentStatus },
      })
      return { order, payment }
    })
  },

  async confirmPayment(input: { orderId: string; paymentId: string }) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: input.paymentId },
        data: { status: 'completed' },
      })
      const order = await tx.order.update({
        where: { id: input.orderId },
        data: { paymentStatus: 'paid', status: 'confirmed' },
      })
      return { order, payment }
    })
  },
}