import { prisma } from '@/config/db'

export interface CreateContactMessageData {
  name: string
  email: string
  subject: string
  message: string
}

export const contactRepository = {
  async create(data: CreateContactMessageData) {
    return prisma.contactMessage.create({ data })
  },
}