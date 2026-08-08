import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { StatusCodes } from 'http-status-codes'
import { env, corsOrigins } from '@/config/env'
import { prisma } from '@/config/db'
import routes from '@/routes'
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware'
import { generalLimiter } from '@/middlewares/rateLimit.middleware'

export function createApp(): Express {
  const app = express()

  app.set('trust proxy', 1)

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )
  app.use(cors({ origin: corsOrigins, credentials: true }))
  app.use(generalLimiter)
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))
  }

  app.use(env.API_PREFIX, routes)

  app.get('/', (_req, res) => {
    res.status(StatusCodes.OK).json({
      name: 'SwissWood API',
      health: `${env.API_PREFIX}/health`,
      docs: `${env.API_PREFIX}/docs`,
    })
  })

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`
}

export { prisma }