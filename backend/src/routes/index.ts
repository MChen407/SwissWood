import { Router } from 'express'
import healthRoutes from '@/routes/health.routes'
import authRoutes from '@/routes/auth.routes'
import productRoutes from '@/routes/product.routes'
import cmsRoutes from '@/routes/cms.routes'
import orderRoutes from '@/routes/order.routes'
import favoriteRoutes from '@/routes/favorite.routes'
import reviewRoutes from '@/routes/review.routes'
import contactRoutes from '@/routes/contact.routes'
import adminRoutes from '@/routes/admin.routes'
import swaggerRoutes from '@/routes/swagger.routes'

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