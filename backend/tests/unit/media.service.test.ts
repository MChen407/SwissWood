import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/config/cloudinary', () => ({
  uploadBuffer: vi.fn(),
  destroyImage: vi.fn(),
}))
vi.mock('../../src/config/env', () => ({
  env: { CLOUDINARY_FOLDER: 'swisswood' },
}))

import { deleteImage, storeImageFiles } from '../../src/services/media.service.js'
import { destroyImage, uploadBuffer } from '../../src/config/cloudinary.js'

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

  it('uploade les fichiers sur Cloudinary et renvoie leurs URLs', async () => {
    vi.mocked(uploadBuffer).mockResolvedValue({
      publicId: 'swisswood/photo.jpg',
      url: 'https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto/swisswood/photo.jpg',
    })

    const images = await storeImageFiles([makeFile()])

    expect(images).toEqual([
      {
        publicId: 'swisswood/photo.jpg',
        url: 'https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto/swisswood/photo.jpg',
      },
    ])
    expect(uploadBuffer).toHaveBeenCalledWith(expect.any(Buffer), { folder: 'swisswood' })
  })

  it('uploade plusieurs fichiers', async () => {
    vi.mocked(uploadBuffer).mockResolvedValue({
      publicId: 'swisswood/photo.jpg',
      url: 'https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto/swisswood/photo.jpg',
    })
    const images = await storeImageFiles([makeFile(), makeFile({ originalname: 'a.png', mimetype: 'image/png' })])
    expect(images).toHaveLength(2)
    expect(uploadBuffer).toHaveBeenCalledTimes(2)
  })

  it('supprime une image via son publicId', async () => {
    vi.mocked(destroyImage).mockResolvedValue()
    await deleteImage('swisswood/photo.jpg')
    expect(destroyImage).toHaveBeenCalledWith('swisswood/photo.jpg')
  })
})