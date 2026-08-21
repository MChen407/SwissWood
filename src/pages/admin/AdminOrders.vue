<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api, type OrderDto } from '@/lib/api'
import { STATUS_KEYS } from '@/types/index'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import { useLocaleStore } from '@/stores/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()
const orders = ref<OrderDto[]>([])
const loading = ref(true)
const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

const PAYMENT_STATUS_KEYS: Record<string, string> = {
  paid: 'status.paymentPaid',
  pending: 'status.paymentPending',
  awaiting_transfer: 'status.paymentAwaiting',
  failed: 'status.paymentFailed',
  refunded: 'status.paymentRefunded',
}

function paymentLabel(status: string) {
  const key = PAYMENT_STATUS_KEYS[status]
  return key ? t(key) : status
}

function statusOptionLabel(status: string) {
  return t(`status.${STATUS_KEYS[status] ?? status}`)
}

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
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('admin.ordersTitle') }}</h1>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">{{ t('common.loading') }}</div>
      <div v-else-if="orders.length === 0" class="p-10 text-center text-wood-400">{{ t('admin.noOrders') }}</div>

      <div v-else>
        <!-- Mobile cards -->
        <div class="sm:hidden divide-y divide-wood-100">
          <div v-for="order in orders" :key="order.id" class="p-4 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-primary-500 text-sm">{{ order.order_number }}</p>
              <span class="text-xs text-wood-400">{{ new Date(order.created_at).toLocaleDateString(localeStore.locale) }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full" :class="{
                  'bg-success-100 text-success-500': order.payment_status === 'paid',
                  'bg-warning-100 text-warning-500': order.payment_status === 'pending' || order.payment_status === 'awaiting_transfer',
                  'bg-error-100 text-error-500': order.payment_status === 'failed',
                }">{{ paymentLabel(order.payment_status) }}</span>
                <span class="font-semibold text-primary-500">{{ (order.total_eur / 100).toFixed(2) }} €</span>
              </div>
              <div class="max-w-[45%]">
                <SearchableSelect size="sm" :model-value="order.status" :options="statuses.map(s => ({ value: s, label: statusOptionLabel(s) }))" @update:model-value="updateStatus(order, $event)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-wood-100 text-wood-500 text-left">
              <tr><th class="px-4 py-3 font-medium">{{ t('admin.orderNo') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.date') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.total') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.payments') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.status') }}</th></tr>
            </thead>
            <tbody class="divide-y divide-wood-100">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-wood-50">
                <td class="px-4 py-3 font-medium text-primary-500">{{ order.order_number }}</td>
                <td class="px-4 py-3 text-wood-500">{{ new Date(order.created_at).toLocaleDateString(localeStore.locale) }}</td>
                <td class="px-4 py-3 text-wood-500">{{ (order.total_eur / 100).toFixed(2) }} €</td>
                <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full" :class="{
                  'bg-success-100 text-success-500': order.payment_status === 'paid',
                  'bg-warning-100 text-warning-500': order.payment_status === 'pending' || order.payment_status === 'awaiting_transfer',
                  'bg-error-100 text-error-500': order.payment_status === 'failed',
                }">{{ paymentLabel(order.payment_status) }}</span></td>
                <td class="px-4 py-3"><div class="min-w-[150px]"><SearchableSelect size="sm" :model-value="order.status" :options="statuses.map(s => ({ value: s, label: statusOptionLabel(s) }))" @update:model-value="updateStatus(order, $event)" /></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
