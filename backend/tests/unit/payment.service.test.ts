import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/repositories/order.repository', () => ({
  orderRepository: {
    findById: vi.fn(),
    initializePayment: vi.fn(),
    confirmPayment: vi.fn(),
    updatePaymentStatus: vi.fn(),
  },
}))
vi.mock('../../src/repositories/payment.repository', () => ({
  paymentRepository: {
    findLatestByOrder: vi.fn(),
    setStatus: vi.fn(),
    setSecurityCode: vi.fn(),
    incrementCodeAttempt: vi.fn(),
    resetSecurityCode: vi.fn(),
  },
}))
vi.mock('../../src/repositories/user.repository', () => ({
  userRepository: { findById: vi.fn() },
}))
vi.mock('../../src/services/mail.service', () => ({
  sendTransferInstructions: vi.fn(),
  sendPaymentConfirmation: vi.fn(),
  sendSecurityCode: vi.fn(),
}))

import { paymentService } from '../../src/services/payment.service.js'
import { orderRepository } from '../../src/repositories/order.repository.js'
import { paymentRepository } from '../../src/repositories/payment.repository.js'
import { userRepository } from '../../src/repositories/user.repository.js'
import { sendTransferInstructions, sendPaymentConfirmation, sendSecurityCode } from '../../src/services/mail.service.js'
import { hashSecurityCode } from '../../src/utils/securityCode.js'
import { BadRequestError, NotFoundError } from '../../src/utils/httpErrors.js'

const UUID = '11111111-1111-1111-1111-111111111111'
const CODE = '123456'
const CODE_HASH = hashSecurityCode(CODE)

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

function makePayment(overrides: Record<string, unknown> = {}) {
  return {
    id: 'pay-1',
    orderId: UUID,
    userId: UUID,
    method: 'card',
    status: 'processing',
    amountEur: 5000,
    reference: 'ref',
    metadata: {},
    securityCodeHash: CODE_HASH,
    securityCodeExpiresAt: new Date(Date.now() + 60_000),
    securityCodeAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('paymentService.initialize', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initialise un paiement par carte → statut pending + émission du code de sécurité', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(orderRepository.initializePayment).mockResolvedValue({
      order: makeOrder('pending'),
      payment: makePayment(),
    } as never)
    vi.mocked(userRepository.findById).mockResolvedValue({ id: UUID, email: 'client@test.ch' } as never)

    const result = await paymentService.initialize(UUID, UUID, 'card')
    expect(result.payment.method).toBe('card')
    expect(orderRepository.initializePayment).toHaveBeenCalledWith(
      expect.objectContaining({ paymentStatus: 'pending', paymentRowStatus: 'processing' })
    )
    expect(paymentRepository.setSecurityCode).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ hash: expect.any(String), expiresAt: expect.any(Date) })
    )
    expect(sendSecurityCode).toHaveBeenCalledWith(expect.objectContaining({ code: expect.stringMatching(/^\d{6}$/) }))
  })

  it('initialise un virement → statut awaiting_transfer + e-mail d’instructions', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(orderRepository.initializePayment).mockResolvedValue({
      order: makeOrder('awaiting_transfer'),
      payment: makePayment({ method: 'bank_transfer' }),
    } as never)
    vi.mocked(userRepository.findById).mockResolvedValue({ id: UUID, email: 'client@test.ch' } as never)

    const result = await paymentService.initialize(UUID, UUID, 'bank_transfer')
    expect(orderRepository.initializePayment).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'bank_transfer', paymentStatus: 'awaiting_transfer', paymentRowStatus: 'pending' })
    )
    expect(sendTransferInstructions).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'client@test.ch', orderNumber: 'SW-20260101-ABC123' })
    )
    expect(paymentRepository.setSecurityCode).not.toHaveBeenCalled()
    expect(result.payment.method).toBe('bank_transfer')
  })

  it('lève NotFoundError si la commande n’appartient pas à l’utilisateur', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending', 'someone-else') as never)
    await expect(paymentService.initialize(UUID, UUID, 'card')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('refuse de payer une commande déjà payée', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('paid') as never)
    await expect(paymentService.initialize(UUID, UUID, 'card')).rejects.toBeInstanceOf(BadRequestError)
  })

  it('refuse de ré-initialiser un virement en attente', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('awaiting_transfer') as never)
    await expect(paymentService.initialize(UUID, UUID, 'bank_transfer')).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('paymentService.confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('confirme le paiement carte avec le bon code', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(makePayment() as never)
    vi.mocked(orderRepository.confirmPayment).mockResolvedValue({
      order: makeOrder('paid'),
      payment: {} as never,
    } as never)
    vi.mocked(userRepository.findById).mockResolvedValue({ id: UUID, email: 'client@test.ch' } as never)

    const order = await paymentService.confirm(UUID, UUID, CODE)
    expect(order.payment_status).toBe('paid')
    expect(paymentRepository.resetSecurityCode).toHaveBeenCalledWith('pay-1')
    expect(orderRepository.confirmPayment).toHaveBeenCalledWith({ orderId: UUID, paymentId: 'pay-1' })
    expect(sendPaymentConfirmation).toHaveBeenCalledWith(expect.objectContaining({ to: 'client@test.ch' }))
  })

  it('lève BadRequestError avec un code invalide', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(makePayment() as never)

    await expect(paymentService.confirm(UUID, UUID, '000000')).rejects.toBeInstanceOf(BadRequestError)
    expect(paymentRepository.incrementCodeAttempt).toHaveBeenCalledWith('pay-1')
    expect(orderRepository.confirmPayment).not.toHaveBeenCalled()
  })

  it('bloque le paiement après le nombre maximal de tentatives', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(
      makePayment({ securityCodeAttempts: 3 }) as never
    )

    await expect(paymentService.confirm(UUID, UUID, '999999')).rejects.toBeInstanceOf(BadRequestError)
    expect(paymentRepository.setStatus).toHaveBeenCalledWith('pay-1', 'failed')
    expect(orderRepository.updatePaymentStatus).toHaveBeenCalledWith(UUID, 'failed')
  })

  it('refuse un code expiré', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(
      makePayment({ securityCodeExpiresAt: new Date(Date.now() - 60_000) }) as never
    )

    await expect(paymentService.confirm(UUID, UUID, CODE)).rejects.toBeInstanceOf(BadRequestError)
    expect(paymentRepository.setStatus).toHaveBeenCalledWith('pay-1', 'failed')
  })

  it('lève BadRequestError si le code est absent', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(makePayment() as never)

    await expect(paymentService.confirm(UUID, UUID)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('interdit la confirmation d’un virement', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('awaiting_transfer') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(
      makePayment({ method: 'bank_transfer', status: 'pending' }) as never
    )

    await expect(paymentService.confirm(UUID, UUID, CODE)).rejects.toBeInstanceOf(BadRequestError)
    expect(orderRepository.confirmPayment).not.toHaveBeenCalled()
  })

  it('lève BadRequestError si aucun paiement initialisé', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(null)
    await expect(paymentService.confirm(UUID, UUID, CODE)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('lève BadRequestError si la commande est déjà payée', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('paid') as never)
    await expect(paymentService.confirm(UUID, UUID, CODE)).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('paymentService.resendCode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('régénère un nouveau code pour un paiement carte', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('pending') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(makePayment() as never)

    await paymentService.resendCode(UUID, UUID)
    expect(paymentRepository.setSecurityCode).toHaveBeenCalledWith(
      'pay-1',
      expect.objectContaining({ hash: expect.any(String), expiresAt: expect.any(Date) })
    )
  })

  it('refuse le renvoi pour un virement', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder('awaiting_transfer') as never)
    vi.mocked(paymentRepository.findLatestByOrder).mockResolvedValue(
      makePayment({ method: 'bank_transfer', status: 'pending' }) as never
    )

    await expect(paymentService.resendCode(UUID, UUID)).rejects.toBeInstanceOf(BadRequestError)
  })
})
