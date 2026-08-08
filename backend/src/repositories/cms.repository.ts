import { prisma } from '@/config/db'

export const cmsRepository = {
  async findAll() {
    return prisma.cmsContent.findMany({ orderBy: { key: 'asc' } })
  },

  async findByKey(key: string) {
    return prisma.cmsContent.findUnique({ where: { key } })
  },

  async findById(id: string) {
    return prisma.cmsContent.findUnique({ where: { id } })
  },

  async updateById(id: string, data: { value?: string; label?: string }) {
    return prisma.cmsContent.update({ where: { id }, data })
  },

  async create(data: { key: string; value?: string; label?: string; type?: string }) {
    return prisma.cmsContent.create({
      data: {
        key: data.key,
        value: data.value ?? '',
        label: data.label ?? '',
        type: data.type ?? 'text',
      },
    })
  },
}