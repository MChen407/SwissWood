import { Router } from 'express'
import { authenticate } from '@/middlewares/auth.middleware'
import { validate } from '@/middlewares/validate.middleware'
import {
  confirmPayment,
  createOrder,
  getMyOrder,
  initPayment,
  listMyOrders,
} from '@/controllers/order.controller'
import {
  confirmPaymentSchema,
  createOrderSchema,
  initPaymentSchema,
  orderByIdSchema,
} from '@/validators/order.validator'

const router = Router()

router.post('/', authenticate, validate(createOrderSchema), createOrder)
router.get('/', authenticate, listMyOrders)
router.get('/:id', authenticate, validate(orderByIdSchema), getMyOrder)
router.post('/:id/payment', authenticate, validate(initPaymentSchema), initPayment)
router.post('/:id/payment/confirm', authenticate, validate(confirmPaymentSchema), confirmPayment)

export default router