export const API_PREFIX = '/api'

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ADMIN_ROLES: Role[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN]

export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'] as const
export const ORDER_PAYMENT_STATUSES = ['pending', 'awaiting_transfer', 'paid', 'failed', 'refunded'] as const
export const PAYMENT_METHODS = ['card', 'bank_transfer'] as const
export const PAYMENT_STATUSES = ['pending', 'processing', 'completed', 'failed', 'refunded'] as const
export const PRODUCT_ESSENCES = [
  // Groupe 1 — Feuillus durs
  'Chene',
  'Charme',
  'Hetre',
  'Frene',
  'Orme',
  'Erable',
  'Noyer',
  'Olivier',
  // Groupe 2 — Feuillus mi-durs / intermédiaires
  'Chataignier',
  'Acacia',
  'Bouleau',
  'Merisier',
  'ArbresFruitiers',
  'Robinier',
  // Groupe 3 — Résineux & feuillus tendres
  'Peuplier',
  'Aulne',
  'Tilleul',
  'Saule',
  'Platane',
  'Pin',
  'Sapin',
  'Epicea',
  'Meleze',
] as const
export type ProductEssence = (typeof PRODUCT_ESSENCES)[number]

export const ESSENCE_GROUPS = [
  {
    id: 'feuillus_durs',
    label: 'Feuillus durs',
    essences: ['Chene', 'Charme', 'Hetre', 'Frene', 'Orme', 'Erable', 'Noyer', 'Olivier'] as const,
  },
  {
    id: 'feuillus_mi_durs',
    label: 'Feuillus mi-durs / intermédiaires',
    essences: ['Chataignier', 'Acacia', 'Bouleau', 'Merisier', 'ArbresFruitiers', 'Robinier'] as const,
  },
  {
    id: 'resineux_tendres',
    label: 'Résineux & feuillus tendres',
    essences: ['Peuplier', 'Aulne', 'Tilleul', 'Saule', 'Platane', 'Pin', 'Sapin', 'Epicea', 'Meleze'] as const,
  },
] as const

export const ESSENCE_GROUP_IDS = ['feuillus_durs', 'feuillus_mi_durs', 'resineux_tendres'] as const

export function essenceGroupOf(groupId: string): ProductEssence[] {
  const group = ESSENCE_GROUPS.find((g) => g.id === groupId)
  return group ? [...group.essences] : []
}
export const CURRENCIES = ['EUR', 'USD', 'FCFA'] as const