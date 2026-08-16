import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/repositories/shippingFee.repository', () => ({
  shippingFeeRepository: {
    findAll: vi.fn(),
    findActive: vi.fn(),
    findByCountry: vi.fn(),
    upsert: vi.fn(),
    remove: vi.fn(),
  },
}))

import { shippingFeeService } from '../../src/services/shippingFee.service.js'
import { shippingFeeRepository } from '../../src/repositories/shippingFee.repository.js'

function makeFee(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: '1',
    country: 'Suisse',
    feeEur: 1500,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('shippingFeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renvoie le frais du pays s’il est actif', async () => {
    vi.mocked(shippingFeeRepository.findByCountry).mockResolvedValue(makeFee() as never)
    await expect(shippingFeeService.getFeeForCountry('Suisse')).resolves.toBe(1500)
    expect(shippingFeeRepository.findByCountry).toHaveBeenCalledWith('Suisse')
  })

  it('renvoie 0 si le pays n’est pas configuré', async () => {
    vi.mocked(shippingFeeRepository.findByCountry).mockResolvedValue(null)
    await expect(shippingFeeService.getFeeForCountry('Inconnu')).resolves.toBe(0)
  })

  it('renvoie 0 si le pays est désactivé', async () => {
    vi.mocked(shippingFeeRepository.findByCountry).mockResolvedValue(makeFee({ active: false }) as never)
    await expect(shippingFeeService.getFeeForCountry('Suisse')).resolves.toBe(0)
  })

  it('renvoie 0 si aucun pays fourni', async () => {
    await expect(shippingFeeService.getFeeForCountry(undefined)).resolves.toBe(0)
    expect(shippingFeeRepository.findByCountry).not.toHaveBeenCalled()
  })

  it('liste les taux actifs pour le frontend', async () => {
    vi.mocked(shippingFeeRepository.findActive).mockResolvedValue([
      makeFee(),
      makeFee({ country: 'France', feeEur: 2000 }),
    ] as never)
    const rates = await shippingFeeService.listActiveRates()
    expect(rates).toEqual([
      { country: 'Suisse', fee_eur: 1500 },
      { country: 'France', fee_eur: 2000 },
    ])
  })

  it('crée ou met à jour un frais', async () => {
    vi.mocked(shippingFeeRepository.upsert).mockResolvedValue(makeFee({ country: 'France', feeEur: 2500 }) as never)
    const fee = await shippingFeeService.upsert('France', 2500)
    expect(fee).toEqual({ country: 'France', fee_eur: 2500, active: true })
    expect(shippingFeeRepository.upsert).toHaveBeenCalledWith({ country: 'France', feeEur: 2500, active: true })
  })
})