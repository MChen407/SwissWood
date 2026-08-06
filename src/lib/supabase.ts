import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Create a stub client when credentials are missing (dev / preview without Supabase)
const isConfigured = url && key && url !== 'undefined' && key !== 'undefined'

export const supabase = isConfigured
  ? createClient(url, key)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key')

export type Profile = {
  id: string; first_name: string; last_name: string; phone: string
  address: string; city: string; country: string
  role: 'customer' | 'admin' | 'super_admin'
  created_at: string; updated_at: string
}

export type Product = {
  id: string; name: string; slug: string; essence: 'Teck' | 'Iroko' | 'Pin' | 'Sapin'
  description: string; price_eur: number; price_usd: number; price_fcfa: number
  stock: number; dimensions: { length_mm?: number; width_mm?: number; thickness_mm?: number; weight_kg_m3?: number }
  images: string[]; characteristics: Record<string, string>; is_active: boolean
  created_at: string; updated_at: string
}

export type ProductReview = {
  id: string; product_id: string; user_id: string; rating: number; comment: string
  is_approved: boolean; is_rejected: boolean; created_at: string
}

export type Order = {
  id: string; order_number: string; user_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'card' | 'bank_transfer'
  payment_status: 'pending' | 'awaiting_transfer' | 'paid' | 'failed' | 'refunded'
  subtotal_eur: number; total_eur: number; currency: string
  shipping_address: { address?: string; city?: string; country?: string; phone?: string; notes?: string }
  notes: string; created_at: string; updated_at: string
}

export type OrderItem = {
  id: string; order_id: string; product_id: string; quantity: number; unit: string
  unit_price_eur: number; customization: Record<string, string | number>; created_at: string
}

export type Payment = {
  id: string; order_id: string; user_id: string; method: 'card' | 'bank_transfer'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  amount_eur: number; reference: string; metadata: Record<string, unknown>
  created_at: string; updated_at: string
}

export type CartItem = {
  product: Product; quantity: number; unit: string
  customization: Record<string, string | number>
}
