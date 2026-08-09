import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/repositories/product.repository', () => ({
  productRepository: {
    findMany: vi.fn(),
    findBySlug: vi.fn(),
    findById: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { productService, adminProductService } from '../../src/services/product.service.js'
import { productRepository } from '../../src/repositories/product.repository.js'
import { BadRequestError, ConflictError, NotFoundError } from '../../src/utils/httpErrors.js'
import type { Product } from '@prisma/client'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: UUID,
    name: 'Teck massif',
    slug: 'teck-massif',
    essence: 'Teck',
    description: '',
    priceEur: 25000,
    priceUsd: 30000,
    priceFcfa: 150000,
    stock: 5,
    dimensions: {},
    images: [],
    characteristics: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Product
}

describe('productService.list', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne les produits actifs par défaut avec pagination', async () => {
    vi.mocked(productRepository.findMany).mockResolvedValue([makeProduct()] as never)
    vi.mocked(productRepository.count).mockResolvedValue(1)

    const result = await productService.list({ limit: 10 })
    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(productRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, limit: 10 })
    )
  })

  it('lève BadRequestError pour une essence inconnue', async () => {
    await expect(productService.list({ essence: 'Bambou' })).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('productService.getBySlug / featured', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne un produit actif par slug', async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue(makeProduct() as never)
    const product = await productService.getBySlug('teck-massif')
    expect(product.slug).toBe('teck-massif')
    expect(productRepository.findBySlug).toHaveBeenCalledWith('teck-massif', true)
  })

  it('lève NotFoundError si le produit n’existe pas', async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue(null)
    await expect(productService.getBySlug('inconnu')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('featured trie par prix décroissant', async () => {
    vi.mocked(productRepository.findMany).mockResolvedValue([makeProduct()] as never)
    const items = await productService.featured(6)
    expect(items).toHaveLength(1)
    expect(productRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, sort: 'price_desc', limit: 6 })
    )
  })
})

describe('adminProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crée un produit en générant le slug depuis le nom', async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue(null)
    vi.mocked(productRepository.create).mockResolvedValue(makeProduct() as never)

    const product = await adminProductService.create({
      name: 'Teck Massif',
      essence: 'Teck',
      price_eur: 25000,
      price_usd: 30000,
      price_fcfa: 150000,
      stock: 5,
      dimensions: {},
      images: [],
      characteristics: {},
      is_active: true,
    })
    expect(product.name).toBe('Teck massif')
    expect(productRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'teck-massif', priceEur: 25000 })
    )
  })

  it('lève ConflictError si le slug existe déjà', async () => {
    vi.mocked(productRepository.findBySlug).mockResolvedValue(makeProduct() as never)
    await expect(
      adminProductService.create({
        name: 'Teck',
        essence: 'Teck',
        price_eur: 1,
        price_usd: 1,
        price_fcfa: 1,
        stock: 1,
        dimensions: {},
        images: [],
        characteristics: {},
        is_active: true,
      })
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('met à jour un produit existant', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct() as never)
    vi.mocked(productRepository.findBySlug).mockResolvedValue(null)
    vi.mocked(productRepository.update).mockResolvedValue(
      makeProduct({ name: 'Teck royal' }) as never
    )

    const product = await adminProductService.update(UUID, { name: 'Teck royal' })
    expect(product.name).toBe('Teck royal')
    expect(productRepository.update).toHaveBeenCalledWith(UUID, { name: 'Teck royal' })
  })

  it('refuse un slug pris par un autre produit', async () => {
    const other = makeProduct({ id: '99999999-9999-9999-9999-999999999999' })
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct() as never)
    vi.mocked(productRepository.findBySlug).mockResolvedValue(other as never)

    await expect(
      adminProductService.update(UUID, { slug: 'teck-massif' })
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('supprime un produit existant', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct() as never)
    vi.mocked(productRepository.remove).mockResolvedValue(makeProduct() as never)
    await expect(adminProductService.remove(UUID)).resolves.toBeUndefined()
  })

  it('lève NotFoundError en cas de suppression d’un produit inconnu', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)
    await expect(adminProductService.remove(UUID)).rejects.toBeInstanceOf(NotFoundError)
  })
})