import type { Role } from '@/constants'
import type { User } from '@prisma/client'

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface AuthResponse {
  user: UserPublicDto
  tokens: TokenPair
}

export interface UserPublicDto {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  address: string | null
  city: string | null
  country: string
  role: Role
  avatarUrl: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export function toUserPublicDto(user: User): UserPublicDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    city: user.city,
    country: user.country,
    role: user.role,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}