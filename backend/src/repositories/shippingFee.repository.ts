import { prisma } from '../config/db.js'

export interface UpsertShippingFeeData {
  country: string
  feeEur: number
  active?: boolean
}

export const shippingFeeRepository = {
  async findAll() {
    return prisma.shippingFee.findMany({ orderBy: { country: 'asc' } })
  },

  async findActive() {
    return prisma.shippingFee.findMany({ where: { active: true }, orderBy: { country: 'asc' } })
  },

  async findByCountry(country: string) {
    return prisma.shippingFee.findUnique({ where: { country } })
  },

  async upsert(data: UpsertShippingFeeData) {
    return prisma.shippingFee.upsert({
      where: { country: data.country },
      update: { feeEur: data.feeEur, active: data.active ?? true },
      create: { country: data.country, feeEur: data.feeEur, active: data.active ?? true },
    })
  },

  async remove(country: string) {
    return prisma.shippingFee.delete({ where: { country } })
  },
}