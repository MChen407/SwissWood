import type { NextFunction, Request, Response } from 'express'
import type { Role } from '../constants/index.js'
import { verifyAccessToken } from '../services/token.service.js'
import { UnauthorizedError } from '../utils/httpErrors.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: Role
      }
    }
  }
}

export function getBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return undefined
  return header.slice(7).trim()
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = getBearerToken(req)
  if (!token) {
    return next(new UnauthorizedError('Authentification requise'))
  }

  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, email: payload.email, role: payload.role }
    next()
  } catch {
    next(new UnauthorizedError('Token invalide ou expiré'))
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = getBearerToken(req)
  if (!token) {
    return next()
  }
  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, email: payload.email, role: payload.role }
  } catch {
    // token invalide => traité comme anonyme
  }
  next()
}