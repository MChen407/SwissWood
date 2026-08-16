import { z } from 'zod'

export const upsertShippingFeeSchema = z.object({
  body: z.object({
    country: z.string().trim().min(1, 'Le pays est requis').max(80),
    fee_eur: z.number().int().min(0, 'Frais invalide'),
    active: z.boolean().optional().default(true),
  }),
})

export const deleteShippingFeeSchema = z.object({
  body: z.object({
    country: z.string().trim().min(1, 'Le pays est requis').max(80),
  }),
})