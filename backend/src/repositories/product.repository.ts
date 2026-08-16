import { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export interface ProductListFilters {
  essence?: string
  essences?: string[]
  excludeId?: string
  active?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest'
  limit?: number
  offset?: number
}

export const productRepository = {
  async findMany(filters: ProductListFilters = {}) {
    const where: Prisma.ProductWhereInput = {}
    if (filters.essence) where.essence = filters.essence as Prisma.ProductWhereInput['essence']
    else if (filters.essences && filters.essences.length > 0)
      where.essence = { in: filters.essences as Prisma.ProductWhereInput['essence'][] } as Prisma.ProductWhereInput['essence']
    if (filters.active !== undefined) where.isActive = filters.active
    if (filters.excludeId) where.id = { not: filters.excludeId }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = []
    if (filters.sort === 'price_asc') orderBy.push({ priceEur: 'asc' })
    else if (filters.sort === 'price_desc') orderBy.push({ priceEur: 'desc' })
    else orderBy.push({ createdAt: 'desc' })

    return prisma.product.findMany({
      where,
      orderBy,
      take: filters.limit ?? 20,
      skip: filters.offset ?? 0,
    })
  },

  async findBySlug(slug: string, active?: boolean) {
    return prisma.product.findFirst({
      where: { slug, ...(active !== undefined ? { isActive: active } : {}) },
    })
  },

  async count(filters: Pick<ProductListFilters, 'essence' | 'essences' | 'active'> = {}) {
    const where: Prisma.ProductWhereInput = {}
    if (filters.essence) where.essence = filters.essence as Prisma.ProductWhereInput['essence']
    else if (filters.essences && filters.essences.length > 0)
      where.essence = { in: filters.essences as Prisma.ProductWhereInput['essence'][] } as Prisma.ProductWhereInput['essence']
    if (filters.active !== undefined) where.isActive = filters.active
    return prisma.product.count({ where })
  },

  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } })
  },

  async findByIds(ids: string[]) {
    return prisma.product.findMany({ where: { id: { in: ids } } })
  },

  async create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data })
  },

  async update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
    return prisma.product.update({ where: { id }, data })
  },

  async remove(id: string) {
    return prisma.product.delete({ where: { id } })
  },
}