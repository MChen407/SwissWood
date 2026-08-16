import type { Order, OrderItem, Payment, Product } from '@prisma/client'
import type { OrderStatus, OrderPaymentStatus, PaymentMethod } from '@prisma/client'
import { toPaymentDto, type PaymentDto } from './payment.dto.js'

export interface OrderItemDto {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit: string
  unit_price_eur: number
  unit_price_usd: number
  unit_price_fcfa: number
  customization: unknown
  created_at: Date
  product?: {
    id: string
    name: string
    slug: string
    images: unknown
  }
}

export interface OrderDto {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: OrderPaymentStatus
  subtotal_eur: number
  shipping_fee_eur: number
  shipping_weight_kg: number
  total_eur: number
  currency: string
  shipping_address: unknown
  notes: string | null
  created_at: Date
  updated_at: Date
}

export interface OrderDetailDto extends OrderDto {
  items: OrderItemDto[]
  payments: PaymentDto[]
}

export function toOrderItemDto(item: OrderItem & { product?: Product }): OrderItemDto {
  const rawCustomization = (item.customization ?? {}) as Record<string, unknown>
  const customization = Object.fromEntries(
    Object.entries(rawCustomization).filter(([key]) => !key.startsWith('__'))
  )
  return {
    id: item.id,
    order_id: item.orderId,
    product_id: item.productId,
    quantity: Number(item.quantity),
    unit: item.unit,
    unit_price_eur: item.unitPriceEur,
    unit_price_usd: typeof rawCustomization.__price_usd === 'number' ? rawCustomization.__price_usd : 0,
    unit_price_fcfa: typeof rawCustomization.__price_fcfa === 'number' ? rawCustomization.__price_fcfa : 0,
    customization,
    created_at: item.createdAt,
    ...(item.product
      ? {
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            images: Array.isArray(item.product.images) ? item.product.images : [],
          },
        }
      : {}),
  }
}

export function toOrderDto(order: Order): OrderDto {
  return {
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    status: order.status,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    subtotal_eur: order.subtotalEur,
    shipping_fee_eur: order.shippingFeeEur,
    shipping_weight_kg: Number(order.shippingWeightKg),
    total_eur: order.totalEur,
    currency: order.currency,
    shipping_address: order.shippingAddress,
    notes: order.notes,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  }
}

export function toOrderDetailDto(
  order: Order & { items: (OrderItem & { product?: Product })[]; payments: Payment[] }
): OrderDetailDto {
  return {
    ...toOrderDto(order),
    items: order.items.map(toOrderItemDto),
    payments: order.payments.map(toPaymentDto),
  }
}