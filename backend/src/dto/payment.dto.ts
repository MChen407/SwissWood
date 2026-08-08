import type { Payment } from '@prisma/client'
import type { PaymentMethod, PaymentStatus } from '@prisma/client'

export interface PaymentDto {
  id: string
  order_id: string
  user_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount_eur: number
  reference: string
  metadata: unknown
  created_at: Date
  updated_at: Date
}

export function toPaymentDto(payment: Payment): PaymentDto {
  return {
    id: payment.id,
    order_id: payment.orderId,
    user_id: payment.userId,
    method: payment.method,
    status: payment.status,
    amount_eur: payment.amountEur,
    reference: payment.reference,
    metadata: payment.metadata,
    created_at: payment.createdAt,
    updated_at: payment.updatedAt,
  }
}