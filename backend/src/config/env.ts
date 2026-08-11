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

  API_PUBLIC_URL: z.string().default('https://swisswood-production.up.railway.app'),

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

  // ===== E-mail (SMTP) : si SMTP_HOST absent, les e-mails sont simulés (console) =====
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('SwissWood <no-reply@swisswood.ch>'),

  // ===== Coordonnées bancaires pour les instructions de virement =====
  BANK_OWNER: z.string().default('SwissWood SA'),
  BANK_IBAN: z.string().default('CH00 0000 0000 0000 0000 0'),
  BANK_BIC: z.string().default('SWISCHZZ'),

  // ===== Code de sécurité 3DS (simulation SMS) =====
  PAYMENT_CODE_SECRET: z
    .string()
    .default('dev-insecure-payment-code-secret'),
  PAYMENT_CODE_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  PAYMENT_CODE_MAX_ATTEMPTS: z.coerce.number().int().min(1).default(3),

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