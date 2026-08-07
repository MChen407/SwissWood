import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { loginLimiter } from '@/middlewares/rateLimit.middleware'
import { validate } from '@/middlewares/validate.middleware'
import {
  googleCallback,
  googleRedirect,
  googleStatus,
  login,
  logout,
  refresh,
  register,
} from '@/controllers/auth.controller'
import { registerSchema, loginSchema, refreshTokenSchema } from '@/validators/auth.validator'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/refresh', validate(refreshTokenSchema), refresh)
router.post('/logout', logout)
router.get('/me', authenticate, me)

// OAuth Google
router.get('/google', googleRedirect)
router.get('/google/callback', googleCallback)
router.get('/google/status', googleStatus)

export default router