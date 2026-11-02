import rateLimit, { type Options } from 'express-rate-limit'
import { env } from '../config/env.js'
import { RateLimitError } from '../utils/httpErrors.js'

const handleRateLimit: Options['handler'] = (_req, res, _next, options) => {
  const err = new RateLimitError(options.message)
  res.status(err.status).json({
    success: false,
    error: { code: err.code, message: err.message },
  })
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
})

export const loginLimiter = rateLimit({
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase() : 'unknown'
    return `${req.ip}:${email}`
  },
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Trop de tentatives de connexion. Réessayez plus tard.',
    },
  },
})

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
})

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
})

export const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
})
