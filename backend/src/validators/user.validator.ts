import { z } from 'zod'

export const updateProfileSchema = z.object({
  body: z.object({
    first_name: z.string().trim().min(1).max(120).optional(),
    last_name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().max(30).nullable().optional(),
    address: z.string().trim().max(255).nullable().optional(),
    city: z.string().trim().max(120).nullable().optional(),
    country: z.string().trim().max(80).optional(),
  }),
})

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),
  }),
})

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>['body']
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>['body']