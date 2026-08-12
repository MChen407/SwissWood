import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/config/db', () => ({
  prisma: {
    media: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))
vi.mock('../../src/config/env', () => ({
  env: { API_PUBLIC_URL: 'https://swisswood-production.up.railway.app' },
}))

import { storeImageFiles, findMediaById } from '../../src/services/media.service.js'
import { prisma } from '../../src/config/db.js'

const UUID = '11111111-1111-1111-1111-111111111111'

function makeFile(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname: 'images',
    originalname: 'photo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 4,
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    ...overrides,
  } as Express.Multer.File
}

describe('mediaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stocke les fichiers et renvoie leurs URLs publiques', async () => {
    vi.mocked(prisma.media.create).mockResolvedValue({
      id: UUID,
      filename: 'photo.jpg',
      mimetype: 'image/jpeg',
      size: 4,
      data: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
      createdAt: new Date(),
    } as never)

    const urls = await storeImageFiles([makeFile()])

    expect(urls).toEqual([`https://swisswood-production.up.railway.app/api/media/${UUID}`])
    expect(prisma.media.create).toHaveBeenCalledWith({
      data: {
        filename: 'photo.jpg',
        mimetype: 'image/jpeg',
        size: 4,
        data: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
      },
    })
  })

  it('stocke plusieurs fichiers', async () => {
    vi.mocked(prisma.media.create).mockResolvedValue({ id: UUID } as never)
    const urls = await storeImageFiles([makeFile(), makeFile({ originalname: 'a.png', mimetype: 'image/png' })])
    expect(urls).toHaveLength(2)
    expect(prisma.media.create).toHaveBeenCalledTimes(2)
  })

  it('retourne null si le média est introuvable', async () => {
    vi.mocked(prisma.media.findUnique).mockResolvedValue(null)
    await expect(findMediaById(UUID)).resolves.toBeNull()
    expect(prisma.media.findUnique).toHaveBeenCalledWith({ where: { id: UUID } })
  })
})
