import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { loginLimiter, refreshLimiter, registerLimiter } from '../middlewares/rateLimit.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  changePassword,
  googleCallback,
  googleRedirect,
  googleStatus,
  login,
  logout,
  me,
  refresh,
  register,
  updateProfile,
} from '../controllers/auth.controller.js'
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator.js'
import { changePasswordSchema, updateProfileSchema } from '../validators/user.validator.js'

const router = Router()

router.post('/register', registerLimiter, validate(registerSchema), register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/refresh', refreshLimiter, validate(refreshTokenSchema), refresh)
router.post('/logout', logout)
router.get('/me', authenticate, me)
router.patch('/me', authenticate, validate(updateProfileSchema), updateProfile)
router.post('/me/change-password', authenticate, validate(changePasswordSchema), changePassword)

// OAuth Google
router.get('/google', googleRedirect)
router.get('/google/callback', googleCallback)
router.get('/google/status', googleStatus)

export default router