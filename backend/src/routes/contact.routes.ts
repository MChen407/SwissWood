import { Router } from 'express'
import { strictLimiter } from '../middlewares/rateLimit.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { sendContactMessage } from '../controllers/contact.controller.js'
import { contactMessageSchema } from '../validators/contact.validator.js'

const router = Router()

router.post('/', strictLimiter, validate(contactMessageSchema), sendContactMessage)

export default router