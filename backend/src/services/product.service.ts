import { Prisma } from '@prisma/client'
import { productRepository, type ProductListFilters } from '../repositories/product.repository.js'
import { toProductDto, type ProductDto } from '../dto/public.dto.js'
import { BadRequestError, ConflictError, NotFoundError } from '../utils/httpErrors.js'
import { PRODUCT_ESSENCES, type ProductEssence } from '../constants/index.js'

export interface ProductListQuery {
  essence?: string
  exclude?: string
  active?: boolean
  sort?: string
  limit?: number
  offset?: number
}

function normalizeFilters(query: ProductListQuery): ProductListFilters {
  const filters: ProductListFilters = {}
  filters.active = query.active ?? true // l'API publique n'expose que les produits actifs

  if (query.essence) {
    if (!PRODUCT_ESSENCES.includes(query.essence as ProductEssence)) {
      throw new BadRequestError('Essence de bois invalide')
    }
    filters.essence = query.essence as ProductEssence
  }

  if (query.exclude) filters.excludeId = query.exclude

  const validSorts = ['price_asc', 'price_desc']
  if (query.sort && validSorts.includes(query.sort)) {
    filters.sort = query.sort as 'price_asc' | 'price_desc'
  }

  filters.limit = Math.min(query.limit ?? 20, 100)
  filters.offset = query.offset ?? 0

  return filters
}

export const productService = {
  async list(query: ProductListQuery) {
    const filters = normalizeFilters(query)
    const [items, total] = await Promise.all([
      productRepository.findMany(filters),
      productRepository.count(filters as Pick<ProductListFilters, 'essence' | 'active'>),
    ])
    return {
      items: items.map(toProductDto),
      total,
      limit: filters.limit,
      offset: filters.offset,
    }
  },

  async featured(limit = 6) {
    const items = await productRepository.findMany({ active: true, sort: 'price_desc', limit })
    return items.map(toProductDto)
  },

  async getBySlug(slug: string): Promise<ProductDto> {
    const product = await productRepository.findBySlug(slug, true)
    if (!product) {
      throw new NotFoundError('Produit introuvable')
    }
    return toProductDto(product)
  },

  async getById(id: string) {
    const product = await productRepository.findById(id)
    if (!product) {
      throw new NotFoundError('Produit introuvable')
    }
    return toProductDto(product)
  },

  async related(productId: string, essence?: string, limit = 3) {
    if (essence && !PRODUCT_ESSENCES.includes(essence as ProductEssence)) {
      throw new BadRequestError('Essence de bois invalide')
    }
    const items = await productRepository.findMany({
      active: true,
      essence,
      excludeId: productId,
      limit,
    })
    return items.map(toProductDto)
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
}

export const adminProductService = {
  async create(input: AdminProductInput): Promise<ProductDto> {
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
      isActive: input.is_active,
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

  async listAll(): Promise<ProductDto[]> {
    const items = await productRepository.findMany({})
    return items.map(toProductDto)
  },
}