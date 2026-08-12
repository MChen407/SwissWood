import { prisma } from '../config/db.js'
import { env } from '../config/env.js'

export async function storeImageFiles(files: Express.Multer.File[]): Promise<string[]> {
  const publicBase = env.API_PUBLIC_URL.trim().replace(/\/$/, '')
  const urls: string[] = []

  for (const file of files) {
    const media = await prisma.media.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: file.buffer as unknown as Uint8Array<ArrayBuffer>,
      },
    })
    urls.push(`${publicBase}/api/media/${media.id}`)
  }

  return urls
}

export async function findMediaById(id: string) {
  return prisma.media.findUnique({ where: { id } })
}
