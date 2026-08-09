import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  confirmPayment,
  createOrder,
  getMyOrder,
  initPayment,
  listMyOrders,
} from '../controllers/order.controller.js'
import {
  confirmPaymentSchema,
  createOrderSchema,
  initPaymentSchema,
  orderByIdSchema,
} from '../validators/order.validator.js'

const router = Router()

router.post('/', authenticate, validate(createOrderSchema), createOrder)
router.get('/', authenticate, listMyOrders)
router.get('/:id', authenticate, validate(orderByIdSchema), getMyOrder)
router.post('/:id/payment', authenticate, validate(initPaymentSchema), initPayment)
router.post('/:id/payment/confirm', authenticate, validate(confirmPaymentSchema), confirmPayment)

export default router