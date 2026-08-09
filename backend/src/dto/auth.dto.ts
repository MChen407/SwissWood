import type { Role } from '../constants/index.js'
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

// Format aligné sur le type `Profile` du frontend (snake_case)
export interface UserPublicDto {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  address: string | null
  city: string | null
  country: string
  role: Role
  avatar_url: string | null
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export function toUserPublicDto(user: User): UserPublicDto {
  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    address: user.address,
    city: user.city,
    country: user.country,
    role: user.role,
    avatar_url: user.avatarUrl,
    email_verified: user.emailVerified,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  }
}