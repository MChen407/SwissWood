import { describe, expect, it } from 'vitest'
import {
  durationToMs,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
} from '@/services/token.service'

describe('token.service', () => {
  const user = { id: 'abc-123', email: 'test@swisswood.ch', role: 'customer' as const }

  it('génère et vérifie un access token', () => {
    const token = generateAccessToken(user)
    expect(token).toEqual(expect.any(String))
    const payload = verifyAccessToken(token)
    expect(payload.sub).toBe(user.id)
    expect(payload.email).toBe(user.email)
    expect(payload.role).toBe(user.role)
  })

  it('rejette un access token invalide', () => {
    expect(() => verifyAccessToken('not-a-jwt')).toThrow()
  })

  it('rejette un access token signé avec un autre secret', () => {
    // Simule un jeton falsifié : contenu JSON en base64 non signé
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({ sub: user.id, role: 'admin' })).toString('base64url')
    expect(() => verifyAccessToken(`${header}.${payload}.fake-signature`)).toThrow()
  })

  it('génère un refresh token aléatoire et son hash', () => {
    const { token, hashed } = generateRefreshToken()
    expect(token).toBeTruthy()
    expect(hashed).toBe(hashToken(token))
    expect(hashed).not.toBe(token)
  })

  it('hashToken est déterministe pour une même entrée', () => {
    expect(hashToken('x')).toBe(hashToken('x'))
    expect(hashToken('x')).not.toBe(hashToken('y'))
  })

  it('convertis les durées en millisecondes', () => {
    expect(durationToMs('500ms')).toBe(500)
    expect(durationToMs('10s')).toBe(10000)
    expect(durationToMs('5m')).toBe(5 * 60_000)
    expect(durationToMs('2h')).toBe(2 * 3_600_000)
    expect(durationToMs('3d')).toBe(3 * 86_400_000)
    expect(durationToMs('250')).toBe(250)
  })

  it('lève une erreur sur une durée invalide', () => {
    expect(() => durationToMs('abc')).toThrow()
  })
})