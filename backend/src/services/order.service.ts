import { orderRepository } from '../repositories/order.repository.js'
import { productRepository } from '../repositories/product.repository.js'
import { BadRequestError, NotFoundError } from '../utils/httpErrors.js'
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
      return {
        productId: product.id,
        quantity: line.quantity,
        unit: line.unit,
        unitPriceEur: product.priceEur,
        customization: line.customization ?? {},
      }
    })

    const subtotalEur = items.reduce((sum, item) => sum + item.unitPriceEur * item.quantity, 0)

    const order = await orderRepository.createWithItems({
      userId,
      orderNumber: generateOrderNumber(),
      currency: input.currency,
      shippingAddress: input.shipping_address,
      notes: input.notes,
      subtotalEur,
      totalEur: subtotalEur,
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