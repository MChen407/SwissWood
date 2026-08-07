import type { NextFunction, Request, Response } from 'express'
import type { Role } from '@/constants'
import { ForbiddenError, UnauthorizedError } from '@/utils/httpErrors'

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentification requise'))
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Accès interdit pour ce rôle'))
    }
    next()
  }
}