import { orderRepository } from '../repositories/order.repository.js'
import { productRepository } from '../repositories/product.repository.js'
import { shippingFeeService } from './shippingFee.service.js'
import { BadRequestError, NotFoundError } from '../utils/httpErrors.js'
import { customDimensionMultiplier } from '../utils/pricing.js'
import { toOrderDetailDto, toOrderDto, type OrderDetailDto, type OrderDto } from '../dto/order.dto.js'
import type { OrderPaymentStatus, OrderStatus } from '@prisma/client'

export interface OrderLineInput {
  productId: string
  quantity: number
  unit: string
  customization: Record<string, unknown>
}

export interface CreateOrderInput {
  items: OrderLineInput[]
  currency: string
  shipping_address: Record<string, unknown>
  notes?: string
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SW-${date}-${random}`
}

function weightPerUnit(product: { dimensions: unknown }, multiplier: number): number {
  const dimensions = (product.dimensions ?? {}) as Record<string, unknown>
  const weightKg =
    typeof dimensions.weight_kg === 'number'
      ? dimensions.weight_kg
      : typeof dimensions.weight_kg === 'string' && dimensions.weight_kg.trim() !== ''
        ? Number(dimensions.weight_kg)
        : 0
  return Number.isFinite(weightKg) ? weightKg * multiplier : 0
}

export const orderService = {
  async create(userId: string, input: CreateOrderInput): Promise<OrderDto> {
    const productIds = [...new Set(input.items.map((item) => item.productId))]
    const products = await productRepository.findByIds(productIds)

    if (products.length !== productIds.length) {
      throw new NotFoundError('Un ou plusieurs produits sont introuvables')
    }

    const byId = new Map(products.map((product) => [product.id, product]))
    const items = input.items.map((line) => {
      const product = byId.get(line.productId)
      if (!product || !product.isActive) {
        throw new BadRequestError(`Produit indisponible : ${line.productId}`)
      }
      if (product.stock < line.quantity) {
        throw new BadRequestError(`Stock insuffisant pour « ${product.name} »`)
      }
      const customization = (line.customization ?? {}) as Record<string, unknown>
      const multiplier = customDimensionMultiplier(
        (product.dimensions ?? {}) as Record<string, unknown>,
        customization
      )
      const unitPriceEur = Math.round(product.priceEur * multiplier)
      const unitPriceUsd = Math.round(product.priceUsd * multiplier)
      const unitPriceFcfa = Math.round(product.priceFcfa * multiplier)
      return {
        productId: product.id,
        quantity: line.quantity,
        unit: line.unit,
        unitPriceEur,
        weightKg: weightPerUnit(product, multiplier),
        customization: {
          ...customization,
          __price_usd: unitPriceUsd,
          __price_fcfa: unitPriceFcfa,
        },
      }
    })

    const subtotalEur = items.reduce((sum, item) => sum + item.unitPriceEur * item.quantity, 0)
    const shippingWeightKg = Number(
      items.reduce((sum, item) => sum + item.weightKg * item.quantity, 0).toFixed(2)
    )
    const shippingFeeEur = await shippingFeeService.getFeeForCountry(
      input.shipping_address?.country as string | undefined
    )

    const order = await orderRepository.createWithItems({
      userId,
      orderNumber: generateOrderNumber(),
      currency: input.currency,
      shippingAddress: input.shipping_address,
      notes: input.notes,
      subtotalEur,
      shippingFeeEur,
      shippingWeightKg,
      totalEur: subtotalEur + shippingFeeEur,
      items,
    })

    return toOrderDto(order)
  },

  async listMine(userId: string): Promise<OrderDto[]> {
    const orders = await orderRepository.findByUser(userId)
    return orders.map(toOrderDto)
  },

  async getMine(userId: string, id: string): Promise<OrderDetailDto> {
    const order = await orderRepository.findDetailById(id)
    if (!order || order.userId !== userId) {
      throw new NotFoundError('Commande introuvable')
    }
    return toOrderDetailDto(order)
  },

  async listAll(): Promise<OrderDto[]> {
    const orders = await orderRepository.listAll()
    return orders.map(toOrderDto)
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDto> {
    const existing = await orderRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Commande introuvable')
    }
    const order = await orderRepository.updateStatus(id, status)
    return toOrderDto(order)
  },

  async updatePaymentStatus(id: string, paymentStatus: OrderPaymentStatus): Promise<OrderDto> {
    const existing = await orderRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Commande introuvable')
    }
    const order = await orderRepository.updatePaymentStatus(id, paymentStatus)
    return toOrderDto(order)
  },
}