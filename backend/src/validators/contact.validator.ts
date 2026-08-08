import { z } from 'zod'

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Le nom est requis').max(120),
    email: z.string().trim().email('Adresse email invalide'),
    subject: z.string().trim().min(1, 'Le sujet est requis').max(200),
    message: z.string().trim().min(1, 'Le message est requis').max(5000),
  }),
})

export type ContactMessageDto = z.infer<typeof contactMessageSchema>['body']