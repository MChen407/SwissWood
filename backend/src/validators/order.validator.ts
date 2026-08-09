import { z } from 'zod'
import { CURRENCIES } from '../constants/index.js'

export const orderItemSchema = z.object({
  productId: z.string().uuid('Identifiant de produit invalide'),
  quantity: z.number().int().min(1, 'Quantité minimale : 1'),
  unit: z.string().trim().min(1).max(20).default('pcs'),
  customization: z.record(z.string(), z.unknown()).default({}),
})

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'La commande est vide'),
    currency: z.enum(CURRENCIES).default('EUR'),
    shipping_address: z
      .object({
        address: z.string().trim().max(255).optional(),
        city: z.string().trim().max(120).optional(),
        country: z.string().trim().max(80).optional(),
        phone: z.string().trim().max(30).optional(),
        notes: z.string().trim().max(500).optional(),
      })
      .default({}),
    notes: z.string().trim().max(2000).optional(),
  }),
})

export const orderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de commande invalide'),
  }),
})

export const initPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de commande invalide'),
  }),
  body: z.object({
    method: z.enum(['card', 'bank_transfer']),
  }),
})

export const confirmPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de commande invalide'),
  }),
})

export type CreateOrderDto = z.infer<typeof createOrderSchema>['body']
export type InitPaymentDto = z.infer<typeof initPaymentSchema>['body']