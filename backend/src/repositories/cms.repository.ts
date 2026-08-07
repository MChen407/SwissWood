import { prisma } from '@/config/db'

export const cmsRepository = {
  async findAll() {
    return prisma.cmsContent.findMany({ orderBy: { key: 'asc' } })
  },

  async findByKey(key: string) {
    return prisma.cmsContent.findUnique({ where: { key } })
  },
}