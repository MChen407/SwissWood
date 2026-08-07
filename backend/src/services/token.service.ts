import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '@/config/env'
import type { Role } from '@/constants'

export interface AccessTokenPayload {
  sub: string
  email: string
  role: Role
}

export function generateAccessToken(user: { id: string; email: string; role: Role }): string {
  const payload: AccessTokenPayload = { sub: user.id, email: user.email, role: user.role }
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & AccessTokenPayload
  if (!decoded.sub || !decoded.role) {
    throw new Error('Token invalide')
  }
  return { sub: decoded.sub, email: decoded.email, role: decoded.role }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateRefreshToken(): { token: string; hashed: string } {
  const token = randomBytes(48).toString('hex')
  return { token, hashed: hashToken(token) }
}

const UNIT_TO_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
}

export function durationToMs(value: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(value.trim())
  if (!match) {
    throw new Error(`Durée invalide "${value}"`)
  }
  const amount = Number.parseInt(match[1] ?? '0', 10)
  const unit = match[2] ?? 'ms'
  return amount * UNIT_TO_MS[unit]!
}