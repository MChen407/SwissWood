export type NavLink = { key: string; to: string }

export const navLinks: NavLink[] = [
  { key: 'home', to: '/' },
  { key: 'catalogue', to: '/catalogue' },
  { key: 'about', to: '/a-propos' },
  { key: 'contact', to: '/contact' },
]

export const STATUS_KEYS: Record<string, string> = {
  pending: 'pending', confirmed: 'confirmed', preparing: 'preparing',
  shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'text-warning-500 bg-warning-100',
  confirmed: 'text-success-500 bg-success-100',
  preparing: 'text-primary-500 bg-primary-100',
  shipped: 'text-primary-500 bg-primary-100',
  delivered: 'text-success-500 bg-success-100',
  cancelled: 'text-error-500 bg-error-100',
}