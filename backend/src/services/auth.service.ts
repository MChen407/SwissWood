import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { env } from '@/config/env'
import { userRepository } from '@/repositories/user.repository'
import { refreshTokenRepository } from '@/repositories/refreshToken.repository'
import { generateAccessToken, generateRefreshToken, hashToken, durationToMs } from '@/services/token.service'
import { toUserPublicDto, type AuthResponse, type UserPublicDto } from '@/dto/auth.dto'
import type { LoginDto, RegisterDto } from '@/validators/auth.validator'
import type { ChangePasswordDto, UpdateProfileDto } from '@/validators/user.validator'
import { BadRequestError, ConflictError, UnauthorizedError } from '@/utils/httpErrors'

const BCRYPT_ROUNDS = 12

function refreshTokenExpiry(): Date {
  const ms = durationToMs(env.JWT_REFRESH_EXPIRES_IN)
  return new Date(Date.now() + ms)
}

async function buildAuthResponse(userId: string): Promise<AuthResponse> {
  const user = await userRepository.findById(userId)
  if (!user) {
    throw new UnauthorizedError('Utilisateur introuvable')
  }

  const { token: refreshToken, hashed } = generateRefreshToken()
  await refreshTokenRepository.create({
    tokenHash: hashed,
    userId: user.id,
    expiresAt: refreshTokenExpiry(),
  })

  return {
    user: toUserPublicDto(user),
    tokens: {
      accessToken: generateAccessToken(user),
      refreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  }
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('Un compte existe déjà avec cette adresse email')
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)

    const user = await userRepository.create({
      email: data.email,
      password: passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    return buildAuthResponse(user.id)
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email)
    if (!user?.password) {
      throw new UnauthorizedError('Email ou mot de passe incorrect')
    }

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
      throw new UnauthorizedError('Email ou mot de passe incorrect')
    }

    return buildAuthResponse(user.id)
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = hashToken(refreshToken)
    const stored = await refreshTokenRepository.findByHash(tokenHash)

    if (!stored || stored.revokedAt) {
      throw new UnauthorizedError('Refresh token invalide')
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expiré')
    }

    const user = await userRepository.findById(stored.userId)
    if (!user) {
      throw new UnauthorizedError('Utilisateur introuvable')
    }

    const { token: newRefresh, hashed: newHash } = generateRefreshToken()
    await refreshTokenRepository.markReplaced(stored.id, newHash)
    await refreshTokenRepository.create({
      tokenHash: newHash,
      userId: user.id,
      expiresAt: refreshTokenExpiry(),
    })

    return {
      user: toUserPublicDto(user),
      tokens: {
        accessToken: generateAccessToken(user),
        refreshToken: newRefresh,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      },
    }
  },

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return
    const stored = await refreshTokenRepository.findByHash(hashToken(refreshToken))
    if (stored) {
      await refreshTokenRepository.revoke(stored.id)
    }
  },

  async me(userId: string): Promise<UserPublicDto> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new UnauthorizedError('Utilisateur introuvable')
    }
    return toUserPublicDto(user)
  },

  issueSession(userId: string): Promise<AuthResponse> {
    return buildAuthResponse(userId)
  },

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserPublicDto> {
    const payload: Prisma.UserUncheckedUpdateInput = {}
    if (data.first_name !== undefined) payload.firstName = data.first_name
    if (data.last_name !== undefined) payload.lastName = data.last_name
    if (data.phone !== undefined) payload.phone = data.phone
    if (data.address !== undefined) payload.address = data.address
    if (data.city !== undefined) payload.city = data.city
    if (data.country !== undefined) payload.country = data.country

    const user = await userRepository.update(userId, payload as Parameters<typeof userRepository.update>[1])
    return toUserPublicDto(user)
  },

  async changePassword(userId: string, data: ChangePasswordDto): Promise<void> {
    const user = await userRepository.findById(userId)
    if (!user?.password) {
      throw new UnauthorizedError('Impossible de modifier le mot de passe de ce compte')
    }

    const valid = await bcrypt.compare(data.currentPassword, user.password)
    if (!valid) {
      throw new BadRequestError('Mot de passe actuel incorrect')
    }

    const passwordHash = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS)
    await userRepository.update(userId, { password: passwordHash })
    await refreshTokenRepository.revokeAllForUser(userId)
  },
}