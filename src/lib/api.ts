// =====================================================================
// SwissWood — Client REST
// fetch + JWT (access/refresh) stocké en localStorage + refresh automatique.
// Les réponses sont dé-enveloppées ({ success, data } → data) et typées
// selon les DTOs du backend (snake_case). Chaque méthode envoie le body
// exact attendu par l'API (camelCase ou snake_case selon l'endpoint).
// =====================================================================

const DEFAULT_BASE_URL = 'http://localhost:4000/api'

export const ACCESS_TOKEN_KEY = 'swisswood_access_token'
export const REFRESH_TOKEN_KEY = 'swisswood_refresh_token'

export const apiBaseUrl: string = (import.meta.env.VITE_API_URL as string | undefined) || DEFAULT_BASE_URL

// =====================================================================
// Erreur d'API
// =====================================================================

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

// =====================================================================
// Gestion des tokens (localStorage)
// =====================================================================

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}

export function resolveImageUrl(image: string): string {
  if (!image) return ''

  // URL complète (ex. image externe ou Cloudinary)
  if (image.startsWith('http://') || image.startsWith('https://')) return image

  // Sinon, l'URL est telle quelle
  return image
}



// =====================================================================
// Types DTO (alignés sur le backend)
// =====================================================================

export type Role = 'customer' | 'admin' | 'super_admin'
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

export interface EssenceGroup {
  id: string
  label: string
  essences: ProductEssence[]
}

export const ESSENCE_GROUPS: EssenceGroup[] = [
  {
    id: 'feuillus_durs',
    label: 'Feuillus durs',
    essences: ['Chene', 'Charme', 'Hetre', 'Frene', 'Orme', 'Erable', 'Noyer', 'Olivier'],
  },
  {
    id: 'feuillus_mi_durs',
    label: 'Feuillus mi-durs / intermédiaires',
    essences: ['Chataignier', 'Acacia', 'Bouleau', 'Merisier', 'ArbresFruitiers', 'Robinier'],
  },
  {
    id: 'resineux_tendres',
    label: 'Résineux & feuillus tendres',
    essences: ['Peuplier', 'Aulne', 'Tilleul', 'Saule', 'Platane', 'Pin', 'Sapin', 'Epicea', 'Meleze'],
  },
]

export const PRODUCT_ESSENCE_LABELS: Record<ProductEssence, string> = {
  Chene: 'Chêne',
  Charme: 'Charme',
  Hetre: 'Hêtre',
  Frene: 'Frêne',
  Orme: 'Orme',
  Erable: 'Érable',
  Noyer: 'Noyer',
  Olivier: 'Olivier',
  Chataignier: 'Châtaignier',
  Acacia: 'Acacia',
  Bouleau: 'Bouleau',
  Merisier: 'Merisier',
  ArbresFruitiers: 'Arbres fruitiers',
  Robinier: 'Robinier',
  Peuplier: 'Peuplier',
  Aulne: 'Aulne',
  Tilleul: 'Tilleul',
  Saule: 'Saule',
  Platane: 'Platane',
  Pin: 'Pin',
  Sapin: 'Sapin',
  Epicea: 'Epicéa',
  Meleze: 'Mélèze',
}
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type OrderPaymentStatus = 'pending' | 'awaiting_transfer' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'card' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type Currency = 'EUR' | 'USD' | 'FCFA'

export interface UserPublicDto {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  address: string | null
  city: string | null
  country: string
  role: Role
  avatar_url: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface AuthResponse {
  user: UserPublicDto
  tokens: TokenPair
}

export interface EssenceDataDto {
  label: string
  densite_vert_kg_m3: number
  densite_sec_kg_m3: number
  pouvoir_calorifique: number
}

export interface ProductDto {
  id: string
  name: string
  slug: string
  essence: ProductEssence
  essence_data?: EssenceDataDto
  description: string
  price_eur: number
  price_usd: number
  price_fcfa: number
  stock: number
  dimensions: {
    length_mm?: number
    width_mm?: number
    thickness_mm?: number
    weight_kg_m3?: number
    weight_kg?: number
  }
  images: string[]
  characteristics: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductListResponse {
  items: ProductDto[]
  total: number
  limit: number
  offset: number
}

export interface ShippingRate {
  country: string
  fee_eur: number
}

export interface AdminShippingFee extends ShippingRate {
  active: boolean
}

export interface ReviewAuthorDto {
  id: string
  first_name: string
  last_name: string
}

export interface ProductReviewDto {
  id: string
  product_id: string
  user_id: string
  user?: ReviewAuthorDto
  rating: number
  comment: string
  is_approved: boolean
  is_rejected: boolean
  created_at: string
}

export interface LatestReviewDto extends ProductReviewDto {
  user: ReviewAuthorDto
  product: { id: string; name: string; slug: string }
}

export interface CmsContentDto {
  id: string
  key: string
  value: string
  type: string
  label: string
  updated_at: string
}

export interface OrderDto {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: OrderPaymentStatus
  subtotal_eur: number
  shipping_fee_eur: number
  shipping_weight_kg: number
  total_eur: number
  currency: string
  shipping_address: Record<string, unknown>
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItemDto {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit: string
  unit_price_eur: number
  unit_price_usd?: number
  unit_price_fcfa?: number
  customization: Record<string, unknown>
  created_at: string
  product?: { id: string; name: string; slug: string; images: string[] }
}

export interface PaymentDto {
  id: string
  order_id: string
  user_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount_eur: number
  reference: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface OrderDetailDto extends OrderDto {
  items: OrderItemDto[]
  payments: PaymentDto[]
}

export interface FavoriteItemDto {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product: ProductDto
}

export interface AdminStatsDto {
  revenue: number
  orders: number
  customers: number
  products: number
  recent_orders: OrderDto[]
}

export interface AdminPaymentDto {
  id: string
  order_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount_eur: number
  reference: string
  created_at: string
  updated_at: string
  order_number: string
}

export interface AdminReviewDto extends ProductReviewDto {
  product: { id: string; name: string; slug: string }
}

export interface ContactMessageResult {
  id: string
  status: string
  created_at: string
}

export interface CartItem {
  product: ProductDto
  quantity: number
  unit: string
  customization: Record<string, string | number>
}

// =====================================================================
// Types d'entrée (bodies)
// =====================================================================

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface UpdateProfileInput {
  first_name?: string
  last_name?: string
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface OrderItemInput {
  productId: string
  quantity: number
  unit?: string
  customization?: Record<string, unknown>
}

export interface CreateOrderInput {
  items: OrderItemInput[]
  currency?: Currency
  shipping_address?: {
    address?: string
    city?: string
    country?: string
    phone?: string
    notes?: string
  }
  notes?: string
}

export interface InitPaymentInput {
  method: PaymentMethod
}

export interface CreateReviewInput {
  productId: string
  rating: number
  comment?: string
}

export interface ContactMessageInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface AdminProductInput {
  name: string
  slug?: string
  essence: ProductEssence
  description?: string
  price_eur: number
  price_usd: number
  price_fcfa: number
  stock: number
  dimensions?: Record<string, unknown>
  images?: string[]
  characteristics?: Record<string, unknown>
  is_active?: boolean
}

export type ProductListQuery = {
  essence?: ProductEssence
  group?: string
  exclude?: string
  active?: boolean
  sort?: 'price_asc' | 'price_desc'
  limit?: number
  offset?: number
}

// =====================================================================
// Core HTTP
// =====================================================================

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, unknown>
  auth?: boolean
  retryOnUnauthorized?: boolean
}

interface ApiSuccess<T> {
  success: true
  data: T
}

interface ApiErrorBody {
  success: false
  error: { code: string; message: string; details?: unknown }
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiErrorBody

let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false
    try {
      const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) return false
      const envelope = (await res.json()) as ApiEnvelope<AuthResponse>
      if (!envelope.success) return false
      setTokens(envelope.data.tokens.accessToken, envelope.data.tokens.refreshToken)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

function buildQueryString(query?: RequestOptions['query']): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true, retryOnUnauthorized = true } = options
  const url = `${apiBaseUrl}${path}${buildQueryString(query)}`
  const headers: Record<string, string> = { Accept: 'application/json' }
  const isFormData = body instanceof FormData
  const hasBody = body !== undefined
  if (hasBody && !isFormData) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const fetchBody = isFormData ? body : hasBody ? JSON.stringify(body) : undefined

  let res = await fetch(url, {
    method,
    headers,
    ...(fetchBody !== undefined ? { body: fetchBody as BodyInit } : {}),
  })

  if (res.status === 401 && auth && retryOnUnauthorized && getRefreshToken()) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      const newToken = getAccessToken()
      if (newToken) {
        res = await fetch(url, {
          method,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
          ...(fetchBody !== undefined ? { body: fetchBody as BodyInit } : {}),
        })
      }
    }
  }

  const contentType = res.headers.get('content-type') ?? ''
  const payload: ApiEnvelope<T> | null = contentType.includes('application/json') ? ((await res.json()) as ApiEnvelope<T>) : null

  if (!res.ok || !payload) {
    if (res.status === 401 && auth) {
      clearTokens()
      throw new ApiError(res.status, 'UNAUTHORIZED', 'Session expirée, veuillez vous reconnecter')
    }
    const error = payload && !payload.success ? payload.error : undefined
    throw new ApiError(
      res.status,
      error?.code ?? 'HTTP_ERROR',
      error?.message ?? `Erreur HTTP ${res.status}`,
      error?.details
    )
  }

  if (!payload.success) {
    throw new ApiError(res.status, payload.error.code, payload.error.message, payload.error.details)
  }

  return payload.data
}

// =====================================================================
// Client typé par endpoint
// =====================================================================

export const api = {
  // ---------- Auth ----------
  auth: {
    register: (input: RegisterInput) => request<AuthResponse>('/auth/register', { method: 'POST', body: input, auth: false }),
    login: (input: LoginInput) => request<AuthResponse>('/auth/login', { method: 'POST', body: input, auth: false }),
    logout: (refreshToken?: string) =>
      request<null>('/auth/logout', { method: 'POST', body: refreshToken ? { refreshToken } : {}, auth: false }),
    me: () => request<UserPublicDto>('/auth/me'),
    updateProfile: (input: UpdateProfileInput) => request<UserPublicDto>('/auth/me', { method: 'PATCH', body: input }),
    changePassword: (input: ChangePasswordInput) => request<null>('/auth/me/change-password', { method: 'POST', body: input }),
    googleStatus: () => request<{ url: string }>('/auth/google/status', { auth: false }),
  },

  // ---------- Products ----------
  products: {
    list: (query: ProductListQuery = {}) => request<ProductListResponse>('/products', { query, auth: false }),
    featured: (limit = 6) => request<ProductDto[]>('/products/featured', { query: { limit }, auth: false }),
    bySlug: (slug: string) => request<ProductDto>(`/products/${encodeURIComponent(slug)}`, { auth: false }),
    reviews: (productId: string) => request<ProductReviewDto[]>(`/products/${encodeURIComponent(productId)}/reviews`, { auth: false }),
  },

  // ---------- Orders ----------
  orders: {
    create: (input: CreateOrderInput) => request<OrderDto>('/orders', { method: 'POST', body: input }),
    listMine: () => request<OrderDto[]>('/orders'),
    getMine: (id: string) => request<OrderDetailDto>(`/orders/${encodeURIComponent(id)}`),
    initPayment: (id: string, input: InitPaymentInput) =>
      request<{ order: OrderDto; payment: PaymentDto }>(`/orders/${encodeURIComponent(id)}/payment`, { method: 'POST', body: input }),
    confirmPayment: (id: string, code?: string) =>
      request<OrderDto>(`/orders/${encodeURIComponent(id)}/payment/confirm`, { method: 'POST', body: code ? { code } : {} }),
    resendCode: (id: string) =>
      request<{ message: string }>(`/orders/${encodeURIComponent(id)}/payment/resend-code`, { method: 'POST' }),
  },

  // ---------- Favorites ----------
  favorites: {
    list: () => request<FavoriteItemDto[]>('/favorites'),
    add: (productId: string) => request<FavoriteItemDto>(`/favorites/${encodeURIComponent(productId)}`, { method: 'POST' }),
    remove: (productId: string) => request<null>(`/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
  },

  // ---------- Reviews ----------
  reviews: {
    create: (input: CreateReviewInput) => request<ProductReviewDto>('/reviews', { method: 'POST', body: input }),
    listMine: () => request<ProductReviewDto[]>('/reviews/mine'),
    latest: (limit = 5) => request<LatestReviewDto[]>('/reviews/latest', { query: { limit }, auth: false }),
  },

  // ---------- Contact ----------
  contact: {
    send: (input: ContactMessageInput) => request<ContactMessageResult>('/contact', { method: 'POST', body: input, auth: false }),
  },

  // ---------- CMS ----------
  cms: {
    get: () => request<CmsContentDto[]>('/cms', { auth: false }),
  },

  // ---------- Shipping ----------
  shipping: {
    rates: () => request<{ rates: ShippingRate[] }>('/shipping/rates', { auth: false }),
  },

  // ---------- Admin ----------
  admin: {
    stats: () => request<AdminStatsDto>('/admin/stats'),
    payments: () => request<AdminPaymentDto[]>('/admin/payments'),
    clients: () => request<UserPublicDto[]>('/admin/clients'),
    updateClientRole: (id: string, role: Role) =>
      request<UserPublicDto>(`/admin/clients/${encodeURIComponent(id)}/role`, { method: 'PATCH', body: { role } }),
    listProducts: () => request<ProductDto[]>('/admin/products'),
    createProduct: (input: AdminProductInput) => request<ProductDto>('/admin/products', { method: 'POST', body: input }),
    updateProduct: (id: string, input: Partial<AdminProductInput>) =>
      request<ProductDto>(`/admin/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: input }),
    deleteProduct: (id: string) => request<null>(`/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    listOrders: () => request<OrderDto[]>('/admin/orders'),
    updateOrderStatus: (id: string, status: OrderStatus) =>
      request<OrderDto>(`/admin/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { status } }),
    updateOrderPayment: (id: string, payment_status: OrderPaymentStatus) =>
      request<OrderDto>(`/admin/orders/${encodeURIComponent(id)}/payment`, { method: 'PATCH', body: { payment_status } }),
    listReviews: () => request<AdminReviewDto[]>('/admin/reviews'),
    approveReview: (id: string) => request<ProductReviewDto>(`/admin/reviews/${encodeURIComponent(id)}/approve`, { method: 'PATCH', body: {} }),
    rejectReview: (id: string) => request<ProductReviewDto>(`/admin/reviews/${encodeURIComponent(id)}/reject`, { method: 'PATCH', body: {} }),
    getCms: () => request<CmsContentDto[]>('/admin/cms'),
    updateCms: (id: string, input: { value?: string; label?: string }) =>
      request<CmsContentDto>(`/admin/cms/${encodeURIComponent(id)}`, { method: 'PATCH', body: input }),
    uploadImages: (files: File[]) => {
      const formData = new FormData()
      for (const file of files) formData.append('images', file)
      return request<{ urls: string[]; publicIds: string[] }>('/admin/uploads/images', {
        method: 'POST',
        body: formData,
      })
    },
    deleteImage: (publicId: string) =>
      request<{ deleted: string }>(`/admin/uploads/images/${encodeURIComponent(publicId)}`, { method: 'DELETE' }),
    listShippingFees: () => request<{ fees: AdminShippingFee[] }>('/admin/shipping'),
    upsertShippingFee: (input: { country: string; fee_eur: number; active?: boolean }) =>
      request<{ fee: AdminShippingFee }>('/admin/shipping', { method: 'PUT', body: input }),
    deleteShippingFee: (country: string) =>
      request<{ deleted: string }>('/admin/shipping', { method: 'DELETE', body: { country } }),
  },
}
