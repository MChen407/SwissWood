export type NavLink = { label: string; to: string }

export const navLinks: NavLink[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
]

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'text-warning-500 bg-warning-100',
  confirmed: 'text-success-500 bg-success-100',
  preparing: 'text-primary-500 bg-primary-100',
  shipped: 'text-primary-500 bg-primary-100',
  delivered: 'text-success-500 bg-success-100',
  cancelled: 'text-error-500 bg-error-100',
}
