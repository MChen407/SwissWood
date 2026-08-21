<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Package, Heart, TrendingUp, ShoppingBag } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const stats = ref({ orders: 0, favorites: 0, totalSpent: 0 })

onMounted(async () => {
  const [orders, favs] = await Promise.all([
    api.orders.listMine(),
    api.favorites.list(),
  ])
  stats.value.orders = orders.length
  stats.value.favorites = favs.length
  stats.value.totalSpent = orders.reduce((s, o) => s + (o.total_eur || 0), 0)
})

const cards = [
  { key: 'orders', labelKey: 'ordersLabel', icon: Package, format: (v: number) => String(v) },
  { key: 'favorites', labelKey: 'favoritesLabel', icon: Heart, format: (v: number) => String(v) },
  { key: 'totalSpent', labelKey: 'totalSpent', icon: TrendingUp, format: (v: number) => `${(v/100).toFixed(2)} €` },
]
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('dashboard.dashboardTitle') }}</h1>
    <p class="text-wood-500 mb-6">{{ t('dashboard.welcomeBack', { name: auth.fullName || t('dashboard.dearCustomer') }) }}</p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="card in cards" :key="card.key" class="bg-white rounded-xl border border-wood-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><component :is="card.icon" class="w-5 h-5 text-primary-500" /></div>
        </div>
        <p class="text-2xl font-semibold text-primary-500">{{ card.format(stats[card.key as keyof typeof stats] as number) }}</p>
        <p class="text-xs text-wood-400 mt-1">{{ t(`dashboard.${card.labelKey}`) }}</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-xl border border-wood-200 p-6">
      <div class="flex items-center gap-2 mb-4"><ShoppingBag class="w-5 h-5 text-primary-500" /><h2 class="font-medium text-primary-500">{{ t('dashboard.recentActivity') }}</h2></div>
      <p class="text-sm text-wood-400">{{ t('dashboard.recentActivityHint') }}</p>
    </div>
  </div>
</template>
