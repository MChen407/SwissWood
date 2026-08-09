<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Package, ChevronRight } from 'lucide-vue-next'
import { api, type OrderDto } from '@/lib/api'
import { STATUS_LABELS, STATUS_COLORS } from '@/types/index'

const orders = ref<OrderDto[]>([])
const loading = ref(true)

onMounted(async () => {
  orders.value = await api.orders.listMine()
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Mes commandes</h1>
    <div v-if="loading" class="text-center py-10"><p class="text-wood-400">Chargement...</p></div>
    <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-xl border border-wood-200">
      <Package class="w-12 h-12 text-wood-300 mx-auto mb-3" />
      <p class="text-wood-500">Vous n'avez pas encore de commande</p>
      <RouterLink to="/catalogue" class="text-primary-500 hover:underline mt-2 inline-block">Parcourir le catalogue</RouterLink>
    </div>
    <div v-else class="space-y-3">
      <RouterLink v-for="order in orders" :key="order.id" :to="`/mon-compte/commandes/${order.id}`"
        class="block bg-white rounded-xl border border-wood-200 p-5 hover:border-primary-500 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-primary-500">{{ order.order_number }}</p>
            <p class="text-xs text-wood-400 mt-1">{{ new Date(order.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span :class="['text-xs px-3 py-1 rounded-full font-medium', STATUS_COLORS[order.status]]">{{ STATUS_LABELS[order.status] }}</span>
            <span class="font-semibold text-primary-500">{{ (order.total_eur / 100).toFixed(2) }} €</span>
            <ChevronRight class="w-5 h-5 text-wood-300" />
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
