import { StatusCodes } from 'http-status-codes'

export type HttpErrorOptions = {
  code?: string
  details?: unknown
  expose?: boolean
}

export class HttpError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: unknown
  public readonly expose: boolean

  constructor(status: number, message: string, options: HttpErrorOptions = {}) {
    super(message)
    this.name = new.target.name
    this.status = status
    this.code = options.code ?? String(status)
    this.details = options.details
    this.expose = options.expose ?? (status >= 400 && status < 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Requête invalide', options: HttpErrorOptions = {}) {
    super(StatusCodes.BAD_REQUEST, message, { code: 'BAD_REQUEST', ...options })
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Authentification requise', options: HttpErrorOptions = {}) {
    super(StatusCodes.UNAUTHORIZED, message, { code: 'UNAUTHORIZED', ...options })
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Accès interdit', options: HttpErrorOptions = {}) {
    super(StatusCodes.FORBIDDEN, message, { code: 'FORBIDDEN', ...options })
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Ressource introuvable', options: HttpErrorOptions = {}) {
    super(StatusCodes.NOT_FOUND, message, { code: 'NOT_FOUND', ...options })
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflit avec une ressource existante', options: HttpErrorOptions = {}) {
    super(StatusCodes.CONFLICT, message, { code: 'CONFLICT', ...options })
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Données invalides', details?: unknown) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message, { code: 'VALIDATION_ERROR', details })
  }
}

export class RateLimitError extends HttpError {
  constructor(message = 'Trop de requêtes, veuillez réessayer plus tard') {
    super(StatusCodes.TOO_MANY_REQUESTS, message, { code: 'RATE_LIMITED' })
  }
}