<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Package, Heart, TrendingUp, ShoppingBag } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const stats = ref({ orders: 0, favorites: 0, totalSpent: 0 })

onMounted(async () => {
  const [{ data: orders }, { count: favCount }] = await Promise.all([
    supabase.from('orders').select('total_eur').eq('user_id', auth.user!.id),
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', auth.user!.id),
  ])
  stats.value.orders = orders?.length || 0
  stats.value.favorites = favCount || 0
  stats.value.totalSpent = orders?.reduce((s, o) => s + (o.total_eur || 0), 0) || 0
})

const cards = [
  { key: 'orders', label: 'Commandes', icon: Package, format: (v: number) => String(v) },
  { key: 'favorites', label: 'Favoris', icon: Heart, format: (v: number) => String(v) },
  { key: 'totalSpent', label: 'Total dépensé', icon: TrendingUp, format: (v: number) => `${(v/100).toFixed(2)} €` },
]
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Tableau de bord</h1>
    <p class="text-wood-500 mb-6">Bienvenue, {{ auth.fullName || 'cher client' }} !</p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="card in cards" :key="card.key" class="bg-white rounded-xl border border-wood-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><component :is="card.icon" class="w-5 h-5 text-primary-500" /></div>
        </div>
        <p class="text-2xl font-semibold text-primary-500">{{ card.format(stats[card.key as keyof typeof stats] as number) }}</p>
        <p class="text-xs text-wood-400 mt-1">{{ card.label }}</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-xl border border-wood-200 p-6">
      <div class="flex items-center gap-2 mb-4"><ShoppingBag class="w-5 h-5 text-primary-500" /><h2 class="font-medium text-primary-500">Activité récente</h2></div>
      <p class="text-sm text-wood-400">Vos commandes et favoris apparaîtront ici.</p>
    </div>
  </div>
</template>
