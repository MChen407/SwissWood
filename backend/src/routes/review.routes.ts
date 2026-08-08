import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { createReview, listMyReviews } from '@/controllers/review.controller'
import { createReviewSchema } from '@/validators/review.validator'

const router = Router()

router.use(authenticate)

router.post('/', validate(createReviewSchema), createReview)
router.get('/mine', listMyReviews)

export default router