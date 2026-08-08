import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import { addFavorite, listFavorites, removeFavorite } from '@/controllers/favorite.controller'
import { favoriteParamsSchema } from '@/validators/favorite.validator'

const router = Router()

router.get('/', authenticate, listFavorites)
router.post('/:productId', authenticate, validate(favoriteParamsSchema), addFavorite)
router.delete('/:productId', authenticate, validate(favoriteParamsSchema), removeFavorite)

export default router