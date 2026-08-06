<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendingUp, Package, Users, Euro, ShoppingCart, ArrowUpRight, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { STATUS_LABELS, STATUS_COLORS } from '@/types/index'

const stats = ref({ revenue: 0, orders: 0, customers: 0, products: 0 })
const recentOrders = ref<{ order_number: string; total_eur: number; status: string; created_at: string }[]>([])
const loading = ref(true)

onMounted(async () => {
  const [{ data: orders }, { count: oc }, { count: cc }, { count: pc }] = await Promise.all([
    supabase.from('orders').select('order_number, total_eur, status, created_at').order('created_at', { ascending: false }).limit(6),
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

const statusIcon: Record<string, unknown> = {
  pending: Clock, confirmed: CheckCircle2, preparing: AlertCircle,
  shipped: Truck, delivered: CheckCircle2, cancelled: XCircle,
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
function fmtEur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v / 100)
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#C89B5D;">Vue d'ensemble</p>
        <h1 class="font-display text-2xl font-semibold" style="color:#4A2C1A;">Tableau de bord</h1>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style="background:#E8D4A8; color:#6B4226;">
        <span class="w-2 h-2 rounded-full animate-pulse" style="background:#4E7A51;"></span>
        Données en temps réel
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <!-- Revenue highlight card -->
      <div class="col-span-2 xl:col-span-1 rounded-2xl p-6 text-white relative overflow-hidden" style="background:linear-gradient(135deg, #4A2C1A 0%, #6B4226 100%);">
        <div class="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style="background:#C89B5D; transform:translate(30%,-30%);"></div>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background:rgba(200,155,93,0.25);">
          <Euro class="w-5 h-5" style="color:#C89B5D;" />
        </div>
        <p class="text-2xl font-bold tracking-tight">
          {{ loading ? '—' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.revenue / 100) }}
        </p>
        <p class="text-xs mt-1" style="color:#E8D4A8;">Revenus encaissés</p>
        <div class="flex items-center gap-1 mt-3 text-xs font-medium" style="color:#C89B5D;">
          <TrendingUp class="w-3.5 h-3.5" /> Paiements confirmés
        </div>
      </div>

      <!-- Orders -->
      <div class="rounded-2xl p-6 bg-white border" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#E8D4A8;">
            <ShoppingCart class="w-5 h-5" style="color:#6B4226;" />
          </div>
          <ArrowUpRight class="w-4 h-4" style="color:#C89B5D;" />
        </div>
        <p class="text-2xl font-bold" style="color:#4A2C1A;">{{ loading ? '—' : stats.orders }}</p>
        <p class="text-xs mt-1" style="color:#7A7167;">Commandes totales</p>
      </div>

      <!-- Customers -->
      <div class="rounded-2xl p-6 bg-white border" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#E8D4A8;">
            <Users class="w-5 h-5" style="color:#6B4226;" />
          </div>
          <ArrowUpRight class="w-4 h-4" style="color:#C89B5D;" />
        </div>
        <p class="text-2xl font-bold" style="color:#4A2C1A;">{{ loading ? '—' : stats.customers }}</p>
        <p class="text-xs mt-1" style="color:#7A7167;">Clients inscrits</p>
      </div>

      <!-- Products -->
      <div class="rounded-2xl p-6 bg-white border" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#E8D4A8;">
            <Package class="w-5 h-5" style="color:#6B4226;" />
          </div>
          <ArrowUpRight class="w-4 h-4" style="color:#C89B5D;" />
        </div>
        <p class="text-2xl font-bold" style="color:#4A2C1A;">{{ loading ? '—' : stats.products }}</p>
        <p class="text-xs mt-1" style="color:#7A7167;">Produits actifs</p>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="grid xl:grid-cols-3 gap-6">
      <!-- Recent orders table -->
      <div class="xl:col-span-2 bg-white rounded-2xl border p-6" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-semibold text-base" style="color:#4A2C1A;">Commandes récentes</h2>
          <a href="/admin/commandes" class="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style="background:#E8D4A8; color:#6B4226;">
            Voir tout <ArrowUpRight class="w-3.5 h-3.5" />
          </a>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="n in 5" :key="n" class="h-12 rounded-xl animate-pulse" style="background:#FAF7F2;"></div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="text-center py-12">
          <ShoppingCart class="w-10 h-10 mx-auto mb-3" style="color:#E2DCD1;" />
          <p class="text-sm" style="color:#7A7167;">Aucune commande pour le moment</p>
        </div>

        <div v-else class="space-y-2">
          <!-- Header -->
          <div class="grid grid-cols-12 gap-3 px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style="color:#7A7167;">
            <span class="col-span-4">Référence</span>
            <span class="col-span-3">Date</span>
            <span class="col-span-3">Statut</span>
            <span class="col-span-2 text-right">Total</span>
          </div>
          <div v-for="order in recentOrders" :key="order.order_number"
            class="grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl transition-colors hover:bg-neutral-50"
            style="border:1px solid transparent;"
            onmouseover="this.style.borderColor='#E2DCD1'" onmouseout="this.style.borderColor='transparent'">
            <span class="col-span-4 font-semibold text-sm" style="color:#4A2C1A;">{{ order.order_number }}</span>
            <span class="col-span-3 text-sm" style="color:#7A7167;">{{ fmtDate(order.created_at) }}</span>
            <span class="col-span-3">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                :class="STATUS_COLORS[order.status]">
                <component :is="statusIcon[order.status]" class="w-3 h-3" />
                {{ STATUS_LABELS[order.status] }}
              </span>
            </span>
            <span class="col-span-2 text-right font-bold text-sm" style="color:#4A2C1A;">
              {{ fmtEur(order.total_eur) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-5">
        <!-- Quick stats card -->
        <div class="rounded-2xl p-6 text-white" style="background:linear-gradient(135deg, #6B4226 0%, #4A2C1A 100%);">
          <h3 class="font-semibold text-sm mb-4" style="color:#E8D4A8;">Accès rapides</h3>
          <div class="space-y-3">
            <a href="/admin/produits" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <Package class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">Gérer les produits</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </a>
            <a href="/admin/commandes" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <ShoppingCart class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">Voir les commandes</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </a>
            <a href="/admin/clients" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <Users class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">Base clients</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </a>
          </div>
        </div>

        <!-- Essence breakdown -->
        <div class="bg-white rounded-2xl border p-6" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
          <h3 class="font-semibold text-sm mb-5" style="color:#4A2C1A;">Répartition par essence</h3>
          <div class="space-y-3">
            <div v-for="(item, i) in [
              { label: 'Chêne', pct: 38, color: '#4A2C1A' },
              { label: 'Hêtre', pct: 29, color: '#6B4226' },
              { label: 'Pin', pct: 21, color: '#C89B5D' },
              { label: 'Sapin', pct: 12, color: '#E8D4A8' },
            ]" :key="i">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-medium" style="color:#4A2C1A;">{{ item.label }}</span>
                <span style="color:#7A7167;">{{ item.pct }}%</span>
              </div>
              <div class="w-full rounded-full h-2" style="background:#FAF7F2;">
                <div class="h-2 rounded-full transition-all" :style="`width:${item.pct}%; background:${item.color};`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
