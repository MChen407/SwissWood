import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createReview, listMyReviews } from '../controllers/review.controller.js'
import { createReviewSchema } from '../validators/review.validator.js'

const router = Router()

router.use(authenticate)

router.post('/', validate(createReviewSchema), createReview)
router.get('/mine', listMyReviews)

export default router