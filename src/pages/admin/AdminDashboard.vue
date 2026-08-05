<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, Package, Users, DollarSign, ShoppingCart } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { STATUS_LABELS } from '@/types/index'

const stats = ref({ revenue: 0, orders: 0, customers: 0, products: 0 })
const recentOrders = ref<{ order_number: string; total_eur: number; status: string; created_at: string }[]>([])
const loading = ref(true)

onMounted(async () => {
  const [{ data: orders }, { count: oc }, { count: cc }, { count: pc }] = await Promise.all([
    supabase.from('orders').select('order_number, total_eur, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])
  stats.value.orders = oc || 0
  stats.value.customers = cc || 0
  stats.value.products = pc || 0
  recentOrders.value = (orders || []) as { order_number: string; total_eur: number; status: string; created_at: string }[]
  const { data: allOrders } = await supabase.from('orders').select('total_eur').eq('payment_status', 'paid')
  stats.value.revenue = allOrders?.reduce((s, o) => s + (o.total_eur || 0), 0) || 0
  loading.value = false
})

const cards = [
  { key: 'revenue', label: 'Revenus', icon: DollarSign, format: (v: number) => `${(v/100).toFixed(2)} €` },
  { key: 'orders', label: 'Commandes', icon: ShoppingCart, format: (v: number) => String(v) },
  { key: 'customers', label: 'Clients', icon: Users, format: (v: number) => String(v) },
  { key: 'products', label: 'Produits', icon: Package, format: (v: number) => String(v) },
]
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Tableau de bord</h1>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="card in cards" :key="card.key" class="bg-white rounded-xl border border-wood-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><component :is="card.icon" class="w-5 h-5 text-primary-500" /></div>
        </div>
        <p class="text-2xl font-semibold text-primary-500">{{ loading ? '...' : card.format(stats[card.key as keyof typeof stats] as number) }}</p>
        <p class="text-xs text-wood-400 mt-1">{{ card.label }}</p>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-wood-200 p-6">
      <h2 class="font-medium text-primary-500 mb-4 flex items-center gap-2"><TrendingUp class="w-5 h-5" /> Commandes récentes</h2>
      <div v-if="recentOrders.length === 0" class="text-sm text-wood-400 py-4">Aucune commande pour le moment</div>
      <div v-else class="space-y-2">
        <div v-for="order in recentOrders" :key="order.order_number" class="flex items-center justify-between py-3 border-b border-wood-100 last:border-0">
          <div><p class="text-sm font-medium text-primary-500">{{ order.order_number }}</p><p class="text-xs text-wood-400">{{ new Date(order.created_at).toLocaleDateString('fr-FR') }}</p></div>
          <div class="flex items-center gap-4"><span class="text-sm text-wood-500">{{ STATUS_LABELS[order.status] }}</span><span class="font-semibold text-primary-500">{{ (order.total_eur / 100).toFixed(2) }} €</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
