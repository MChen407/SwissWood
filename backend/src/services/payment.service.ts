import { orderRepository } from '../repositories/order.repository.js'
import { paymentRepository } from '../repositories/payment.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import { toOrderDto, type OrderDto } from '../dto/order.dto.js'
import { toPaymentDto, type PaymentDto } from '../dto/payment.dto.js'
import { BadRequestError, NotFoundError } from '../utils/httpErrors.js'
import { generateSecurityCode, hashSecurityCode, codeType } from '../utils/securityCode.js'
import { sendTransferInstructions, sendPaymentConfirmation, sendSecurityCode } from './mail.service.js'
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
    const paymentRowStatus = method === 'bank_transfer' ? ('pending' as const) : ('processing' as const)

    const { order: updatedOrder, payment } = await orderRepository.initializePayment({
      orderId: order.id,
      userId: order.userId,
      method,
      paymentStatus,
      paymentRowStatus,
      amountEur: order.totalEur,
      reference: paymentReference(),
    })

    if (method === 'bank_transfer') {
      const user = await userRepository.findById(userId)
      if (user?.email) {
        await sendTransferInstructions({
          to: user.email,
          orderNumber: updatedOrder.orderNumber,
          amountEur: updatedOrder.totalEur,
          reference: updatedOrder.orderNumber,
        })
      }
    } else {
      await this.issueSecurityCode(payment.id, userId, updatedOrder.orderNumber)
    }

    return { order: toOrderDto(updatedOrder), payment: toPaymentDto(payment) }
  },

  async issueSecurityCode(paymentId: string, userId: string, orderNumber: string): Promise<void> {
    const code = generateSecurityCode()
    const { ttlMs } = codeType()
    const expiresAt = new Date(Date.now() + ttlMs)
    await paymentRepository.setSecurityCode(paymentId, { hash: hashSecurityCode(code), expiresAt })
    const user = await userRepository.findById(userId)
    await sendSecurityCode({ to: user?.email ?? 'destinataire inconnu', orderNumber, code })
  },

  async resendCode(userId: string, orderId: string): Promise<void> {
    const order = await orderRepository.findById(orderId)
    if (!order || order.userId !== userId) {
      throw new NotFoundError('Commande introuvable')
    }
    if (order.paymentStatus === 'paid') {
      throw new BadRequestError('La commande est déjà payée')
    }
    const latest = await paymentRepository.findLatestByOrder(orderId)
    if (!latest) {
      throw new BadRequestError('Aucun paiement initialisé pour cette commande')
    }
    if (latest.method !== 'card') {
      throw new BadRequestError('Le renvoi de code ne concerne que le paiement par carte')
    }
    await this.issueSecurityCode(latest.id, userId, order.orderNumber)
  },

  async confirm(userId: string, orderId: string, code?: string): Promise<OrderDto> {
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

    if (latest.method === 'bank_transfer') {
      throw new BadRequestError('Le paiement par virement est validé par nos équipes dès réception des fonds')
    }

    const { maxAttempts } = codeType()

    if (!latest.securityCodeHash || !latest.securityCodeExpiresAt) {
      throw new BadRequestError('Aucun code de sécurité émis pour ce paiement')
    }
    if (latest.securityCodeExpiresAt.getTime() < Date.now()) {
      await paymentRepository.setStatus(latest.id, 'failed')
      await orderRepository.updatePaymentStatus(order.id, 'failed')
      throw new BadRequestError('Le code de sécurité a expiré. Veuillez demander un nouveau code.')
    }
    if (latest.securityCodeAttempts >= maxAttempts) {
      await paymentRepository.setStatus(latest.id, 'failed')
      await orderRepository.updatePaymentStatus(order.id, 'failed')
      throw new BadRequestError('Trop de tentatives. Le paiement a été bloqué.')
    }

    if (!code || hashSecurityCode(code) !== latest.securityCodeHash) {
      const attempts = latest.securityCodeAttempts + 1
      await paymentRepository.incrementCodeAttempt(latest.id)
      if (attempts >= maxAttempts) {
        await paymentRepository.setStatus(latest.id, 'failed')
        await orderRepository.updatePaymentStatus(order.id, 'failed')
      }
      throw new BadRequestError('Code de confirmation invalide')
    }

    await paymentRepository.resetSecurityCode(latest.id)
    const { order: updatedOrder } = await orderRepository.confirmPayment({
      orderId: order.id,
      paymentId: latest.id,
    })

    const user = await userRepository.findById(userId)
    if (user?.email) {
      await sendPaymentConfirmation({
        to: user.email,
        orderNumber: updatedOrder.orderNumber,
        amountEur: updatedOrder.totalEur,
      })
    }

    return toOrderDto(updatedOrder)
  },
}
