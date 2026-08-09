import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/repositories/favorite.repository', () => ({
  favoriteRepository: {
    findByUser: vi.fn(),
    upsert: vi.fn(),
    remove: vi.fn(),
    countByUser: vi.fn(),
  },
}))
vi.mock('../../src/repositories/product.repository', () => ({
  productRepository: { findById: vi.fn() },
}))

import { favoriteService } from '../../src/services/favorite.service.js'
import { favoriteRepository } from '../../src/repositories/favorite.repository.js'
import { productRepository } from '../../src/repositories/product.repository.js'
import { NotFoundError } from '../../src/utils/httpErrors.js'
import type { Product } from '@prisma/client'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeProduct(): Product {
  return {
    id: UUID,
    name: 'Pin',
    slug: 'pin',
    essence: 'Pin',
    description: '',
    priceEur: 1000,
    priceUsd: 1200,
    priceFcfa: 6000,
    stock: 3,
    dimensions: {},
    images: [],
    characteristics: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Product
}

describe('favoriteService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('liste les favoris de l’utilisateur', async () => {
    vi.mocked(favoriteRepository.findByUser).mockResolvedValue([
      {
        id: 'fav-1',
        userId: UUID,
        productId: UUID,
        createdAt: new Date(),
        product: makeProduct(),
      },
    ] as never)
    const items = await favoriteService.listForUser(UUID)
    expect(items).toHaveLength(1)
    expect(items[0]?.product_id).toBe(UUID)
    expect(items[0]?.product.name).toBe('Pin')
  })

  it('ajoute un favori si le produit existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct() as never)
    vi.mocked(favoriteRepository.upsert).mockResolvedValue({
      id: 'fav-1',
      userId: UUID,
      productId: UUID,
      createdAt: new Date(),
    } as never)
    const item = await favoriteService.add(UUID, UUID)
    expect(item.product_id).toBe(UUID)
    expect(favoriteRepository.upsert).toHaveBeenCalledWith(UUID, UUID)
  })

  it('lève NotFoundError si le produit n’existe pas', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)
    await expect(favoriteService.add(UUID, UUID)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('supprime un favori', async () => {
    vi.mocked(favoriteRepository.remove).mockResolvedValue({ count: 1 } as never)
    await expect(favoriteService.remove(UUID, UUID)).resolves.toBeUndefined()
    expect(favoriteRepository.remove).toHaveBeenCalledWith(UUID, UUID)
  })

  it('compte les favoris', async () => {
    vi.mocked(favoriteRepository.countByUser).mockResolvedValue(4)
    await expect(favoriteService.countForUser(UUID)).resolves.toBe(4)
  })
})