import rateLimit, { type Options } from 'express-rate-limit'
import { env } from '@/config/env'
import { RateLimitError } from '@/utils/httpErrors'

const handleRateLimit: Options['handler'] = (_req, res, options) => {
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
  limit: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
  skipSuccessfulRequests: true,
})

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimit,
})