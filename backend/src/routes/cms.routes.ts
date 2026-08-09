import { Router } from 'express'
import { getCmsContent } from '../controllers/cms.controller.js'

const router = Router()

router.get('/', getCmsContent)

export default router