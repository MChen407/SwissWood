import { z } from 'zod'

const email = z.string().trim().toLowerCase().email('Adresse email invalide')

export const registerSchema = z.object({
  body: z.object({
    email,
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),
    firstName: z.string().trim().min(1, 'Le prénom est requis').max(120),
    lastName: z.string().trim().min(1, 'Le nom est requis').max(120),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: email,
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
})

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token requis'),
  }),
})

export const googleTokenSchema = z.object({
  query: z.object({
    code: z.string().min(1, 'Code d’autorisation requis'),
  }),
})

export type RegisterDto = z.infer<typeof registerSchema>['body']
export type LoginDto = z.infer<typeof loginSchema>['body']