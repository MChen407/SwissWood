import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/repositories/order.repository', () => ({
  orderRepository: {
    createWithItems: vi.fn(),
    findByUser: vi.fn(),
    findDetailById: vi.fn(),
    findById: vi.fn(),
    listAll: vi.fn(),
    updateStatus: vi.fn(),
    updatePaymentStatus: vi.fn(),
    initializePayment: vi.fn(),
    confirmPayment: vi.fn(),
  },
}))
vi.mock('@/repositories/product.repository', () => ({
  productRepository: {
    findByIds: vi.fn(),
  },
}))

import { orderService } from '@/services/order.service'
import { orderRepository } from '@/repositories/order.repository'
import { productRepository } from '@/repositories/product.repository'
import { BadRequestError, NotFoundError } from '@/utils/httpErrors'
import type { OrderStatus, Product } from '@prisma/client'
import type { OrderDto } from '@/dto/order.dto'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: UUID,
    name: 'Chêne premium',
    slug: 'chene-premium',
    essence: 'Teck',
    description: '',
    priceEur: 10000,
    priceUsd: 12000,
    priceFcfa: 60000,
    stock: 10,
    dimensions: {},
    images: [],
    characteristics: {},
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  } as Product
}

function makeOrder(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: UUID,
    orderNumber: 'SW-20260101-ABC123',
    userId: UUID,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    subtotalEur: 20000,
    totalEur: 20000,
    currency: 'EUR',
    shippingAddress: {},
    notes: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

describe('orderService.create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crée une commande en recalculant les prix depuis la base', async () => {
    vi.mocked(productRepository.findByIds).mockResolvedValue([makeProduct()])
    vi.mocked(orderRepository.createWithItems).mockResolvedValue(makeOrder() as never)

    const order: OrderDto = await orderService.create('user-1', {
      items: [{ productId: UUID, quantity: 2, unit: 'pcs', customization: {} }],
      currency: 'EUR',
      shipping_address: { city: 'Genève' },
    })

    expect(order.total_eur).toBe(20000)
    expect(orderRepository.createWithItems).toHaveBeenCalledWith(
      expect.objectContaining({ subtotalEur: 20000, totalEur: 20000, userId: 'user-1' })
    )
    expect(order.order_number).toBe('SW-20260101-ABC123')
  })

  it('lève NotFoundError si un produit est introuvable', async () => {
    const otherId = '22222222-2222-2222-2222-222222222222'
    vi.mocked(productRepository.findByIds).mockResolvedValue([makeProduct()])
    await expect(
      orderService.create('user-1', {
        items: [
          { productId: UUID, quantity: 1, unit: 'pcs', customization: {} },
          { productId: otherId, quantity: 1, unit: 'pcs', customization: {} },
        ],
        currency: 'EUR',
        shipping_address: {},
      })
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('lève BadRequestError si le produit est inactif', async () => {
    const inactive = makeProduct({ isActive: false })
    vi.mocked(productRepository.findByIds).mockResolvedValue([inactive])
    await expect(
      orderService.create('user-1', {
        items: [{ productId: UUID, quantity: 1, unit: 'pcs', customization: {} }],
        currency: 'EUR',
        shipping_address: {},
      })
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('lève BadRequestError en cas de stock insuffisant', async () => {
    vi.mocked(productRepository.findByIds).mockResolvedValue([makeProduct({ stock: 1 })])
    await expect(
      orderService.create('user-1', {
        items: [{ productId: UUID, quantity: 5, unit: 'pcs', customization: {} }],
        currency: 'EUR',
        shipping_address: {},
      })
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('orderService.listMine / getMine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('liste les commandes de l’utilisateur', async () => {
    vi.mocked(orderRepository.findByUser).mockResolvedValue([makeOrder()] as never)
    const orders = await orderService.listMine('user-1')
    expect(orderRepository.findByUser).toHaveBeenCalledWith('user-1')
    expect(orders).toHaveLength(1)
    expect(orders[0]?.user_id).toBe(UUID)
  })

  it('renvoie le détail si la commande appartient à l’utilisateur', async () => {
    vi.mocked(orderRepository.findDetailById).mockResolvedValue({
      ...makeOrder(),
      items: [],
      payments: [],
    } as never)
    const detail = await orderService.getMine(UUID, 'order-1')
    expect(detail.id).toBe(UUID)
  })

  it('masque les commandes d’un autre utilisateur (404)', async () => {
    vi.mocked(orderRepository.findDetailById).mockResolvedValue({
      ...makeOrder(),
      userId: 'other-user',
      items: [],
      payments: [],
    } as never)
    await expect(orderService.getMine('victime', 'order-1')).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe('orderService.updateStatus / updatePaymentStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('met à jour le statut', async () => {
    const updated = makeOrder({ status: 'shipped' as OrderStatus })
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder() as never)
    vi.mocked(orderRepository.updateStatus).mockResolvedValue(updated as never)

    const order = await orderService.updateStatus(UUID, 'shipped')
    expect(order.status).toBe('shipped')
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(UUID, 'shipped')
  })

  it('lève NotFoundError si la commande n’existe pas', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(null)
    await expect(orderService.updateStatus(UUID, 'shipped')).rejects.toBeInstanceOf(NotFoundError)
  })
})