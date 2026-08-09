import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favorite.controller.js'
import { favoriteParamsSchema } from '../validators/favorite.validator.js'

const router = Router()

router.get('/', authenticate, listFavorites)
router.post('/:productId', authenticate, validate(favoriteParamsSchema), addFavorite)
router.delete('/:productId', authenticate, validate(favoriteParamsSchema), removeFavorite)

export default router