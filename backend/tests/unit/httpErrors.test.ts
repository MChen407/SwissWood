import { describe, expect, it } from 'vitest'
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  HttpError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from '@/utils/httpErrors'

describe('httpErrors', () => {
  it('HttpError expose un statut, un code et le message', () => {
    const err = new HttpError(418, 'Teapot', { code: 'TEAPOT' })
    expect(err.status).toBe(418)
    expect(err.code).toBe('TEAPOT')
    expect(err.message).toBe('Teapot')
    expect(err.name).toBe('HttpError')
    expect(err).toBeInstanceOf(Error)
  })

  it('HttpError masque les erreurs 5xx par défaut (expose=false)', () => {
    const err = new HttpError(500, 'secret interne')
    expect(err.expose).toBe(false)
  })

  it('expose true pour les erreurs 4xx', () => {
    const err = new HttpError(400, 'mauvais')
    expect(err.expose).toBe(true)
  })

  it('les sous-classes ont les bons statuts et codes', () => {
    expect(new BadRequestError().status).toBe(400)
    expect(new BadRequestError().code).toBe('BAD_REQUEST')
    expect(new UnauthorizedError().status).toBe(401)
    expect(new UnauthorizedError().code).toBe('UNAUTHORIZED')
    expect(new ForbiddenError().status).toBe(403)
    expect(new ForbiddenError().code).toBe('FORBIDDEN')
    expect(new NotFoundError().status).toBe(404)
    expect(new NotFoundError().code).toBe('NOT_FOUND')
    expect(new ConflictError().status).toBe(409)
    expect(new ConflictError().code).toBe('CONFLICT')
    expect(new ValidationError().status).toBe(422)
    expect(new ValidationError().code).toBe('VALIDATION_ERROR')
    expect(new RateLimitError().status).toBe(429)
    expect(new RateLimitError().code).toBe('RATE_LIMITED')
  })

  it('ValidationError porte les détails', () => {
    const details = [{ field: 'email', message: 'invalide' }]
    const err = new ValidationError('Données invalides', details)
    expect(err.details).toEqual(details)
  })
})