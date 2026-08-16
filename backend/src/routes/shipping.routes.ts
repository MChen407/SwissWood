import { Router } from 'express'
import { listShippingRates } from '../controllers/shippingFee.controller.js'

const router = Router()

router.get('/rates', listShippingRates)

export default router