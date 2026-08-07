import { Router } from 'express'
import { getCmsContent } from '@/controllers/cms.controller'

const router = Router()

router.get('/', getCmsContent)

export default router