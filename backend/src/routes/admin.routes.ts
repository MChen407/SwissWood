import { Router, type RequestHandler } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/rbac.middleware.js'
import { ROLES } from '../constants/index.js'
import { validate } from '../middlewares/validate.middleware.js'
import { getStats, listClients, listPayments, updateClientRole } from '../controllers/admin.controller.js'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
} from '../controllers/product.controller.js'
import {
  adminListOrders,
  adminUpdateOrderPayment,
  adminUpdateOrderStatus,
} from '../controllers/order.controller.js'
import { approveReview, listAllReviews, rejectReview } from '../controllers/review.controller.js'
import { deleteImageController, uploadImagesController } from '../controllers/upload.controller.js'
import { uploadImages } from '../config/upload.js'
import { getCmsContent, updateCmsContent } from '../controllers/cms.controller.js'
import {
  createProductSchema,
  productParamsSchema,
  updateCmsSchema,
  updateOrderPaymentSchema,
  updateOrderStatusSchema,
  updateProductSchema,
  updateUserRoleSchema,
} from '../validators/admin.validator.js'
import { reviewParamsSchema } from '../validators/review.validator.js'

const router = Router()

const admin: RequestHandler[] = [authenticate, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)]
router.use(admin)

router.get('/stats', getStats)
router.get('/payments', listPayments)

router.get('/clients', listClients)
router.patch('/clients/:id/role', requireRole(ROLES.SUPER_ADMIN), validate(updateUserRoleSchema), updateClientRole)

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

router.post('/uploads/images', uploadImages.array('images'), uploadImagesController)
router.delete('/uploads/images/*', deleteImageController)

export default router