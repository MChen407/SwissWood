import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('/api'),
  HOST: z.string().default('0.0.0.0'),

  CORS_ORIGIN: z.string().default('https://swiss-wood.vercel.app'),

  FRONTEND_URL: z.string().default('https://swiss-wood.vercel.app'),

  API_PUBLIC_URL: z.string().default('https://swiss-wood.vercel.app'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requis'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET doit contenir au moins 16 caractères'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET doit contenir au moins 16 caractères'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Configuration d\'environnement invalide :')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data

const parsedCors = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)

export const corsOrigins: string[] = parsedCors.length > 0 ? parsedCors : [env.CORS_ORIGIN]