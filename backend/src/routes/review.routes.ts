import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createReview, listLatestReviews, listMyReviews } from '../controllers/review.controller.js'
import { createReviewSchema } from '../validators/review.validator.js'

const router = Router()

router.get('/latest', listLatestReviews)

router.use(authenticate)

router.post('/', validate(createReviewSchema), createReview)
router.get('/mine', listMyReviews)

export default router