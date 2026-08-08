import { orderRepository } from '@/repositories/order.repository'
import { paymentRepository } from '@/repositories/payment.repository'
import { toOrderDto, type OrderDto } from '@/dto/order.dto'
import { toPaymentDto, type PaymentDto } from '@/dto/payment.dto'
import { BadRequestError, NotFoundError } from '@/utils/httpErrors'
import type { OrderPaymentStatus, PaymentMethod } from '@prisma/client'

function paymentReference(): string {
  return `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export interface InitializePaymentResult {
  order: OrderDto
  payment: PaymentDto
}

export const paymentService = {
  async initialize(userId: string, orderId: string, method: PaymentMethod): Promise<InitializePaymentResult> {
    const order = await orderRepository.findById(orderId)
    if (!order || order.userId !== userId) {
      throw new NotFoundError('Commande introuvable')
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestError('Cette commande a déjà été payée')
    }
    if (order.paymentStatus === 'awaiting_transfer') {
      throw new BadRequestError('Un paiement est déjà en attente de virement')
    }

    const paymentStatus: OrderPaymentStatus = method === 'bank_transfer' ? 'awaiting_transfer' : 'pending'
    const { order: updatedOrder, payment } = await orderRepository.initializePayment({
      orderId: order.id,
      userId: order.userId,
      method,
      paymentStatus,
      amountEur: order.totalEur,
      reference: paymentReference(),
    })

    return { order: toOrderDto(updatedOrder), payment: toPaymentDto(payment) }
  },

  async confirm(userId: string, orderId: string): Promise<OrderDto> {
    const order = await orderRepository.findById(orderId)
    if (!order || order.userId !== userId) {
      throw new NotFoundError('Commande introuvable')
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestError('La commande est déjà confirmée')
    }

    const latest = await paymentRepository.findLatestByOrder(orderId)
    if (!latest) {
      throw new BadRequestError('Aucun paiement initialisé pour cette commande')
    }

    const { order: updatedOrder } = await orderRepository.confirmPayment({
      orderId: order.id,
      paymentId: latest.id,
    })
    return toOrderDto(updatedOrder)
  },
}