<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api, type OrderDto } from '@/lib/api'
import { STATUS_LABELS } from '@/types/index'

const orders = ref<OrderDto[]>([])
const loading = ref(true)
const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

onMounted(load)

async function load() {
  loading.value = true
  orders.value = await api.admin.listOrders()
  loading.value = false
}

async function updateStatus(order: OrderDto, status: string) {
  await api.admin.updateOrderStatus(order.id, status as OrderDto['status'])
  order.status = status as OrderDto['status']
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Gestion des commandes</h1>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="orders.length === 0" class="p-10 text-center text-wood-400">Aucune commande</div>

      <div v-else>
        <!-- Mobile cards -->
        <div class="sm:hidden divide-y divide-wood-100">
          <div v-for="order in orders" :key="order.id" class="p-4 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-primary-500 text-sm">{{ order.order_number }}</p>
              <span class="text-xs text-wood-400">{{ new Date(order.created_at).toLocaleDateString('fr-FR') }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full capitalize" :class="{
                  'bg-success-100 text-success-500': order.payment_status === 'paid',
                  'bg-warning-100 text-warning-500': order.payment_status === 'pending' || order.payment_status === 'awaiting_transfer',
                  'bg-error-100 text-error-500': order.payment_status === 'failed',
                }">{{ order.payment_status }}</span>
                <span class="font-semibold text-primary-500">{{ (order.total_eur / 100).toFixed(2) }} €</span>
              </div>
              <select :value="order.status" @change="updateStatus(order, ($event.target as HTMLSelectElement).value)" class="text-xs px-2 py-1.5 border border-wood-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 max-w-[45%]"><option v-for="s in statuses" :key="s" :value="s">{{ STATUS_LABELS[s] }}</option></select>
            </div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-wood-100 text-wood-500 text-left">
              <tr><th class="px-4 py-3 font-medium">N° Commande</th><th class="px-4 py-3 font-medium">Date</th><th class="px-4 py-3 font-medium">Total</th><th class="px-4 py-3 font-medium">Paiement</th><th class="px-4 py-3 font-medium">Statut</th></tr>
            </thead>
            <tbody class="divide-y divide-wood-100">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-wood-50">
                <td class="px-4 py-3 font-medium text-primary-500">{{ order.order_number }}</td>
                <td class="px-4 py-3 text-wood-500">{{ new Date(order.created_at).toLocaleDateString('fr-FR') }}</td>
                <td class="px-4 py-3 text-wood-500">{{ (order.total_eur / 100).toFixed(2) }} €</td>
                <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full capitalize" :class="{
                  'bg-success-100 text-success-500': order.payment_status === 'paid',
                  'bg-warning-100 text-warning-500': order.payment_status === 'pending' || order.payment_status === 'awaiting_transfer',
                  'bg-error-100 text-error-500': order.payment_status === 'failed',
                }">{{ order.payment_status }}</span></td>
                <td class="px-4 py-3"><select :value="order.status" @change="updateStatus(order, ($event.target as HTMLSelectElement).value)" class="text-xs px-2 py-1 border border-wood-200 rounded-lg focus:outline-none focus:border-primary-500"><option v-for="s in statuses" :key="s" :value="s">{{ STATUS_LABELS[s] }}</option></select></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
