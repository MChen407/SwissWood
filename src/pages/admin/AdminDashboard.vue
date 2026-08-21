<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendingUp, Package, Users, Euro, ShoppingCart, ArrowUpRight, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from 'lucide-vue-next'
import { api, type OrderDto } from '@/lib/api'
import { STATUS_KEYS, STATUS_COLORS } from '@/types/index'
import { useLocaleStore } from '@/stores/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()
const stats = ref({ revenue: 0, orders: 0, customers: 0, products: 0 })
const recentOrders = ref<OrderDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const data = await api.admin.stats()
  stats.value.revenue = data.revenue
  stats.value.orders = data.orders
  stats.value.customers = data.customers
  stats.value.products = data.products
  recentOrders.value = data.recent_orders
  loading.value = false
})

const statusIcon: Record<string, unknown> = {
  pending: Clock, confirmed: CheckCircle2, preparing: AlertCircle,
  shipped: Truck, delivered: CheckCircle2, cancelled: XCircle,
}

function statusLabel(status: string) {
  return t(`status.${STATUS_KEYS[status] ?? status}`)
}

const essenceBreakdown = [
  { key: 'essences.Chene', pct: 30, color: '#4A2C1A' },
  { key: 'essences.Hetre', pct: 22, color: '#6B4226' },
  { key: 'essences.Charme', pct: 18, color: '#C89B5D' },
  { key: 'essences.Frene', pct: 15, color: '#E8D4A8' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(localeStore.locale, { day: '2-digit', month: 'short' })
}
function fmtEur(v: number) {
  return new Intl.NumberFormat(localeStore.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v / 100)
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#C89B5D;">{{ t('admin.overview') }}</p>
        <h1 class="font-display text-2xl font-semibold" style="color:#4A2C1A;">{{ t('admin.dashboard') }}</h1>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style="background:#E8D4A8; color:#6B4226;">
        <span class="w-2 h-2 rounded-full animate-pulse" style="background:#4E7A51;"></span>
        {{ t('admin.realtimeData') }}
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
          {{ loading ? '—' : fmtEur(stats.revenue) }}
        </p>
        <p class="text-xs mt-1" style="color:#E8D4A8;">{{ t('admin.revenueReceived') }}</p>
        <div class="flex items-center gap-1 mt-3 text-xs font-medium" style="color:#C89B5D;">
          <TrendingUp class="w-3.5 h-3.5" /> {{ t('admin.confirmedPayments') }}
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
        <p class="text-xs mt-1" style="color:#7A7167;">{{ t('admin.totalOrders') }}</p>
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
        <p class="text-xs mt-1" style="color:#7A7167;">{{ t('admin.registeredCustomers') }}</p>
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
        <p class="text-xs mt-1" style="color:#7A7167;">{{ t('admin.activeProducts') }}</p>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="grid xl:grid-cols-3 gap-6">
      <!-- Recent orders table -->
      <div class="xl:col-span-2 bg-white rounded-2xl border p-6" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-semibold text-base" style="color:#4A2C1A;">{{ t('admin.recentOrders') }}</h2>
          <a href="/admin/commandes" class="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style="background:#E8D4A8; color:#6B4226;">
            {{ t('admin.viewAll') }} <ArrowUpRight class="w-3.5 h-3.5" />
          </a>
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="n in 5" :key="n" class="h-12 rounded-xl animate-pulse" style="background:#FAF7F2;"></div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="text-center py-12">
          <ShoppingCart class="w-10 h-10 mx-auto mb-3" style="color:#E2DCD1;" />
          <p class="text-sm" style="color:#7A7167;">{{ t('admin.noOrdersYet') }}</p>
        </div>

        <div v-else>
          <!-- Mobile cards -->
          <div class="sm:hidden space-y-2">
            <div v-for="order in recentOrders" :key="order.order_number"
              class="rounded-xl px-3 py-3 transition-colors hover:bg-neutral-50"
              style="border:1px solid #E2DCD1;">
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-sm truncate" style="color:#4A2C1A;">{{ order.order_number }}</span>
                <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                  :class="STATUS_COLORS[order.status]">
                  <component :is="statusIcon[order.status]" class="w-3 h-3" />
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs" style="color:#7A7167;">{{ fmtDate(order.created_at) }}</span>
                <span class="text-sm font-bold" style="color:#4A2C1A;">{{ fmtEur(order.total_eur) }}</span>
              </div>
            </div>
          </div>

          <!-- Desktop rows -->
          <div class="hidden sm:block space-y-2">
            <!-- Header -->
            <div class="grid grid-cols-12 gap-3 px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style="color:#7A7167;">
              <span class="col-span-4">{{ t('admin.reference') }}</span>
              <span class="col-span-3">{{ t('admin.date') }}</span>
              <span class="col-span-3">{{ t('admin.status') }}</span>
              <span class="col-span-2 text-right">{{ t('admin.total') }}</span>
            </div>
            <div v-for="order in recentOrders" :key="order.order_number"
              class="grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl transition-colors hover:bg-neutral-50"
              style="border:1px solid transparent;"
              onmouseover="this.style.borderColor='#E2DCD1'" onmouseout="this.style.borderColor='transparent'">
              <span class="col-span-4 font-semibold text-sm truncate" style="color:#4A2C1A;">{{ order.order_number }}</span>
              <span class="col-span-3 text-sm" style="color:#7A7167;">{{ fmtDate(order.created_at) }}</span>
              <span class="col-span-3">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  :class="STATUS_COLORS[order.status]">
                  <component :is="statusIcon[order.status]" class="w-3 h-3" />
                  {{ statusLabel(order.status) }}
                </span>
              </span>
              <span class="col-span-2 text-right font-bold text-sm" style="color:#4A2C1A;">
                {{ fmtEur(order.total_eur) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-5">
        <!-- Quick stats card -->
        <div class="rounded-2xl p-6 text-white" style="background:linear-gradient(135deg, #6B4226 0%, #4A2C1A 100%);">
          <h3 class="font-semibold text-sm mb-4" style="color:#E8D4A8;">{{ t('admin.quickAccess') }}</h3>
          <div class="space-y-3">
            <RouterLink to="/admin/produits" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <Package class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">{{ t('admin.manageProducts') }}</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </RouterLink>
            <RouterLink to="/admin/commandes" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <ShoppingCart class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">{{ t('admin.viewOrders') }}</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </RouterLink>
            <RouterLink to="/admin/clients" class="flex items-center gap-3 p-3 rounded-xl transition-colors" style="background:rgba(232,212,168,0.1);"
              onmouseover="this.style.background='rgba(232,212,168,0.18)'" onmouseout="this.style.background='rgba(232,212,168,0.1)'">
              <Users class="w-4 h-4" style="color:#C89B5D;" />
              <span class="text-sm">{{ t('admin.customerBase') }}</span>
              <ArrowUpRight class="w-3.5 h-3.5 ml-auto" style="color:#C89B5D;" />
            </RouterLink>
          </div>
        </div>

        <!-- Essence breakdown -->
        <div class="bg-white rounded-2xl border p-6" style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">
          <h3 class="font-semibold text-sm mb-5" style="color:#4A2C1A;">{{ t('admin.breakdownByEssence') }}</h3>
          <div class="space-y-3">
            <div v-for="(item, i) in [...essenceBreakdown.map(e => ({ ...e })), { key: 'admin.others', pct: 15, color: '#7A7167' }]" :key="i">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-medium" style="color:#4A2C1A;">{{ t(item.key) }}</span>
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
