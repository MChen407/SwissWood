import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ApiError } from '../interfaces/api.interface.js'
import { env } from '../config/env.js'
import { HttpError } from '../utils/httpErrors.js'

export function notFoundHandler(req: Request, res: Response): void {
  const body: ApiError = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route introuvable : ${req.method} ${req.originalUrl}`,
    },
  }
  res.status(StatusCodes.NOT_FOUND).json(body)
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    const details = err.details
    const body: ApiError = {
      success: false,
      error: {
        code: err.code,
        message: err.expose ? err.message : 'Erreur interne du serveur',
        ...(details !== undefined && err.expose ? { details } : {}),
      },
    }
    res.status(err.status).json(body)
    return
  }

  const message = err instanceof Error ? err.message : 'Erreur interne inconnue'
  console.error('💥 Erreur non gérée :', err)

  const body: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : message,
    },
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(body)
}