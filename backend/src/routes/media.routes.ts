import { Router } from 'express'
import { getMedia } from '../controllers/media.controller.js'

const router = Router()

router.get('/:id', getMedia)

export default router
