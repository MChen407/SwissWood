import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import cmsRoutes from './cms.routes.js'
import orderRoutes from './order.routes.js'
import favoriteRoutes from './favorite.routes.js'
import reviewRoutes from './review.routes.js'
import contactRoutes from './contact.routes.js'
import adminRoutes from './admin.routes.js'
import swaggerRoutes from './swagger.routes.js'

const router = Router()

router.use(healthRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cms', cmsRoutes)
router.use('/orders', orderRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/reviews', reviewRoutes)
router.use('/contact', contactRoutes)
router.use('/admin', adminRoutes)
router.use('/docs', swaggerRoutes)

export default router