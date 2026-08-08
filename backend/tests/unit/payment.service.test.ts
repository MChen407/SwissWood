import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/repositories/order.repository', () => ({
  orderRepository: {
    findById: vi.fn(),
    initializePayment: vi.fn(),
    confirmPayment: vi.fn(),
  },
}))
vi.mock('@/repositories/payment.repository', () => ({
  paymentRepository: { findLatestByOrder: vi.fn() },
}))

import { paymentService } from '@/services/payment.service'
import { orderRepository } from '@/repositories/order.repository'
import { paymentRepository } from '@/repositories/payment.repository'
import { BadRequestError, NotFoundError } from '@/utils/httpErrors'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeOrder(paymentStatus: string, userId = UUID) {
  return {
    id: UUID,
    orderNumber: 'SW-20260101-ABC123',
    userId,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus,
    subtotalEur: 5000,
    totalEur: 5000,
    currency: 'EUR',
    shippingAddress: {},
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

describe('paymentService.initialize', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initialise un paiement par carte → statut pending', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(orderRepository.initializePayment).mockResolvedValue({
      order: makeOrder('pending'),
      payment: { id: UUID, orderId: UUID, userId: UUID, method: 'card', status: 'pending', amountEur: 5000, reference: 'ref', metadata: {}, createdAt: new Date(), updatedAt: new Date() },
    } as never)

    const result = await paymentService.initialize(UUID, UUID, 'card')
    expect(result.payment.method).toBe('card')
    expect(result.order.payment_status).toBe('pending')
    expect(orderRepository.initializePayment).toHaveBeenCalledWith(
      expect.objectContaining({ orderId: UUID, paymentStatus: 'pending' })
    )
  })

  it('initialise un virement (statut awaiting_transfer)', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(orderRepository.initializePayment).mockResolvedValue({
      order: makeOrder('awaiting_transfer'),
      payment: { id: UUID, orderId: UUID, userId: UUID, method: 'bank_transfer', status: 'pending', amountEur: 5000, reference: 'ref', metadata: {}, createdAt: new Date(), updatedAt: new Date() },
    } as never)

    const result = await paymentService.initialize(UUID, UUID, 'bank_transfer')
    expect(orderRepository.initializePayment).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'bank_transfer', paymentStatus: 'awaiting_transfer' })
    )
  })

  it('lève NotFoundError si la commande n’appartient pas à l’utilisateur', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending', 'someone-else') as never)
    await expect(paymentService.initialize(UUID, UUID, 'card')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('refuse de payer une commande déjà payée', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('paid') as never)
    await expect(paymentService.initialize(UUID, UUID, 'card')).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('paymentService.confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('confirme le paiement', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue({
      id: 'pay-1',
    } as never)
    vi.mocked(orderRepository.confirmPayment).mockResolvedValue({
      order: makeOrder('paid'),
      payment: {} as never,
    } as never)

    const order = await paymentService.confirm(UUID, UUID)
    expect(order.payment_status).toBe('paid')
    expect(orderRepository.confirmPayment).toHaveBeenCalledWith({ orderId: UUID, paymentId: 'pay-1' })
  })

  it('lève BadRequestError si aucun paiement initialisé', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(null)
    await expect(paymentService.confirm(UUID, UUID)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('lève BadRequestError si la commande est déjà payée', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('paid') as never)
    await expect(paymentService.confirm(UUID, UUID)).rejects.toBeInstanceOf(BadRequestError)
  })
})