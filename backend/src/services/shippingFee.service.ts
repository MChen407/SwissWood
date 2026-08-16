import { shippingFeeRepository } from '../repositories/shippingFee.repository.js'
import { DEFAULT_SHIPPING_FEES } from '../constants/shipping.js'

export interface ShippingRateDto {
  country: string
  fee_eur: number
}

export interface AdminShippingFeeDto extends ShippingRateDto {
  active: boolean
}

export const shippingFeeService = {
  async ensureDefaults(): Promise<void> {
    for (const [country, feeEur] of Object.entries(DEFAULT_SHIPPING_FEES)) {
      await shippingFeeRepository.upsert({ country, feeEur })
    }
  },

  async getFeeForCountry(country: string | undefined): Promise<number> {
    if (!country) return 0
    const fee = await shippingFeeRepository.findByCountry(country.trim())
    return fee?.active ? fee.feeEur : 0
  },

  async listActiveRates(): Promise<ShippingRateDto[]> {
    const fees = await shippingFeeRepository.findActive()
    return fees.map((fee) => ({ country: fee.country, fee_eur: fee.feeEur }))
  },

  async listAll(): Promise<AdminShippingFeeDto[]> {
    const fees = await shippingFeeRepository.findAll()
    return fees.map((fee) => ({ country: fee.country, fee_eur: fee.feeEur, active: fee.active }))
  },

  async upsert(country: string, feeEur: number, active = true): Promise<AdminShippingFeeDto> {
    const fee = await shippingFeeRepository.upsert({ country, feeEur, active })
    return { country: fee.country, fee_eur: fee.feeEur, active: fee.active }
  },

  async remove(country: string): Promise<void> {
    await shippingFeeRepository.remove(country)
  },
}