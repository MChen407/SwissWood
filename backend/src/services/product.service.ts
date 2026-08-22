import { Prisma, type Product } from '@prisma/client'
import { productRepository, type ProductListFilters } from '../repositories/product.repository.js'
import { toProductDto, normalizeLocale, type ProductDto, type ProductTranslations } from '../dto/public.dto.js'
import { BadRequestError, ConflictError, NotFoundError } from '../utils/httpErrors.js'
import {
  essenceGroupOf,
  ESSENCE_GROUP_IDS,
  PRODUCT_ESSENCES,
  type ProductEssence,
} from '../constants/index.js'
import type { Role } from '../constants/index.js'

export interface ProductListQuery {
  essence?: string
  group?: string
  exclude?: string
  active?: boolean
  search?: string
  sort?: string
  limit?: number
  offset?: number
  locale?: unknown
}

function normalizeFilters(query: ProductListQuery): ProductListFilters {
  const filters: ProductListFilters = {}
  filters.active = query.active ?? true // l'API publique n'expose que les produits actifs

  if (query.essence) {
    if (!PRODUCT_ESSENCES.includes(query.essence as ProductEssence)) {
      throw new BadRequestError('Essence de bois invalide')
    }
    filters.essence = query.essence as ProductEssence
  } else if (query.group) {
    if (!ESSENCE_GROUP_IDS.includes(query.group as (typeof ESSENCE_GROUP_IDS)[number])) {
      throw new BadRequestError('Catégorie d’essence invalide')
    }
    filters.essences = essenceGroupOf(query.group)
  }

  if (query.exclude) {
    filters.excludeId = query.exclude
  }

  if (query.search) {
    filters.search = query.search
  }

  const validSorts = ['price_asc', 'price_desc', 'name']
  if (query.sort && validSorts.includes(query.sort)) {
    filters.sort = query.sort as 'price_asc' | 'price_desc' | 'name'
  }

  filters.limit = Math.min(query.limit ?? 12, 100)
  filters.offset = query.offset ?? 0

  return filters
}

export const productService = {
  async list(query: ProductListQuery) {
    const filters = normalizeFilters(query)
    const locale = normalizeLocale(query.locale)
    const [items, total] = await Promise.all([
      productRepository.findMany(filters),
      productRepository.count(filters as Pick<ProductListFilters, 'essence' | 'essences' | 'active' | 'search'>),
    ])
    return {
      items: items.map((p) => toProductDto(p, locale)),
      total,
      limit: filters.limit,
      offset: filters.offset,
    }
  },

  async featured(limit = 6, locale?: unknown) {
    const items = await productRepository.findMany({ active: true, sort: 'price_desc', limit })
    const loc = normalizeLocale(locale)
    return items.map((p) => toProductDto(p, loc))
  },

  async getBySlug(slug: string, locale?: unknown): Promise<ProductDto> {
    const product = await productRepository.findBySlug(slug, true)
    if (!product) {
      throw new NotFoundError('Produit introuvable')
    }
    return toProductDto(product, normalizeLocale(locale))
  },

  async getById(id: string) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new NotFoundError('Produit introuvable')
    }
    return toProductDto(product)
  },

  // Sélection de l'accueil : max 10 produits en 3 sections.
  async homeSelection(locale?: unknown) {
    const loc = normalizeLocale(locale)

    const bestRows = await productRepository.getBestSellers(3)
    let bestSellers: Product[] = []
    if (bestRows.length) {
      const found = await productRepository.findByIds(bestRows.map((r) => r.productId))
      const byId = new Map(found.map((p) => [p.id, p]))
      bestSellers = bestRows
        .map((r) => byId.get(r.productId))
        .filter((p): p is Product => !!p && p.isActive)
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const favRows = await productRepository.getMostFavoritedSince(since, 1)
    let selectionDuJour: Product[] = []
    const topFav = favRows[0]
    if (topFav) {
      const p = await productRepository.findById(topFav.productId)
      if (p && p.isActive) selectionDuJour = [p]
    }
    if (!selectionDuJour.length) {
      selectionDuJour = await productRepository.findActiveExcluding(
        bestSellers.map((p) => p.id),
        1,
      )
    }

    const selectedIds = [
      ...bestSellers.map((p) => p.id),
      ...selectionDuJour.map((p) => p.id),
    ]
    const remaining = Math.max(0, 10 - selectedIds.length)
    const others = await productRepository.findActiveExcluding(selectedIds, remaining)

    return {
      bestSellers: bestSellers.map((p) => toProductDto(p, loc)),
      selectionDuJour: selectionDuJour.map((p) => toProductDto(p, loc)),
      others: others.map((p) => toProductDto(p, loc)),
    }
  },

  async related(productId: string, essence?: string, limit = 3, locale?: unknown) {
    if (essence && !PRODUCT_ESSENCES.includes(essence as ProductEssence)) {
      throw new BadRequestError('Essence de bois invalide')
    }
    const items = await productRepository.findMany({
      active: true,
      essence,
      excludeId: productId,
      limit,
    })
    const loc = normalizeLocale(locale)
    return items.map((p) => toProductDto(p, loc))
  },
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface AdminProductInput {
  name: string
  slug?: string
  essence: ProductEssence
  description?: string
  price_eur: number
  price_usd: number
  price_fcfa: number
  stock: number
  dimensions: Record<string, unknown>
  images: string[]
  characteristics: Record<string, unknown>
  is_active: boolean
  translations?: Record<string, ProductTranslations>
}

function sanitizeTranslations(
  input: Record<string, ProductTranslations> | undefined,
): Prisma.InputJsonValue {
  const clean: Record<string, ProductTranslations> = {}
  if (!input) return clean as Prisma.InputJsonValue
  for (const [locale, value] of Object.entries(input)) {
    const loc = normalizeLocale(locale)
    if (!loc || loc === 'fr' || typeof value !== 'object' || value === null) continue
    const entry: ProductTranslations = {}
    if (typeof value.name === 'string') entry.name = value.name.trim()
    if (typeof value.description === 'string') entry.description = value.description.trim()
    clean[loc] = entry
  }
  return clean as Prisma.InputJsonValue
}

export const adminProductService = {
  async create(input: AdminProductInput, createdBy?: string): Promise<ProductDto> {
    const slug = (input.slug?.trim() || slugify(input.name) || 'produit').toLowerCase()
    if (await productRepository.findBySlug(slug)) {
      throw new ConflictError('Un produit existe déjà avec ce slug')
    }

    const product = await productRepository.create({
      name: input.name,
      slug,
      essence: input.essence,
      description: input.description ?? '',
      priceEur: input.price_eur,
      priceUsd: input.price_usd,
      priceFcfa: input.price_fcfa,
      stock: input.stock,
      dimensions: (input.dimensions ?? {}) as Prisma.InputJsonValue,
      images: (Array.isArray(input.images) ? input.images : []) as Prisma.InputJsonValue,
      characteristics: (input.characteristics ?? {}) as Prisma.InputJsonValue,
      translations: sanitizeTranslations(input.translations),
      isActive: input.is_active,
      createdBy,
    })
    return toProductDto(product)
  },

  async update(id: string, input: Partial<AdminProductInput>): Promise<ProductDto> {
    const existing = await productRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Produit introuvable')
    }

    if (input.slug?.trim()) {
      const candidate = input.slug.trim().toLowerCase()
      const taken = await productRepository.findBySlug(candidate)
      if (taken && taken.id !== id) {
        throw new ConflictError('Un produit existe déjà avec ce slug')
      }
    }

    const data: Prisma.ProductUncheckedUpdateInput = {}
    if (input.name !== undefined) data.name = input.name
    if (input.slug !== undefined) data.slug = input.slug.trim().toLowerCase() || existing.slug
    if (input.essence !== undefined) data.essence = input.essence
    if (input.description !== undefined) data.description = input.description
    if (input.price_eur !== undefined) data.priceEur = input.price_eur
    if (input.price_usd !== undefined) data.priceUsd = input.price_usd
    if (input.price_fcfa !== undefined) data.priceFcfa = input.price_fcfa
    if (input.stock !== undefined) data.stock = input.stock
    if (input.dimensions !== undefined) data.dimensions = input.dimensions as Prisma.InputJsonValue
    if (input.images !== undefined) data.images = input.images as Prisma.InputJsonValue
    if (input.characteristics !== undefined) data.characteristics = input.characteristics as Prisma.InputJsonValue
    if (input.translations !== undefined) data.translations = sanitizeTranslations(input.translations)
    if (input.is_active !== undefined) data.isActive = input.is_active

    const product = await productRepository.update(id, data)
    return toProductDto(product)
  },

  async remove(id: string): Promise<void> {
    const existing = await productRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Produit introuvable')
    }
    await productRepository.remove(id)
  },

  async listAll(currentUser: { id: string; role: Role }): Promise<ProductDto[]> {
    const where: Prisma.ProductWhereInput =
      currentUser.role === 'super_admin' ? {} : { createdBy: currentUser.id }
    const items = await productRepository.findForAdmin(where)
    return items.map((p) => toProductDto(p))
  },
}