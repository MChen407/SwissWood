import { z } from 'zod'
import { ORDER_PAYMENT_STATUSES, ORDER_STATUSES, PRODUCT_ESSENCES, ROLES } from '@/constants'

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Le nom est requis').max(200),
    slug: z.string().trim().min(1).max(200).optional(),
    essence: z.enum(PRODUCT_ESSENCES),
    description: z.string().trim().default(''),
    price_eur: z.number().int().min(0, 'Prix EUR invalide'),
    price_usd: z.number().int().min(0, 'Prix USD invalide'),
    price_fcfa: z.number().int().min(0, 'Prix FCFA invalide'),
    stock: z.number().int().min(0, 'Stock invalide'),
    dimensions: z.record(z.string(), z.unknown()).default({}),
    images: z.array(z.string().trim().min(1)).default([]),
    characteristics: z.record(z.string(), z.unknown()).default({}),
    is_active: z.boolean().default(true),
  }),
})

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant de produit invalide') }),
  body: z.object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(200).optional(),
    essence: z.enum(PRODUCT_ESSENCES).optional(),
    description: z.string().trim().optional(),
    price_eur: z.number().int().min(0).optional(),
    price_usd: z.number().int().min(0).optional(),
    price_fcfa: z.number().int().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    dimensions: z.record(z.string(), z.unknown()).optional(),
    images: z.array(z.string().trim().min(1)).optional(),
    characteristics: z.record(z.string(), z.unknown()).optional(),
    is_active: z.boolean().optional(),
  }),
})

export const productParamsSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant de produit invalide') }),
})

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant de commande invalide') }),
  body: z.object({ status: z.enum(ORDER_STATUSES) }),
})

export const updateOrderPaymentSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant de commande invalide') }),
  body: z.object({ payment_status: z.enum(ORDER_PAYMENT_STATUSES) }),
})

export const updateCmsSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant CMS invalide') }),
  body: z.object({
    value: z.string().optional(),
    label: z.string().trim().max(200).optional(),
  }),
})

export const updateUserRoleSchema = z.object({
  params: z.object({ id: z.string().uuid('Identifiant utilisateur invalide') }),
  body: z.object({ role: z.enum([ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN]) }),
})

export type CreateProductDto = z.infer<typeof createProductSchema>['body']
export type UpdateProductDto = z.infer<typeof updateProductSchema>['body']