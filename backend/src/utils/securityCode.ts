import { createHmac, randomInt } from 'crypto'
import { env } from '../config/env.js'

export function generateSecurityCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashSecurityCode(code: string): string {
  return createHmac('sha256', env.PAYMENT_CODE_SECRET).update(code).digest('hex')
}

export function codeType(): { ttlMs: number; maxAttempts: number } {
  return {
    ttlMs: env.PAYMENT_CODE_TTL_MINUTES * 60_000,
    maxAttempts: env.PAYMENT_CODE_MAX_ATTEMPTS,
  }
}