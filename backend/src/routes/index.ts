import { Router } from 'express'
import healthRoutes from '@/routes/health.routes'
import authRoutes from '@/routes/auth.routes'
import productRoutes from '@/routes/product.routes'
import cmsRoutes from '@/routes/cms.routes'

const router = Router()

router.use(healthRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cms', cmsRoutes)

export default router