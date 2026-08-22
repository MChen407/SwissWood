import { Prisma, OrderStatus } from '@prisma/client'
import { prisma } from '../config/db.js'

export interface ProductListFilters {
  essence?: string
  essences?: string[]
  excludeId?: string
  active?: boolean
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name'
  limit?: number
  offset?: number
  createdBy?: string
}

export const productRepository = {
  async findMany(filters: ProductListFilters = {}) {
    const where: Prisma.ProductWhereInput = {}
    if (filters.essence) {
      where.essence = filters.essence as Prisma.ProductWhereInput['essence']
    } else if (filters.essences && filters.essences.length > 0) {
      where.essence = { in: filters.essences as Prisma.ProductWhereInput['essence'][] } as Prisma.ProductWhereInput['essence']
    }
    if (filters.active !== undefined) where.isActive = filters.active
    if (filters.excludeId) where.id = { not: filters.excludeId }
    if (filters.createdBy) where.createdBy = filters.createdBy
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = []
    if (filters.sort === 'price_asc') orderBy.push({ priceEur: 'asc' })
    else if (filters.sort === 'price_desc') orderBy.push({ priceEur: 'desc' })
    else if (filters.sort === 'name') orderBy.push({ name: 'asc' })
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

  // Liste admin : pas de limite de pagination (renvoie tous les produits filtrés).
  async findForAdmin(where: Prisma.ProductWhereInput = {}) {
    return prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  },

  // Top ventes : quantités vendues (commandes terminées) agrégées par produit.
  async getBestSellers(limit: number) {
    const items = await prisma.orderItem.findMany({
      where: { order: { status: OrderStatus.delivered } },
      select: { productId: true, quantity: true },
    })
    const counts = new Map<string, number>()
    for (const it of items) {
      counts.set(it.productId, (counts.get(it.productId) ?? 0) + Number(it.quantity))
    }
    return [...counts.entries()]
      .map(([productId, total]) => ({ productId, total }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  },

  // Produits les plus ajoutés aux favoris depuis `since`.
  async getMostFavoritedSince(since: Date, limit: number) {
    const rows = await prisma.favorite.groupBy({
      by: ['productId'],
      _count: { _all: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    })
    return rows.map((r) => ({ productId: r.productId, count: r._count._all }))
  },

  // Produits actifs hors `ids`, du plus récent au plus ancien.
  async findActiveExcluding(ids: string[], limit: number) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(ids.length ? { id: { notIn: ids } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async count(filters: Pick<ProductListFilters, 'essence' | 'essences' | 'active' | 'search'> = {}) {
    const where: Prisma.ProductWhereInput = {}
    if (filters.essence) {
      where.essence = filters.essence as Prisma.ProductWhereInput['essence']
    } else if (filters.essences && filters.essences.length > 0) {
      where.essence = { in: filters.essences as Prisma.ProductWhereInput['essence'][] } as Prisma.ProductWhereInput['essence']
    }
    if (filters.active !== undefined) where.isActive = filters.active
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }
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