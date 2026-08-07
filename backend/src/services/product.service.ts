import { productRepository, type ProductListFilters } from '@/repositories/product.repository'
import { toProductDto, type ProductDto } from '@/dto/public.dto'
import { NotFoundError, BadRequestError } from '@/utils/httpErrors'
import { PRODUCT_ESSENCES } from '@/constants'

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
    if (!PRODUCT_ESSENCES.includes(query.essence)) {
      throw new BadRequestError('Essence de bois invalide')
    }
    filters.essence = query.essence
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
    if (essence && !PRODUCT_ESSENCES.includes(essence)) {
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