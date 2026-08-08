import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from '@/config/swagger'

const router = Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDocument))
router.get('/json', (_req, res) => {
  res.json(swaggerDocument)
})

export default router