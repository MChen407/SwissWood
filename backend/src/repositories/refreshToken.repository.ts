import { prisma } from '../config/db.js'

export const refreshTokenRepository = {
  async create(data: { tokenHash: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({
      data: {
        token: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    })
  },

  async findByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { token: tokenHash } })
  },

  async revoke(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } })
  },

  async markReplaced(id: string, newTokenHash: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), replacedBy: newTokenHash },
    })
  },

  async revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },

  async cleanupExpired() {
    return prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  },
}