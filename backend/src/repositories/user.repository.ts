import { prisma } from '../config/db.js'
import type { Role } from '../constants/index.js'

export interface CreateUserData {
  email: string
  password?: string
  googleId?: string
  firstName?: string
  lastName?: string
  role?: Role
  emailVerified?: boolean
  avatarUrl?: string
  country?: string
}

export interface UpdateUserData {
  googleId?: string
  emailVerified?: boolean
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  avatarUrl?: string
  role?: Role
}

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({ where: { googleId } })
  },

  async findByEmailOrGoogle(email?: string, googleId?: string) {
    const conditions: Array<{ email: string } | { googleId: string }> = []
    if (email) conditions.push({ email })
    if (googleId) conditions.push({ googleId })
    if (conditions.length === 0) return null
    return prisma.user.findFirst({ where: { OR: conditions } })
  },

  async create(data: CreateUserData) {
    return prisma.user.create({ data })
  },

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({ where: { id }, data })
  },

  async list(role?: Role, { skip, take }: { skip?: number; take?: number } = {}) {
    return prisma.user.findMany({
      where: role ? { role } : {},
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    })
  },

  async count(role?: Role) {
    return prisma.user.count({ where: role ? { role } : {} })
  },
}