<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'
import { api, resolveImageUrl, type OrderDetailDto } from '@/lib/api'
import { STATUS_KEYS } from '@/types/index'
import { useLocaleStore } from '@/stores/locale'

const { t } = useI18n()
const locale = useLocaleStore()
const route = useRoute()
const order = ref<OrderDetailDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const orderId = route.params.id as string
  try {
    order.value = await api.orders.getMine(orderId)
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <RouterLink to="/mon-compte/commandes" class="inline-flex items-center gap-1 text-sm text-wood-500 hover:text-primary-500 mb-4"><ArrowLeft class="w-4 h-4" /> {{ t('dashboard.backToOrders') }}</RouterLink>
    <div v-if="loading" class="text-center py-10"><p class="text-wood-400">{{ t('common.loading') }}</p></div>
    <div v-else-if="order">
      <h1 class="font-display text-2xl font-medium text-primary-500 mb-2">{{ order.order_number }}</h1>
      <p class="text-sm text-wood-400 mb-6">{{ new Date(order.created_at).toLocaleDateString(locale.locale, { dateStyle: 'long' }) }}</p>

      <div class="bg-white rounded-xl border border-wood-200 p-6 mb-6">
        <div class="grid sm:grid-cols-3 gap-4 text-sm">
          <div><p class="text-wood-400 text-xs">{{ t('dashboard.status') }}</p><p class="font-medium text-primary-500 mt-1">{{ t(`status.${STATUS_KEYS[order.status]}`) }}</p></div>
          <div><p class="text-wood-400 text-xs">{{ t('dashboard.payment') }}</p><p class="font-medium text-primary-500 mt-1 capitalize">{{ order.payment_status }}</p></div>
          <div><p class="text-wood-400 text-xs">{{ t('dashboard.method') }}</p><p class="font-medium text-primary-500 mt-1">{{ order.payment_method === 'card' ? t('dashboard.cardMethod') : t('dashboard.transferMethod') }}</p></div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-wood-200 p-6">
        <h2 class="font-medium text-primary-500 mb-4">{{ t('dashboard.items') }}</h2>
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 pb-3 border-b border-wood-100 last:border-0">
            <img v-if="item.product?.images?.[0]" :src="resolveImageUrl(item.product.images[0])" :alt="item.product?.name" class="w-14 h-14 rounded-md object-cover" />
            <div class="flex-1">
              <p class="text-sm font-medium text-primary-500">{{ item.product?.name || t('dashboard.product') }}</p>
              <p class="text-xs text-wood-400">{{ item.quantity }} × {{ (item.unit_price_eur / 100).toFixed(2) }} €</p>
              <div v-if="Object.keys(item.customization).length > 0" class="flex flex-wrap gap-1 mt-1">
                <span v-for="(val, key) in item.customization" :key="String(key)" class="text-xs bg-wood-100 px-1.5 py-0.5 rounded text-wood-500">{{ key }}: {{ val }}</span>
              </div>
            </div>
            <span class="font-semibold text-primary-500">{{ ((item.quantity as number) * item.unit_price_eur / 100).toFixed(2) }} €</span>
          </div>
        </div>
        <div class="border-t border-wood-200 mt-4 pt-4 flex justify-between">
          <span class="font-medium text-primary-500">{{ t('dashboard.total') }}</span>
          <span class="text-lg font-semibold text-primary-500">{{ (order.total_eur / 100).toFixed(2) }} €</span>
        </div>
      </div>

      <div v-if="order.payments.length > 0" class="bg-white rounded-xl border border-wood-200 p-6 mt-6">
        <h2 class="font-medium text-primary-500 mb-4">{{ t('dashboard.transactions') }}</h2>
        <div v-for="pay in order.payments" :key="pay.id" class="flex items-center justify-between py-2 border-b border-wood-100 last:border-0 text-sm">
          <div><p class="font-medium text-primary-500">{{ pay.reference }}</p><p class="text-xs text-wood-400">{{ pay.method === 'card' ? t('dashboard.cardMethod') : t('dashboard.transferMethod') }}</p></div>
          <div class="text-right"><p class="font-medium">{{ (pay.amount_eur / 100).toFixed(2) }} €</p><p class="text-xs capitalize" :class="pay.status === 'completed' ? 'text-success-500' : 'text-warning-500'">{{ pay.status }}</p></div>
        </div>
      </div>
    </div>
  </div>
</template>
