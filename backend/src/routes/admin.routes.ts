import { Router, type RequestHandler } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { requireRole } from '@/middlewares/rbac.middleware'
import { ROLES } from '@/constants'
import { validate } from '@/middlewares/validate.middleware'
import { getStats, listClients, listPayments, updateClientRole } from '@/controllers/admin.controller'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
} from '@/controllers/product.controller'
import {
  adminListOrders,
  adminUpdateOrderPayment,
  adminUpdateOrderStatus,
} from '@/controllers/order.controller'
import { approveReview, listAllReviews, rejectReview } from '@/controllers/review.controller'
import { getCmsContent, updateCmsContent } from '@/controllers/cms.controller'
import {
  createProductSchema,
  productParamsSchema,
  updateCmsSchema,
  updateOrderPaymentSchema,
  updateOrderStatusSchema,
  updateProductSchema,
  updateUserRoleSchema,
} from '@/validators/admin.validator'
import { reviewParamsSchema } from '@/validators/review.validator'

const router = Router()

const admin: RequestHandler[] = [authenticate, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)]
router.use(admin)

router.get('/stats', getStats)
router.get('/payments', listPayments)

router.get('/clients', listClients)
router.patch('/clients/:id/role', validate(updateUserRoleSchema), updateClientRole)

router.get('/products', adminListProducts)
router.post('/products', validate(createProductSchema), adminCreateProduct)
router.patch('/products/:id', validate(updateProductSchema), adminUpdateProduct)
router.delete('/products/:id', validate(productParamsSchema), adminDeleteProduct)

router.get('/orders', adminListOrders)
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), adminUpdateOrderStatus)
router.patch('/orders/:id/payment', validate(updateOrderPaymentSchema), adminUpdateOrderPayment)

router.get('/reviews', listAllReviews)
router.patch('/reviews/:id/approve', validate(reviewParamsSchema), approveReview)
router.patch('/reviews/:id/reject', validate(reviewParamsSchema), rejectReview)

router.get('/cms', getCmsContent)
router.patch('/cms/:id', validate(updateCmsSchema), updateCmsContent)

export default router