import { Router } from 'express'
import { strictLimiter } from '@/middlewares/rateLimit.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { sendContactMessage } from '@/controllers/contact.controller'
import { contactMessageSchema } from '@/validators/contact.validator'

const router = Router()

router.post('/', strictLimiter, validate(contactMessageSchema), sendContactMessage)

export default router