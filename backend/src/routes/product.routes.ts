import { Router } from 'express'
import { validate } from '../middlewares/validate.middleware.js'
import { featuredProducts, getProductBySlug, listProducts, productReviews } from '../controllers/product.controller.js'
import { listProductsSchema, productBySlugSchema, productReviewsSchema } from '../validators/product.validator.js'

const router = Router()

router.get('/', validate(listProductsSchema), listProducts)
router.get('/featured', featuredProducts)
router.get('/:id/reviews', validate(productReviewsSchema), productReviews)
router.get('/:slug', validate(productBySlugSchema), getProductBySlug)

export default router